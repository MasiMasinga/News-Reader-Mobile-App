import { View, Text, FlatList, ActivityIndicator } from "react-native";

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
    } = useTopHeadlines(
        selectedCategory !== "all" ? selectedCategory : "general"
    );

    const filteredArticles = articles;

    const handleArticlePress = (articleId: string) => {
        const article = filteredArticles.find(
            (article) => article.id === articleId
        );

        if (article) {
            if (!newsStore.articles.some((a) => a.id === articleId)) {
                newsStore.articles = [...newsStore.articles, article];
            }

            queryClient.prefetchQuery({
                queryKey: ["article", articleId],
                queryFn: async () => {
                    return article;
                },
            });
        }

        navigation.navigate("ArticleDetail", { articleId });
    };

    const handleCategoryPress = (category: string) => {
        try {
            if (category !== selectedCategory) {
                newsStore.selectedCategory = category;
            }
        } catch (error) {
            console.error("Error setting category:", error);
        }
    };

    const renderCategoryItem = ({ item }: { item: string }) => (
        <CategoryItem
            item={item}
            isSelected={selectedCategory === item}
            onPress={handleCategoryPress}
        />
    );

    const renderArticleItem = ({ item }: { item: Article }) => (
        <ArticleItem item={item} onPress={handleArticlePress} />
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
                />
            </View>

            {isLoading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator
                        size="large"
                        color={darkMode ? "#60a5fa" : "#3b82f6"}
                    />
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
                    keyExtractor={(item, index) =>
                        item.url || item.title || `article-${index}`
                    }
                    showsVerticalScrollIndicator={false}
                    contentContainerClassName="pb-4"
                    extraData={darkMode}
                    onRefresh={refetch}
                    refreshing={isLoading}
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
