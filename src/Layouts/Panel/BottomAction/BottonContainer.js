import { View } from "react-native"
import BottomAction from "./BottomActions"

export default function BottomContainer({ children }) {


    return (
        <View style={{ flex: 1, paddingTop: 0 }}>
            <View style={{ height: "92%" }}>
                {children}
            </View>

            <View style={{ height: "8%"}}>
                <BottomAction />
            </View>   
            
        </View>
    )
}