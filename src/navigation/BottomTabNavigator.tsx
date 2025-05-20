import { Text, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Navigation
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Icons
import { Ionicons } from "@expo/vector-icons";

// MobX
import { observer } from "mobx-react-lite";

// Stores
import { settingsStore } from "../stores/SettingsStore";
import { newsStore } from "../stores/NewsStore";

// Screens
import HomeScreen from "../screens/Home/HomeScreen";
import FavoritesScreen from "../screens/Favourites/FavoritesScreen";
import SettingsScreen from "../screens/Settings/SettingsScreen";

export type BottomTabParamList = {
    Home: undefined;
    Favorites: undefined;
    Settings: undefined;
};

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = observer(() => {
    const { darkMode } = settingsStore;
    const insets = useSafeAreaInsets();
    
    const bottomPadding = Platform.OS === 'ios' ? insets.bottom : 0;

    return (
        <BottomTab.Navigator
            initialRouteName="Home"
            screenOptions={{
                tabBarActiveTintColor: darkMode ? "#60a5fa" : "#3b82f6",
                tabBarInactiveTintColor: darkMode ? "#9ca3af" : "#64748b",
                tabBarStyle: {
                    height: 50 + bottomPadding,
                    paddingBottom: bottomPadding,
                    paddingTop: 5,
                    backgroundColor: darkMode ? "#1f2937" : "#f5f5f5",
                    borderTopColor: darkMode ? "#374151" : "#e5e7eb",
                    borderTopWidth: 1,
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 999,
                },
                headerStyle: {
                    backgroundColor: darkMode ? "#111827" : "#f5f5f5",
                },
                headerTintColor: darkMode ? "#fff" : "#000",
                headerTitleStyle: {
                    fontWeight: "bold",
                },
                tabBarHideOnKeyboard: true,
            }}
        >
            <BottomTab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: "Latest News",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="newspaper-outline"
                            size={size}
                            color={color}
                        />
                    ),
                    headerRight: () => (
                        <Text
                            style={{
                                marginRight: 15,
                                color: darkMode ? "#fff" : "#000",
                            }}
                        >
                            {newsStore.selectedCategory !== "all"
                                ? newsStore.selectedCategory
                                      .charAt(0)
                                      .toUpperCase() +
                                  newsStore.selectedCategory.slice(1)
                                : ""}
                        </Text>
                    ),
                }}
            />
            <BottomTab.Screen
                name="Favorites"
                component={FavoritesScreen}
                options={{
                    title: "Saved Articles",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="heart-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <BottomTab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    title: "Settings",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="settings-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
        </BottomTab.Navigator>
    );
});

export default BottomTabNavigator;
