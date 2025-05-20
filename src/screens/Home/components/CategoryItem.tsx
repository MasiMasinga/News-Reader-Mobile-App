import { TouchableOpacity, Text } from "react-native";

// MobX
import { observer } from "mobx-react-lite";

// Stores
import { settingsStore } from "../../../stores/SettingsStore";

const CategoryItem = observer(
    ({
        item,
        isSelected,
        onPress,
    }: {
        item: string;
        isSelected: boolean;
        onPress: (category: string) => void;
    }) => {
        const { darkMode } = settingsStore;

        return (
            <TouchableOpacity
                onPress={() => onPress(item)}
                className={`px-4 py-2 mr-2 rounded-full ${
                    isSelected
                        ? darkMode
                            ? "bg-blue-700"
                            : "bg-blue-500"
                        : darkMode
                          ? "bg-gray-700"
                          : "bg-gray-200"
                }`}
            >
                <Text
                    className={`${
                        isSelected || darkMode ? "text-white" : "text-gray-800"
                    } capitalize`}
                >
                    {item}
                </Text>
            </TouchableOpacity>
        );
    }
);

export default CategoryItem;
