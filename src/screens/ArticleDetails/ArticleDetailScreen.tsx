import { useState, useEffect } from "react";
import {
    ScrollView,
    Linking,
    Share,
    Alert,
} from "react-native";

// Navigation
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigation";

// MobX
import { observer } from "mobx-react-lite";

// Stores
import { newsStore } from "../../stores/NewsStore";
import { settingsStore } from "../../stores/SettingsStore";

// React Query
import { useArticleById } from "../../services/news.hooks";
import { useQueryClient } from "@tanstack/react-query";

// Components
import Container from "../../common/components/Container";
import ArticleHeaderButtons from "./components/ArticleHeaderButtons";
import ArticleContent from "./components/ArticleContent";
import ArticleLoading from "./components/ArticleLoading";
import ArticleFallback from "./components/ArticleFallback";
import ArticleError from "./components/ArticleError";

type ArticleDetailScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "ArticleDetail"
>;
type ArticleDetailScreenRouteProp = RouteProp<
    RootStackParamList,
    "ArticleDetail"
>;

const ArticleDetailScreen = observer(() => {
    const navigation = useNavigation<ArticleDetailScreenNavigationProp>();
    const route = useRoute<ArticleDetailScreenRouteProp>();

    const queryClient = useQueryClient();

    const { articleId } = route.params;
    const { darkMode } = settingsStore;

    const [savingFavorite, setSavingFavorite] = useState(false);

    const {
        data: article,
        isLoading,
        error,
        refetch,
    } = useArticleById(articleId);

    const isFallbackArticle = article?.source?.id === "unavailable";

    const toggleFavorite = async () => {
        if (savingFavorite || !article) return;

        try {
            setSavingFavorite(true);
            const success = await newsStore.toggleFavorite(articleId);
            if (!success) {
                Alert.alert(
                    "Error",
                    "Failed to save article to favorites. Please try again."
                );
            } else {
                queryClient.invalidateQueries({
                    queryKey: ["favoriteArticles"],
                });

                navigation.setOptions({
                    headerRight: () => (
                        <ArticleHeaderButtons
                            isFavorite={newsStore.isArticleFavorite(articleId)}
                            onFavoritePress={toggleFavorite}
                            onSharePress={shareArticle}
                            isLoading={false}
                        />
                    ),
                });
            }
        } catch (error) {
            Alert.alert(
                "Error",
                "Something went wrong when saving this article. Please try again."
            );
        } finally {
            setSavingFavorite(false);
        }
    };

    const shareArticle = async () => {
        if (!article) return;

        try {
            await Share.share({
                message: `Check out this article: ${article.title} - ${article.url}`,
            });
        } catch (error) {
            console.error("Error sharing:", error);
        }
    };

    const openInBrowser = async () => {
        if (!article?.url) return;

        try {
            await Linking.openURL(article.url);
        } catch (error) {
            Alert.alert(
                "Error",
                "Could not open the URL. The link may be invalid."
            );
        }
    };

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <ArticleHeaderButtons
                    isFavorite={newsStore.isArticleFavorite(articleId)}
                    onFavoritePress={toggleFavorite}
                    onSharePress={shareArticle}
                    isLoading={savingFavorite}
                />
            ),
            headerTintColor: darkMode ? "#fff" : "#000",
        });
    }, [
        navigation,
        newsStore.favoriteArticleIds,
        article,
        darkMode,
        savingFavorite,
    ]);

    return (
        isLoading
            ? ArticleLoading(darkMode)
            : error || !article
                ? ArticleError(error, darkMode, navigation, refetch)
                : isFallbackArticle
                 ? ArticleFallback(article, darkMode, openInBrowser, refetch, navigation)
                    : (
                        <Container>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <ArticleContent
                                    article={article}
                                    onReadFullArticle={openInBrowser}
                                />
                            </ScrollView>
                        </Container>
        )
    );    

});

export default ArticleDetailScreen;
