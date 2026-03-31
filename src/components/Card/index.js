import { View } from "react-native";

export default function Card({ children }) {

    return (
        <View style={{
            backgroundColor: "#ffffff",
            elevation: 1,
            borderRadius: 2,
            width: "100%",
            minHeight: 20
        }}>
            {children}
        </View>
    )
}