import { View, Text, Switch, TouchableOpacity } from "react-native";

// Stores
import { settingsStore } from "../../../stores/SettingsStore";

// Icons
import { Ionicons } from "@expo/vector-icons";

interface SettingItemProps {
    icon: string;
    title: string;
    description?: string;
    isSwitch?: boolean;
    value?: boolean;
    onValueChange?: (newValue: boolean) => void;
    onPress?: () => void;
}

const SettingItem = ({
    icon,
    title,
    description,
    isSwitch = false,
    value = false,
    onValueChange,
    onPress,
}: SettingItemProps) => {
    const { darkMode } = settingsStore;

    return (
        <TouchableOpacity
            className={`flex-row items-center p-4 rounded-lg shadow-sm mb-3 ${darkMode ? "bg-gray-800" : "bg-white"}`}
            onPress={isSwitch ? undefined : onPress}
            disabled={isSwitch}
        >
            <View
                className={`${darkMode ? "bg-blue-900" : "bg-blue-100"} p-2 rounded-full mr-3`}
            >
                <Ionicons
                    name={icon as any}
                    size={24}
                    color={darkMode ? "#60a5fa" : "#3b82f6"}
                />
            </View>
            <View className="flex-1">
                <Text
                    className={`font-semibold text-base ${darkMode ? "text-white" : "text-black"}`}
                >
                    {title}
                </Text>
                {description && (
                    <Text
                        className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                        {description}
                    </Text>
                )}
            </View>
            {isSwitch && (
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    trackColor={{
                        false: darkMode ? "#374151" : "#d1d5db",
                        true: darkMode ? "#1e3a8a" : "#bfdbfe",
                    }}
                    thumbColor={
                        value ? "#3b82f6" : darkMode ? "#6b7280" : "#f3f4f6"
                    }
                />
            )}
            {!isSwitch && (
                <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={darkMode ? "#9ca3af" : "#9ca3af"}
                />
            )}
        </TouchableOpacity>
    );
};

export default SettingItem;
