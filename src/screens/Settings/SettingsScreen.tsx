import { View, Text, ScrollView, Alert } from "react-native";

// MobX
import { observer } from "mobx-react-lite";

// Stores
import { newsStore } from "../../stores/NewsStore";
import { settingsStore } from "../../stores/SettingsStore";

// Components
import Container from "../../common/components/Container";

// Icons
import SettingItem from "./components/SettingItem";

const SettingsScreen = observer(() => {
    const { darkMode, offlineReading } = settingsStore;

    const handleDarkModeToggle = (value: boolean) => {
        settingsStore.setDarkMode(value);
    };

    const handleOfflineReadingToggle = (value: boolean) => {
        settingsStore.setOfflineReading(value);
    };

    const handleClearSavedArticles = async () => {
        Alert.alert(
            "Clear Saved Articles",
            "Are you sure you want to remove all saved articles? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Clear",
                    style: "destructive",
                    onPress: async () => {
                        await newsStore.clearFavorites();
                        Alert.alert(
                            "Success",
                            "All saved articles have been removed."
                        );
                    },
                },
            ]
        );
    };

    const handleAbout = () => {
        Alert.alert(
            "About News Reader",
            "News Reader App v1.0.0\n\nA simple app to stay updated with the latest news from various sources.\n\nDeveloped as a demo application.",
            [{ text: "OK" }]
        );
    };

    return (
        <Container>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="mb-6">
                    <Text
                        className={`text-lg font-bold mb-3 ${darkMode ? "text-white" : "text-black"}`}
                    >
                        Appearance
                    </Text>
                    <SettingItem
                        icon="moon-outline"
                        title="Dark Mode"
                        description="Toggle dark theme for the app"
                        isSwitch
                        value={darkMode}
                        onValueChange={handleDarkModeToggle}
                    />
                </View>

                <View className="mb-6">
                    <Text
                        className={`text-lg font-bold mb-3 ${darkMode ? "text-white" : "text-black"}`}
                    >
                        Content
                    </Text>
                    <SettingItem
                        icon="download-outline"
                        title="Offline Reading"
                        description="Save articles for offline access"
                        isSwitch
                        value={offlineReading}
                        onValueChange={handleOfflineReadingToggle}
                    />
                </View>

                <View className="mb-6">
                    <Text
                        className={`text-lg font-bold mb-3 ${darkMode ? "text-white" : "text-black"}`}
                    >
                        Data Management
                    </Text>
                    <SettingItem
                        icon="trash-outline"
                        title="Clear Saved Articles"
                        description="Remove all articles from favorites"
                        onPress={handleClearSavedArticles}
                    />
                </View>

                <View className="mb-6">
                    <Text
                        className={`text-lg font-bold mb-3 ${darkMode ? "text-white" : "text-black"}`}
                    >
                        About
                    </Text>
                    <SettingItem
                        icon="information-circle-outline"
                        title="About News Reader"
                        description="App information and credits"
                        onPress={handleAbout}
                    />
                </View>
            </ScrollView>
        </Container>
    );
});

export default SettingsScreen;
