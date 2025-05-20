import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useCallback, useMemo } from "react";

// React Query
import { useQueryClient } from "@tanstack/react-query";

// Navigation
import {
    useNavigation,
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
import { Article, categories } from "../../common/types/news.types";

// Stores
import { newsStore } from "../../stores/NewsStore";
import { settingsStore } from "../../stores/SettingsStore";

// API Service
import { useTopHeadlines } from "../../services/news.hooks";

// Components
import Container from "../../common/components/Container";
import CategoryItem from "./components/CategoryItem";
import ArticleItem from "./components/ArticleItem";

type HomeScreenNavigationProp = CompositeNavigationProp<
    NativeStackNavigationProp<BottomTabParamList, "Home">,
    NativeStackNavigationProp<RootStackParamList>
>;

const HomeScreen = observer(() => {
    const navigation = useNavigation<HomeScreenNavigationProp>();

    const { selectedCategory } = newsStore;
    const { darkMode } = settingsStore;

    const queryClient = useQueryClient();

    const {
        data: articles = [],
        isLoading,
        error,
        refetch,
        isRefetching,
    } = useTopHeadlines(
        selectedCategory !== "all" ? selectedCategory : "general",
        20,
        1
    );

    const filteredArticles = useMemo(() => articles, [articles]);

    const handleArticlePress = useCallback(
        (articleId: string) => {
            const article = filteredArticles.find(
                (article) => article.id === articleId
            );

            if (article) {
                newsStore.cacheArticle(article);
                queryClient.setQueryData(["article", articleId], article);
            }

            navigation.navigate("ArticleDetail", { articleId });
        },
        [filteredArticles, navigation, queryClient]
    );

    const handleCategoryPress = useCallback(
        async (category: string) => {
            try {
                if (category !== selectedCategory) {
                    queryClient.invalidateQueries({
                        queryKey: ["topHeadlines"],
                    });
                    newsStore.setSelectedCategory(category);
                    await refetch();
                }
            } catch (error) {
                console.error("Error setting category:", error);
            }
        },
        [selectedCategory, queryClient, refetch]
    );

    const handleRefresh = useCallback(async () => {
        try {
            queryClient.invalidateQueries({ queryKey: ["topHeadlines"] });
            await refetch();
        } catch (error) {
            console.error("Error refreshing:", error);
        }
    }, [queryClient, refetch]);

    const renderCategoryItem = useCallback(
        ({ item }: { item: string }) => (
            <CategoryItem
                item={item}
                isSelected={selectedCategory === item}
                onPress={handleCategoryPress}
            />
        ),
        [selectedCategory, handleCategoryPress]
    );

    const renderArticleItem = useCallback(
        ({ item }: { item: Article }) => (
            <ArticleItem item={item} onPress={handleArticlePress} />
        ),
        [handleArticlePress]
    );

    const keyExtractor = useCallback(
        (item: Article, index: number) =>
            item.url || item.title || `article-${index}`,
        []
    );

    const getItemLayout = useCallback(
        (data: ArrayLike<Article> | null | undefined, index: number) => ({
            length: 200,
            offset: 200 * index,
            index,
        }),
        []
    );

    return (
        <Container>
            <View className="mb-4">
                <FlatList
                    data={categories}
                    renderItem={renderCategoryItem}
                    keyExtractor={(item) => item}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="pb-2"
                    extraData={darkMode}
                    removeClippedSubviews={true}
                    initialNumToRender={5}
                    maxToRenderPerBatch={5}
                    windowSize={5}
                />
            </View>

            {isLoading && !isRefetching ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#3b82f6" />
                </View>
            ) : error ? (
                <View className="flex-1 items-center justify-center">
                    <Text className="text-red-500">
                        {(error as Error).message}
                    </Text>
                </View>
            ) : filteredArticles.length > 0 ? (
                <FlatList
                    data={filteredArticles}
                    renderItem={renderArticleItem}
                    keyExtractor={keyExtractor}
                    showsVerticalScrollIndicator={false}
                    contentContainerClassName="pb-4"
                    extraData={darkMode}
                    onRefresh={handleRefresh}
                    refreshing={isRefetching}
                    removeClippedSubviews={true}
                    initialNumToRender={5}
                    maxToRenderPerBatch={5}
                    windowSize={5}
                    getItemLayout={getItemLayout}
                />
            ) : (
                <View className="flex-1 items-center justify-center">
                    <Text
                        className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                        No articles found for this category
                    </Text>
                </View>
            )}
        </Container>
    );
});

export default HomeScreen;
