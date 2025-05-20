import { View, Text, Image, TouchableOpacity } from "react-native";

// MobX
import { observer } from "mobx-react-lite";

// Stores
import { Article } from "../../../common/types/news";
import { settingsStore } from "../../../stores/SettingsStore";

const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const ArticleContent = observer(
    ({
        article,
        onReadFullArticle,
    }: {
        article: Article;
        onReadFullArticle: () => void;
    }) => {
        const { darkMode } = settingsStore;

        return (
            <View className="mb-6">
                {article.urlToImage && (
                    <Image
                        source={{ uri: article.urlToImage }}
                        className="w-full h-56 rounded-lg mb-4"
                        resizeMode="cover"
                    />
                )}

                <Text
                    className={`text-xs mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                    {article.source?.name || "Unknown Source"} • {formatDate(article.publishedAt)}
                </Text>

                <Text
                    className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-black"}`}
                >
                    {article.title}
                </Text>

                <Text
                    className={`text-base leading-6 mb-6 ${darkMode ? "text-gray-300" : "text-gray-800"}`}
                >
                    {article.description}
                </Text>

                {article.content && (
                    <Text
                        className={`text-base leading-6 mb-6 ${darkMode ? "text-gray-300" : "text-gray-800"}`}
                    >
                        {article.content}
                    </Text>
                )}

                <TouchableOpacity
                    className="bg-blue-500 px-4 py-3 rounded-lg flex-row justify-center items-center"
                    onPress={onReadFullArticle}
                >
                    <Text className="text-white font-semibold text-center">
                        Read Full Article
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
);

export default ArticleContent;
