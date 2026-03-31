import { View, StyleSheet, Dimensions } from "react-native"
import BottomAction from "./BottomActions"

export default function BottomHoc(Component) {

    return function () {

        return (
            <>
                <View style={styles.main}>
                    <Component />
                </View>
                
                <BottomAction />
            </>
        )
    }
}

const styles = StyleSheet.create({
    main: {
        height: Dimensions.get("window").height - (65 * 2),
        paddingBottom: 10
    }
})