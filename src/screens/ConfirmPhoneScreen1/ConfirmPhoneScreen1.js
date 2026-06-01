import { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'

import { CustonButton } from '../../components/CustonButton/CustonButton'
import CustomInput from '../../components/CustomInput'
import { API_ROUTES, getApiUrl } from '../../config/apiRoutes'
import { withBusinessScope } from '../../config/businessConfig'
import AlertMain from '../../utils/AlertMain'

export const ConfirmPhoneScreen1 = () => {
    const navigation = useNavigation()
    const [isDisabled, setIsDisabled] = useState()
    const [TypeButton, setTypeButton] = useState('Primary')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [token, setToken] = useState('')

    useEffect(() => {
        let isMounted = true

        async function load() {
            const token = await AsyncStorage.getItem('Token')
            const payload = withBusinessScope({
                token
            })

            const response = await axios.post(getApiUrl(API_ROUTES.getUserData), payload)
            let phone = response.data.phone
            phone = phone.replace('(', '').replace('+)', '').replace('+', '').replace(' ', '').replace('-', '')

            if (isMounted) {
                setPhoneNumber(phone)
                setToken(token)
            }
        }

        load()

        return () => {
            isMounted = false
        }
    }, [setPhoneNumber, setToken])

    const onPhonePressed = async () => {
        setIsDisabled(true)
        setTypeButton('Disabled')

        const payload = withBusinessScope({
            token: token,
            phoneNumber: phoneNumber
        })

        const validation = new RegExp('^[0-9]*$')

        if (!validation.test(phoneNumber)) {
            AlertMain('Phonenumber must only include numbers')
            return
        }

        axios.post(getApiUrl(API_ROUTES.activationSms), payload).then(() => {
            setIsDisabled(false)
            setTypeButton('Primary')
            navigation.navigate('ConfirmPhone2')
        })
    }

    // render
    return (
        <ScrollView>
            <View style={styles.root}>
                <Text style={styles.title}>Confirm your Phone Number</Text>

                <CustomInput placeHolder="Phone Number" value={phoneNumber} onChange={setPhoneNumber} />

                <CustonButton text="Send Code" onPress={onPhonePressed} isDisabled={isDisabled} type={TypeButton} />
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
