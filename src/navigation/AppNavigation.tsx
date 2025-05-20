// Navigation
import {
    NavigationContainer,
    DefaultTheme,
    DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// MobX
import { observer } from "mobx-react-lite";

// Stores
import { settingsStore } from "../stores/SettingsStore";

// Screens
import ArticleDetailScreen from "../screens/ArticleDetails/ArticleDetailScreen";
import CategoryScreen from "../screens/Category/CategoryScreen";

// Components
import BottomTabNavigator from "./BottomTabNavigator";

export type RootStackParamList = {
    MainTab: undefined;
    ArticleDetail: { articleId: string };
    Category: { category: string };
};

export type BottomTabParamList = {
    Home: undefined;
    Favorites: undefined;
    Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigation = observer(() => {
    const { darkMode } = settingsStore;

    return (
        <NavigationContainer theme={darkMode ? DarkTheme : DefaultTheme}>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: darkMode ? "#111827" : "#f5f5f5",
                    },
                    headerTintColor: darkMode ? "#fff" : "#000",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                }}
            >
                <Stack.Screen
                    name="MainTab"
                    component={BottomTabNavigator}
                    options={{ headerShown: false, title: "Home" }}
                />
                <Stack.Screen
                    name="ArticleDetail"
                    component={ArticleDetailScreen}
                    options={{ 
                        title: "Article",
                        headerBackTitle: "Back"
                    }}
                />
                <Stack.Screen
                    name="Category"
                    component={CategoryScreen}
                    options={({ route }) => ({
                        title:
                            route.params.category.charAt(0).toUpperCase() +
                            route.params.category.slice(1),
                    })}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
});

export default AppNavigation;
