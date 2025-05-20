import { useQuery } from "@tanstack/react-query";
import { newsStore } from "./NewsStore";

export function useFavoriteArticles() {
    return useQuery({
        queryKey: ["favoriteArticles", newsStore.favoriteArticleIds],
        queryFn: async () => {
            const articles = await newsStore.loadAllFavoriteArticles();
            return articles;
        },
        staleTime: 2 * 60 * 1000,
    });
} 