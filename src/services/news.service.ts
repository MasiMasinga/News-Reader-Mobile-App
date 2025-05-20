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

            return {
                status: true,
                data: response.data.articles,
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
            const response = await api.get("/everything", {
                params: {
                    q: id,
                    pageSize: 10,
                    language: "en",
                    sortBy: "relevancy",
                },
            });

            const article = id.startsWith("http")
                ? response.data.articles.find((a: any) => a.url === id) ||
                  response.data.articles[0]
                : response.data.articles[0];

            return { status: true, data: article };
        } catch {
            return { status: false, data: null };
        }
    },
};

export default NewsService;
