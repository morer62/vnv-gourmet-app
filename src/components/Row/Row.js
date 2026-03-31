import { View } from "react-native";

function Row({ children }) {

    return (
        <View style={{
            flex: 1,
            flexDirection: "row"
        }}>
            {children}
        </View>
    )
}


export default Row