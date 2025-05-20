import { useMemo } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Image,
} from "react-native";

// Navigation
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigation";

// MobX
import { observer } from "mobx-react-lite";

// Types
import { Article } from "../../common/types/news.types";

// Stores
import { newsStore } from "../../stores/NewsStore";
import { settingsStore } from "../../stores/SettingsStore";

// React Query
import { useTopHeadlines } from "../../services/news.hooks";
import { useQueryClient } from "@tanstack/react-query";

// Components
import Container from "../../common/components/Container";

type CategoryScreenNavigationProp =
    NativeStackNavigationProp<RootStackParamList>;
type CategoryScreenRouteProp = RouteProp<RootStackParamList, "Category">;

const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const CategoryScreen = observer(() => {
    const navigation = useNavigation<CategoryScreenNavigationProp>();
    const route = useRoute<CategoryScreenRouteProp>();
    const { category } = route.params;
    const { darkMode } = settingsStore;
    const queryClient = useQueryClient();

    const {
        data: articles = [],
        isLoading,
        error,
        refetch,
    } = useTopHeadlines(category !== "all" ? category : "general");

    const filteredArticles = useMemo(() => {
        if (category === "all") {
            return articles;
        }
        return articles.filter((article) => article.category === category);
    }, [category, articles]);

    const handleArticlePress = (articleId: string) => {
        const article = filteredArticles.find(
            (article) => article.id === articleId
        );

        if (article) {
            newsStore.cacheArticle(article);
            queryClient.setQueryData(["article", articleId], article);
        }

        navigation.navigate("ArticleDetail", { articleId });
    };

    const renderArticleItem = ({ item }: { item: Article }) => (
        <TouchableOpacity
            className={`p-4 mb-4 rounded-lg shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}
            onPress={() => handleArticlePress(item.id)}
        >
            {item.urlToImage && (
                <Image
                    source={{ uri: item.urlToImage }}
                    className="w-full h-48 rounded mb-2"
                    resizeMode="cover"
                />
            )}
            <Text
                className={`text-xs mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
                {item.source?.name || "Unknown Source"} •{" "}
                {formatDate(item.publishedAt)}
            </Text>
            <Text
                className={`text-lg font-bold mb-2 ${darkMode ? "text-white" : "text-black"}`}
            >
                {item.title}
            </Text>
            <Text
                className={`mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                numberOfLines={2}
            >
                {item.description}
            </Text>
            <View className="flex-row">
                <Text className="text-blue-500">Read more</Text>
            </View>
        </TouchableOpacity>
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
                        className={`text-lg ${darkMode ? "text-red-400" : "text-red-600"}`}
                    >
                        {(error as Error).message}
                    </Text>
                </View>
            ) : filteredArticles.length > 0 ? (
                <FlatList
                    data={filteredArticles}
                    renderItem={renderArticleItem}
                    keyExtractor={(item, index) =>
                        item.url || item.title || `category-article-${index}`
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

export default CategoryScreen;
