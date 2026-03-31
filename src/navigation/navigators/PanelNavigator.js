import { createDrawerNavigator } from '@react-navigation/drawer';

import DrawerAction from '../../Layouts/Panel/DrawerAction';
import { Panel } from '../../screens/Panel/Panel';
import PanelWebView from '../../screens/PanelWebView';

const Drawer = createDrawerNavigator();

export default function PanelNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerAction {...props} />}
      screenOptions={{
        drawerStyle: { display: 'none' }, // Oculta visualmente
        swipeEnabled: false, // Evita abrir con swipe
        headerLeft: () => null, // Quita el ícono de menú

        headerStyle: {
          backgroundColor: '#2f190d',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(255, 209, 138, 0.12)',
        },

        headerTintColor: '#fff7ea',

        headerTitleStyle: {
          color: '#fff7ea',
          fontWeight: '800',
          fontSize: 24,
        },

        headerTitleAlign: 'left',

        sceneContainerStyle: {
          backgroundColor: '#66371c',
        },
      }}
    >
      <Drawer.Screen
        name="Panel"
        component={Panel}
        options={{
          title: 'Dashboard',
        }}
      />

      <Drawer.Screen
        name="PanelView"
        component={PanelWebView}
        options={{
          title: 'Dashboard',
        }}
      />
    </Drawer.Navigator>
  );
}