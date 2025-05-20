import { View, Text, ScrollView, TouchableOpacity } from "react-native";

// Components
import Container from "../../../common/components/Container";

// Types
import { Article } from "../../../common/types/news";

const ArticleFallback = (
    article: Article,
    darkMode: boolean,
    openInBrowser: () => void,
    refetch: () => void,
    navigation: any
) => (
    <Container>
        <ScrollView showsVerticalScrollIndicator={false} className="p-4">
            <View className="items-center mb-6">
                <Text
                    className={`text-lg font-bold mb-4 text-center ${darkMode ? "text-white" : "text-black"}`}
                >
                    {article.title}
                </Text>
                <Text
                    className={`text-center mb-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                    {article.description}
                </Text>
                {article.url && (
                    <TouchableOpacity
                        className="mt-2 bg-blue-500 px-4 py-2 rounded-lg"
                        onPress={openInBrowser}
                    >
                        <Text className="text-white">
                            Visit Original Source
                        </Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity className="mt-4 px-4 py-2" onPress={refetch}>
                    <Text className="text-blue-500">Try Fetching Again</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="mt-2 px-4 py-2"
                    onPress={() => navigation.goBack()}
                >
                    <Text className="text-blue-500">Go Back</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    </Container>
);

export default ArticleFallback;
