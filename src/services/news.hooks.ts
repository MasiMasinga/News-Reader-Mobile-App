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
            const localArticle = newsStore.getArticleById(id);
            if (localArticle) {
                newsStore.cacheArticle(localArticle);
                return localArticle;
            }

            const response = await NewsService.GetArticleById(id);
            if (response.status && response.data) {
                newsStore.cacheArticle(response.data);
                return response.data;
            }
            
            throw new Error("Article not found");
        },
        staleTime: 5 * 60 * 1000, 
        gcTime: 30 * 60 * 1000,
        retry: 1,
        retryDelay: 1000,
    });
}

export function useFavoriteArticles() {
    return useQuery({
        queryKey: ["favoriteArticles", newsStore.favoriteArticleIds],
        queryFn: () => newsStore.loadAllFavoriteArticles(),
        staleTime: 2 * 60 * 1000,
    });
} 