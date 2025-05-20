import { SafeAreaView, View, StatusBar, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// MobX
import { observer } from "mobx-react-lite";

// Stores
import { settingsStore } from "../../stores/SettingsStore";

const Container = observer(({ children }: { children: React.ReactNode }) => {
    const isDarkMode = settingsStore.darkMode;
    const insets = useSafeAreaInsets();
    
    const tabBarHeight = 20;
    const bottomInset = Platform.OS === 'ios' ? insets.bottom : 0;
    const totalTabBarHeight = tabBarHeight + bottomInset;
    
    return (
        <View className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
            <StatusBar
                barStyle={isDarkMode ? "light-content" : "dark-content"}
            />
            <SafeAreaView className="flex-1" style={{ paddingBottom: 0 }}>
                <View 
                    style={{ 
                        flex: 1, 
                        marginHorizontal: 24,
                        marginTop: 24,
                        paddingBottom: totalTabBarHeight
                    }}
                >
                    {children}
                </View>
            </SafeAreaView>
        </View>
    );
});

export default Container;
