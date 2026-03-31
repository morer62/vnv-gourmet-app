import { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

import { API_URL } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'

import { CustonButton } from '../../components/CustonButton/CustonButton'
import AlertMain from '../../utils/AlertMain'

export const ConfirmPhoneScreen1 = () => {
    const navigation = useNavigation()
    const ApiUrl = API_URL
    const [isDisabled, setIsDisabled] = useState()
    const [TypeButton, setTypeButton] = useState('Primary')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [token, setToken] = useState('')

    useEffect(() => {
        let isMounted = true

        async function load() {
            const token = await AsyncStorage.getItem('Token')
            const payload = {
                token
            }

            const response = await axios.post(`${ApiUrl}/api/GetUserData`, payload)
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

        const payload = {
            token: token,
            phoneNumber: phoneNumber
        }

        const validation = new RegExp('^[0-9]*$')

        if (!validation.test(phoneNumber)) {
            AlertMain('Phonenumber must only include numbers')
            return
        }

        axios.post(`${ApiUrl}/api/getActivationSMS`, payload).then(res => {
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

                <CustomInput placeholder="Phone Number" value={phoneNumber} setValue={setPhoneNumber} />

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
