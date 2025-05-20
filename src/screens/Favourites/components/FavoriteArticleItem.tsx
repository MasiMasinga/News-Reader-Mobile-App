import { View, Text, TouchableOpacity, Image } from "react-native";

// MobX
import { observer } from "mobx-react-lite";

// Stores
import { settingsStore } from "../../../stores/SettingsStore";
import { Article } from "../../../common/types/news";

// Icons
import { Ionicons } from "@expo/vector-icons";

const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const FavoriteArticleItem = observer(
    ({
        item,
        onArticlePress,
        onRemovePress,
    }: {
        item: Article;
        onArticlePress: (id: string) => void;
        onRemovePress: (id: string, title: string) => void;
    }) => {
        const { darkMode } = settingsStore;

        return (
            <View
                className={`p-4 mb-4 rounded-lg shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}
            >
                <TouchableOpacity
                    onPress={() => onArticlePress(item.id)}
                    className="mb-2"
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
                        {item.source?.name || "Unknown Source"} • {formatDate(item.publishedAt)}
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
                </TouchableOpacity>

                <View className="flex-row justify-between items-center">
                    <TouchableOpacity onPress={() => onArticlePress(item.id)}>
                        <Text className="text-blue-500">Read more</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => onRemovePress(item.id, item.title)}
                        className="p-2"
                    >
                        <Ionicons
                            name="trash-outline"
                            size={20}
                            color={darkMode ? "#f87171" : "red"}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
);

export default FavoriteArticleItem;
