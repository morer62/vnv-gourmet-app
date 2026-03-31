import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

// Navigators
import LoginNavigator from './navigators/LoginNavigator'
import PanelNavigator from './navigators/PanelNavigator'

const Stack = createNativeStackNavigator() 

export default function Navigation({ isLogged }) {

    return (
        <>  
            <NavigationContainer>
                <Stack.Navigator initialRouteName={isLogged ? 'panelNavigator': 'loginNavigator'} screenOptions={{headerShown: false }}>
                    <Stack.Screen name='loginNavigator' component={LoginNavigator} />
                    <Stack.Screen name='panelNavigator' component={PanelNavigator} />
                </Stack.Navigator>
            </NavigationContainer>
        </>
    )
}
