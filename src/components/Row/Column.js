import { View } from "react-native";
import { ReactNode } from "react"
/**
 * 
 * @param {{ children: ReactNode, size: number}} param0 
 * @returns 
 */
export default function Column({ children, size }) {

    // size can be up to 6
    return (
        <View style={{
            width: `${(100 / 6) * size}%`
        }}>
            {children}
        </View>
    )
}