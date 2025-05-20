import { View, ActivityIndicator } from "react-native";

// Components
import Container from "../../../common/components/Container";

const ArticleLoading = (darkMode: boolean) => (
    <Container>
        <View className="flex-1 items-center justify-center">
            <ActivityIndicator
                size="large"
                color={darkMode ? "#60a5fa" : "#3b82f6"}
            />
        </View>
    </Container>
);

export default ArticleLoading;
