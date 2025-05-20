import { View, Text, TouchableOpacity, Image } from "react-native";

// MobX
import { observer } from "mobx-react-lite";

// Stores
import { settingsStore } from "../../../stores/SettingsStore";

// Types
import { Article } from "../../../common/types/news";

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
};

const ArticleItem = observer(
    ({ item, onPress }: { item: Article; onPress: (id: string) => void }) => {
        const { darkMode } = settingsStore;

        return (
            <TouchableOpacity
                className={`p-4 mb-4 rounded-lg shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}
                onPress={() => onPress(item.id)}
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
    }
);

export default ArticleItem;
