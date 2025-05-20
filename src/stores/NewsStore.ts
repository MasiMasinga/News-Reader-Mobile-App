// MobX
import { makeAutoObservable, runInAction } from "mobx";

// AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

// Services
import NewsService from "../services/news.service";

// Types
import { Article, categories } from "../common/types/news.types";

class NewsStore {
    articles: Article[] = [];
    favoriteArticleIds: string[] = [];
    favoriteArticlesData: Record<string, Article> = {};
    selectedCategory: string = "all";
    isLoading: boolean = false;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
        this.loadFavorites();
    }

    setSelectedCategory(category: string) {
        this.selectedCategory = category;
        const boundFetch = this.fetchArticles.bind(this);
        boundFetch();
    }

    async fetchArticles() {
        try {
            runInAction(() => {
                this.isLoading = true;
                this.error = null;
            });

            if (!categories.includes(this.selectedCategory)) {
                this.selectedCategory = "all";
            }

            const response = await NewsService.GetTopHeadlines(
                this.selectedCategory,
                20,
                1
            );

            runInAction(() => {
                this.articles = response.data;
                this.isLoading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.error = "Failed to fetch articles";
                this.isLoading = false;
            });
        }
    }

    async getArticleById(id: string): Promise<Article | undefined> {
        const localArticle =
            this.articles.find((a) => a.id === id) ||
            this.favoriteArticlesData[id];
        if (localArticle || this.isLoading) return localArticle;

        runInAction(() => {
            this.isLoading = true;
            this.error = null;
        });

        try {
            const response = await NewsService.GetArticleById(id);
            if (response.status && response.data) {
                const fetchedArticle = response.data as Article;

                runInAction(() => {
                    if (
                        !this.articles.some((a) => a.id === fetchedArticle.id)
                    ) {
                        this.articles.push(fetchedArticle);
                    }
                    this.isLoading = false;
                });

                return fetchedArticle;
            }
        } catch {
            runInAction(() => {
                this.error = "Failed to fetch article details";
                this.isLoading = false;
            });
        }

        return undefined;
    }

    isArticleFavorite(id: string): boolean {
        return this.favoriteArticleIds.includes(id);
    }

    async toggleFavorite(id: string): Promise<boolean> {
        try {
            const article =
                this.articles.find((a) => a.id === id) ||
                this.favoriteArticlesData[id];
            const isFavorite = this.favoriteArticleIds.includes(id);

            if (!article && !isFavorite) return false;

            const updatedIds = isFavorite
                ? this.favoriteArticleIds.filter((favId) => favId !== id)
                : [...this.favoriteArticleIds, id];

            const updatedData = { ...this.favoriteArticlesData };
            if (isFavorite) {
                delete updatedData[id];
            } else {
                updatedData[id] = article!;
            }

            await Promise.all([
                AsyncStorage.setItem(
                    "favoriteArticles",
                    JSON.stringify(updatedIds)
                ),
                AsyncStorage.setItem(
                    "favoriteArticlesData",
                    JSON.stringify(updatedData)
                ),
            ]);

            runInAction(() => {
                this.favoriteArticleIds = updatedIds;
                this.favoriteArticlesData = updatedData;
            });

            return true;
        } catch {
            return false;
        }
    }

    async loadFavorites() {
        try {
            const [ids, data] = await Promise.all([
                AsyncStorage.getItem("favoriteArticles"),
                AsyncStorage.getItem("favoriteArticlesData"),
            ]);

            runInAction(() => {
                this.favoriteArticleIds = ids ? JSON.parse(ids) : [];
                this.favoriteArticlesData = data ? JSON.parse(data) : {};
            });
        } catch {
            runInAction(() => {
                this.favoriteArticleIds = [];
                this.favoriteArticlesData = {};
            });
        }
    }

    get favoriteArticles(): Article[] {
        const articlesFromStorage = Object.values(this.favoriteArticlesData);
        const missingIds = this.favoriteArticleIds.filter(
            (id) => !this.favoriteArticlesData[id]
        );
        const missingFromCache = this.articles.filter((article) =>
            missingIds.includes(article.id)
        );

        return [...articlesFromStorage, ...missingFromCache];
    }

    async loadAllFavoriteArticles(): Promise<Article[]> {
        if (this.favoriteArticleIds.length === 0) return [];

        this.isLoading = true;
        try {
            const existing = Object.values(this.favoriteArticlesData);
            const missingIds = this.favoriteArticleIds.filter(
                (id) =>
                    !this.favoriteArticlesData[id] &&
                    !this.articles.some((a) => a.id === id)
            );

            const fromArticles = this.articles.filter((a) =>
                missingIds.includes(a.id)
            );
            const remainingIds = missingIds.filter(
                (id) => !fromArticles.some((a) => a.id === id)
            );

            const fetched = await Promise.all(
                remainingIds.map((id) => NewsService.GetArticleById(id))
            );

            const validFetched = fetched
                .filter((r) => r.status && r.data)
                .map((r) => r.data as Article);

            const updatedData = {
                ...this.favoriteArticlesData,
                ...Object.fromEntries(
                    [...fromArticles, ...validFetched].map((article) => [
                        article.id,
                        article,
                    ])
                ),
            };

            if (
                Object.keys(updatedData).length >
                Object.keys(this.favoriteArticlesData).length
            ) {
                await AsyncStorage.setItem(
                    "favoriteArticlesData",
                    JSON.stringify(updatedData)
                );
            }

            runInAction(() => {
                this.favoriteArticlesData = updatedData;
                this.isLoading = false;
            });

            return [...existing, ...fromArticles, ...validFetched];
        } catch {
            runInAction(() => {
                this.error = "Failed to load favorite articles";
                this.isLoading = false;
            });
            return Object.values(this.favoriteArticlesData);
        }
    }

    async clearFavorites(): Promise<boolean> {
        try {
            await Promise.all([
                AsyncStorage.removeItem("favoriteArticles"),
                AsyncStorage.removeItem("favoriteArticlesData"),
            ]);

            runInAction(() => {
                this.favoriteArticleIds = [];
                this.favoriteArticlesData = {};
            });

            return true;
        } catch {
            return false;
        }
    }
}

export const newsStore = new NewsStore();
