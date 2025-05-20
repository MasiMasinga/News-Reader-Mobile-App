import { View, TouchableOpacity, ActivityIndicator } from "react-native";

// MobX
import { observer } from "mobx-react-lite";

// Stores
import { settingsStore } from "../../../stores/SettingsStore";

// Icons
import { Ionicons } from "@expo/vector-icons";

const ArticleHeaderButtons = observer(
    ({
        isFavorite,
        onFavoritePress,
        onSharePress,
        isLoading = false,
    }: {
        isFavorite: boolean;
        onFavoritePress: () => void;
        onSharePress: () => void;
        isLoading?: boolean;
    }) => {
        const { darkMode } = settingsStore;

        return (
            <View className="flex-row">
                <TouchableOpacity 
                    onPress={onFavoritePress} 
                    className="mr-4"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator 
                            size="small" 
                            color={darkMode ? "#fff" : "#000"} 
                        />
                    ) : (
                        <Ionicons
                            name={isFavorite ? "heart" : "heart-outline"}
                            size={24}
                            color={
                                isFavorite ? "#ef4444" : darkMode ? "#fff" : "#000"
                            }
                        />
                    )}
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={onSharePress}
                    disabled={isLoading}
                >
                    <Ionicons
                        name="share-outline"
                        size={24}
                        color={darkMode ? "#fff" : "#000"}
                    />
                </TouchableOpacity>
            </View>
        );
    }
);

export default ArticleHeaderButtons;
