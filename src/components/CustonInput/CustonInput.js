import { StyleSheet, TextInput, View } from 'react-native'

export const CustomInput = ({ value, setValue, placeholder, secureTextEntry }) => {
    // render
    return (
        <View style={styles.container}>
            <TextInput
                value={value}
                onChangeText={setValue}
                placeholder={placeholder}
                style={styles.input}
                secureTextEntry={secureTextEntry}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginVertical: 5,
        padding: 10,
        height: 40
    },
    input: { 

    }
})
