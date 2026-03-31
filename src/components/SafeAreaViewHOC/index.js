import { SafeAreaView } from "react-native-safe-area-context"

export default function SafeAreaViewHOC(Component) {

    
    return function ChildComponent(props) {
        return (
            <SafeAreaView>
                <Component {...props} />
            </SafeAreaView>
        )
    }
}