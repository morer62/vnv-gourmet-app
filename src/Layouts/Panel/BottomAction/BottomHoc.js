import { View, StyleSheet, Dimensions } from "react-native"
import BottomAction from "./BottomActions"

export default function BottomHoc(Component) {

    function BottomWrappedComponent() {

        return (
            <>
                <View style={styles.main}>
                    <Component />
                </View>
                
                <BottomAction />
            </>
        )
    }

    BottomWrappedComponent.displayName = `BottomHoc(${Component.displayName || Component.name || 'Component'})`

    return BottomWrappedComponent
}

const styles = StyleSheet.create({
    main: {
        height: Dimensions.get("window").height - (65 * 2),
        paddingBottom: 10
    }
})
