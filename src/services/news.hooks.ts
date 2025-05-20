// React Query
import { useQuery } from "@tanstack/react-query";

// Services
import NewsService from "./news.service";

// Store
import { newsStore } from "../stores/NewsStore";

export function useTopHeadlines(
    category: string = "general",
    pageSize: number = 20,
    page: number = 1
) {
    return useQuery({
        queryKey: ["topHeadlines", category, pageSize, page],
        queryFn: () =>
            NewsService.GetTopHeadlines(category, pageSize, page).then(
                (res) => res.data
            ),
        staleTime: 5 * 60 * 1000,
    });
}

export function useArticleById(id: string) {
    return useQuery({
        queryKey: ["article", id],
        queryFn: async () => {
            const localArticle =
                newsStore.articles.find((article) => article.id === id) ||
                newsStore.favoriteArticlesData[id];

            if (localArticle) return localArticle;

            return NewsService.GetArticleById(id).then((res) => res.data);
        },
        staleTime: 30 * 60 * 1000,
        retry: 1,
    });
}

export function useFavoriteArticles() {
    return useQuery({
        queryKey: ["favoriteArticles", newsStore.favoriteArticleIds],
        queryFn: () => newsStore.loadAllFavoriteArticles(),
        staleTime: 2 * 60 * 1000,
    });
} 