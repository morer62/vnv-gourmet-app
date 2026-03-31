import { API_URL } from '@env';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingOverlay from '../../components/LoadingOverlay';
import { useUserContext } from '../../context/userContext';
import AlertMain from '../../utils/AlertMain';
import sleep from '../../utils/sleep';

const BASE = API_URL?.endsWith('/') ? API_URL : `${API_URL}/`;

export default function SignUpThridParty() {


    const [isAccountCreating, setIsaccountCreating] = useState(false)
    const route = useRoute();
    const { value, type } = route.params;
    const { setUserData } = useUserContext()
    const navigation = useNavigation()

    const handleIosCreation = useCallback(async (accountType) => {

        let payload = {
            identityToken: value.identityToken,
            accountType
        }

        return await axios.post(`${BASE}api/auth/apple-signing/client-app`, payload, {
            headers: {
                "Content-Type": "application/json"
            }
        })

    }, [value])

    const handleGoogleCreation = useCallback(async (accountType) => {
        let payload = {
            idToken: value,
            accountType
        }

        return await axios.post(`${BASE}api/auth/google/signup-app`, payload, {
            headers: {
                "Content-Type": "application/json"
            }
        })
    }, [value])

    const handleAccountCreation = useCallback(async (accountType) => {

        let timeStart = Date.now()
        let response = null

        try {

            setIsaccountCreating(true)
            switch (type) {
                case "IOS":
                    response = await handleIosCreation(accountType)    
                    break;
            
                case "GOOGLE":
                    response = await handleGoogleCreation(accountType)
                    break;
                default:
                    throw new Error("Provider not found")
            }

            
        } catch (e) {
            console.log(e.response?.data)
            setIsaccountCreating(false)
            AlertMain("There was an error while signing up, please try later!")
            return
        } finally {
            let elapsed = Date.now() - timeStart
            let remaining = 2000 - elapsed

            if (remaining > 0) {
                await sleep(3)
            }

            console.log(response.data)

            await handleUserAuth(response)
            setIsaccountCreating(false)
        }
        
    }, [type, setIsaccountCreating, handleUserAuth, handleGoogleCreation, handleIosCreation])

    const handleUserAuth = useCallback(async (response) => {
        try {

            let  { token, user} = response.data.data

            console.log(token, user)

            await AsyncStorage.setItem('Token', token);
            await AsyncStorage.setItem('UserData', JSON.stringify(user));
            setUserData(user);

            navigation.navigate('panelNavigator', { screen: 'Panel' })    
        } catch (error) {
            console.log(error)
        }
        
    }, [setUserData, navigation])

    if (!value || !type) {
        return <></>
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Create your account</Text>
                <Text style={styles.subtitle}>
                How would you like to use E‑Planner Hub?
                </Text>

                <View style={styles.typeGrid}>
                    <TypeCard
                        title="I'm a Venue Owner"
                        desc="Create and manage event spaces"
                        emoji="🏢"
                        onPress={() => handleAccountCreation("venue")}
                    />
                    <TypeCard
                        title="I'm a Vendor"
                        desc="Offer event‑related services"
                        emoji="💼"
                        onPress={() => handleAccountCreation("vendor")}
                    />
                    <TypeCard
                        title="I'm a Client"
                        desc="Plan and book your events"
                        emoji="🎉"
                        onPress={() => handleAccountCreation("client")}
                    />
                </View>

                <Text style={styles.linkCentered} onPress={() => navigation.navigate('SignIn')}>
                Already have an account? <Text style={styles.link}>Back to Sign in</Text>
                </Text>
            </View>


            <LoadingOverlay visible={isAccountCreating} />
        </SafeAreaView>
    )
}

const TypeCard = ({ title, desc, emoji, selected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.9}
    style={[
      styles.typeCard,
      selected && { borderColor: ACCENT, backgroundColor: '#f6fffb' },
    ]}
  >
    <Text style={styles.typeEmoji}>{emoji}</Text>
    <Text style={styles.typeTitle}>{title}</Text>
    <Text style={styles.typeDesc}>{desc}</Text>
  </TouchableOpacity>
);


const SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.08,
  shadowRadius: 18,
  elevation: 8,
};


const ACCENT = '#0fb58d';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  card: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    ...SHADOW,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 14,
  },
  meta: {
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 16,
  },
  typeGrid: {
    gap: 12,
    marginBottom: 12,
  },
  typeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    ...SHADOW,
    elevation: 2,
  },
  typeEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  typeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  typeDesc: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
  linkCentered: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    color: '#374151',
  },
  link: {
    color: ACCENT,
    fontWeight: '700',
  },
});
