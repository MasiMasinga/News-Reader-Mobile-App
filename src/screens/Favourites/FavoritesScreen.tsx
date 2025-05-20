import { useCallback } from "react";
import { View, FlatList, ActivityIndicator, Alert, Text } from "react-native";

// Navigation
import {
    useNavigation,
    useFocusEffect,
    CompositeNavigationProp,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
    BottomTabParamList,
    RootStackParamList,
} from "../../navigation/AppNavigation";

// MobX
import { observer } from "mobx-react-lite";

// Types
import { Article } from "../../common/types/news.types";

// Stores
import { newsStore } from "../../stores/NewsStore";
import { settingsStore } from "../../stores/SettingsStore";

// React Query
import NewsService from "../../services/news.service";
import { useFavoriteArticles } from "../../services/news.hooks";
import { useQueryClient } from "@tanstack/react-query";

// Components
import Container from "../../common/components/Container";
import EmptyFavorites from "./components/EmptyFavorites";
import FavoriteArticleItem from "./components/FavoriteArticleItem";

type FavoritesScreenNavigationProp = CompositeNavigationProp<
    NativeStackNavigationProp<BottomTabParamList, "Favorites">,
    NativeStackNavigationProp<RootStackParamList>
>;

const FavoritesScreen = observer(() => {
    const navigation = useNavigation<FavoritesScreenNavigationProp>();
    const { darkMode } = settingsStore;
    
    const queryClient = useQueryClient();
    
    const { 
        data: favoriteArticles = [], 
        isLoading,
        error,
        refetch 
    } = useFavoriteArticles();

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch])
    );

    const handleArticlePress = (articleId: string) => {
        queryClient.prefetchQuery({
            queryKey: ["article", articleId],
            queryFn: () => NewsService.GetArticleById(articleId),
        });
        
        navigation.navigate("ArticleDetail", { articleId });
    };

    const handleRemoveFavorite = async (articleId: string) => {
        const success = await newsStore.toggleFavorite(articleId);

        if (success) {
            queryClient.invalidateQueries({ queryKey: ['favoriteArticles'] });
        } else {
            Alert.alert("Error", "Failed to remove article from favorites");
        }
    };

    const confirmRemove = (articleId: string, title: string) => {
        Alert.alert(
            "Remove from Favorites",
            `Are you sure you want to remove "${title}" from your favorites?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    onPress: () => handleRemoveFavorite(articleId),
                    style: "destructive",
                },
            ]
        );
    };

    const renderArticleItem = ({ item }: { item: Article }) => (
        <FavoriteArticleItem
            item={item}
            onArticlePress={handleArticlePress}
            onRemovePress={confirmRemove}
        />
    );

    return (
        <Container>
            {isLoading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator
                        size="large"
                        color={darkMode ? "#60a5fa" : "#3b82f6"}
                    />
                </View>
            ) : error ? (
                <View className="flex-1 items-center justify-center">
                    <Text
                        className={`text-lg ${darkMode ? "text-red-400" : "text-red-600"} mb-4`}
                    >
                        {(error as Error).message}
                    </Text>
                    <EmptyFavorites />
                </View>
            ) : favoriteArticles.length > 0 ? (
                <FlatList
                    data={favoriteArticles}
                    renderItem={renderArticleItem}
                    keyExtractor={(item, index) => item.url || item.title || `favorite-${index}`}
                    showsVerticalScrollIndicator={false}
                    contentContainerClassName="pb-4"
                    extraData={[darkMode, newsStore.favoriteArticleIds]}
                    onRefresh={refetch}
                    refreshing={isLoading}
                />
            ) : (
                <EmptyFavorites />
            )}
        </Container>
    );
});

export default FavoritesScreen;
