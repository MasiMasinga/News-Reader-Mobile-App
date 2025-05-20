import api from "./api";

// Types
import { Article } from "../common/types/news.types";

const NewsService = {
    async GetTopHeadlines(
        category: string = "general",
        pageSize: number = 20,
        page: number = 1
    ): Promise<{ status: boolean; data: Article[] }> {
        try {
            const response = await api.get("/top-headlines", {
                params: {
                    category,
                    pageSize,
                    page,
                },
            });

            const articles = response.data.articles.map((article: any) => ({
                ...article,
                id: article.url || `article-${Date.now()}-${Math.random()}`
            }));

            return {
                status: true,
                data: articles,
            };
        } catch {
            return {
                status: false,
                data: [],
            };
        }
    },

    async GetArticleById(
        id: string
    ): Promise<{ status: boolean; data: Article | null }> {
        try {
            if (id.startsWith("http")) {
                const response = await api.get("/everything", {
                    params: {
                        qInTitle: id.split("/").pop() || "",
                        pageSize: 1,
                        language: "en",
                    },
                });

                if (response.data.articles.length > 0) {
                    const article = response.data.articles[0];
                    return { 
                        status: true, 
                        data: {
                            ...article,
                            id: article.url || id
                        }
                    };
                }
            }

            const response = await api.get("/everything", {
                params: {
                    qInTitle: id,
                    pageSize: 1,
                    language: "en",
                },
            });

            if (response.data.articles.length > 0) {
                const article = response.data.articles[0];
                return { 
                    status: true, 
                    data: {
                        ...article,
                        id: article.url || id
                    }
                };
            }

            return { status: false, data: null };
        } catch {
            return { status: false, data: null };
        }
    },
};

export default NewsService;
