import { View, Text, TouchableOpacity } from "react-native";

// Navigation
import {
    useNavigation,
    CompositeNavigationProp,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
    BottomTabParamList,
    RootStackParamList,
} from "../../../navigation/AppNavigation";

// MobX
import { observer } from "mobx-react-lite";

// Stores
import { settingsStore } from "../../../stores/SettingsStore";

// Icons
import { Ionicons } from "@expo/vector-icons";

type FavoritesScreenNavigationProp = CompositeNavigationProp<
    NativeStackNavigationProp<BottomTabParamList, "Favorites">,
    NativeStackNavigationProp<RootStackParamList>
>;

const EmptyFavorites = observer(() => {
    const { darkMode } = settingsStore;
    
    const navigation = useNavigation<FavoritesScreenNavigationProp>();

    return (
        <View className="flex-1 items-center justify-center">
            <Ionicons
                name="heart-outline"
                size={64}
                color={darkMode ? "#4b5563" : "#cccccc"}
            />
            <Text
                className={`text-lg mt-4 ${darkMode ? "text-gray-300" : "text-gray-500"}`}
            >
                No saved articles
            </Text>
            <Text
                className={`text-center mt-2 mx-8 ${darkMode ? "text-gray-400" : "text-gray-400"}`}
            >
                Articles you save will appear here for easy access
            </Text>
            <TouchableOpacity
                className="mt-6 bg-blue-500 px-6 py-3 rounded-full"
                onPress={() => navigation.navigate("Home")}
            >
                <Text className="text-white font-semibold">
                    Browse Articles
                </Text>
            </TouchableOpacity>
        </View>
    );
});

export default EmptyFavorites;
