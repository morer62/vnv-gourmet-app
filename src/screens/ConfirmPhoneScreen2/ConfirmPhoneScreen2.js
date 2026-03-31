import { API_URL } from '@env'
import axios from 'axios'
import { useState } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

import { useNavigation } from '@react-navigation/native'
import { CustonButton } from '../../components/CustonButton/CustonButton'
import AlertMain from '../../utils/AlertMain'

export const ConfirmPhoneScreen2 = () => {
    const [isDisabled, setIsDisabled] = useState()
    const [TypeButton, setTypeButton] = useState('Primary')
    const navigation = useNavigation()

    const [validationCode, setValidationCode] = useState('')

    const onCodePressed = async () => {
        setIsDisabled(true)
        setTypeButton('Disabled')

        const token = await AsyncStorage.getItem('Token')

        const userData = {
            token,
            validationCode
        }

        axios
            .post(`${API_URL}/api/firsrActivation`, userData)
            .then(response => {
                if (response.data == 1) {
                    setIsDisabled(false)
                    setTypeButton('Primary')

                    const navigator = 'panelNavigator'

                    navigation.reset({
                        index: 1,
                        routes: [
                            {
                                name: navigator,
                                state: {
                                    routes: [{ name: 'Panel' }]
                                }
                            },
                            {
                                name: navigator,
                                state: {
                                    routes: [{ name: 'PanelView', params: { url: '' } }]
                                }
                            }
                        ]
                    })
                } else {
                    AlertMain('Wrong Code - Try Again')
                    setIsDisabled(false)
                    setTypeButton('Primary')
                }
            })
            .catch(() => {})
    }

    // render
    return (
        <ScrollView>
            <View style={styles.root}>
                <Text style={styles.title}>Check Your Phone and Enter Your Code</Text>

                <CustomInput placeholder="Validation Code" value={validationCode} setValue={setValidationCode} />

                <CustonButton text="Continue" onPress={onCodePressed} isDisabled={isDisabled} type={TypeButton} />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    root: {
        alignContent: 'center',
        padding: 20,
        marginTop: 80,
        backgroundColor: '#F5F5F5'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#051C60',
        margin: 10
    },
    link: {
        color: '#FDB075'
    },
    text: {
        color: 'gray',
        marginVertical: 10
    }
})
