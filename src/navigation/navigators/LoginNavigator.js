import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SafeAreaViewHOC from "../../components/SafeAreaViewHOC";
import { ConfirmPhoneScreen1 } from "../../screens/ConfirmPhoneScreen1/ConfirmPhoneScreen1";
import { ConfirmPhoneScreen2 } from "../../screens/ConfirmPhoneScreen2/ConfirmPhoneScreen2";
import { ForgotPasswordScreen } from "../../screens/ForgotPasswordScreen/ForgotPasswordScreen";
import { Panel } from "../../screens/Panel/Panel";
import { SignInScreen } from "../../screens/SignInScreen/SignInScreen";
import { SignUpScreen } from "../../screens/SignUpScreen/SignUpScreen";
import SignUpThridParty from "../../screens/SignUpThridParty";

const Stack  = createNativeStackNavigator()

export default function LoginNavigator(){

    return (
        <Stack.Navigator initialRouteName="SignIn" screenOptions={{headerShown: false }}>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="ConfirmPhone1" component={ConfirmPhoneScreen1} />
            <Stack.Screen name="ConfirmPhone2" component={ConfirmPhoneScreen2} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} /> 
            <Stack.Screen name="Panel" component={SafeAreaViewHOC(Panel)} />
            <Stack.Screen name="SignUpThirdParty" component={SignUpThridParty} />
        </Stack.Navigator>
    )
}