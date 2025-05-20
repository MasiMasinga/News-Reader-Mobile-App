import { View, Text, TouchableOpacity } from "react-native";

// Components
import Container from "../../../common/components/Container";

const ArticleError = (
    error: unknown,
    darkMode: boolean,
    navigation: any,
    refetch: () => void
) => (
    <Container>
        <View className="flex-1 items-center justify-center">
            <Text
                className={`text-lg ${darkMode ? "text-red-400" : "text-red-600"} text-center px-4`}
            >
                {error
                    ? typeof error === "string"
                        ? error
                        : (error as Error).message
                    : "We couldn't find this article"}
            </Text>
            <TouchableOpacity
                className="mt-4 bg-blue-500 px-4 py-2 rounded-lg"
                onPress={() => navigation.goBack()}
            >
                <Text className="text-white">Go Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
                className="mt-2 px-4 py-2"
                onPress={() => refetch()}
            >
                <Text className="text-blue-500">Try Again</Text>
            </TouchableOpacity>
        </View>
    </Container>
);

export default ArticleError;
