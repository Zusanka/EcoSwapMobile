import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './components/Login';
import Registration from './components/Registration';
import PersonDetails from './components/PersonDetails';
import AddItem from './components/AddItem';
import Navbar from './components/Navbar';  // Zastanów się, czy chcesz mieć nawigację nagłówka, czy może boczny pasek.
import Item from './components/Item';
import User from './components/User';
import MyAccount from './components/MyAccount';
import Messages from './components/Messages';
import Home from './components/Home';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Registration" component={Registration} />
        <Stack.Screen name="PersonDetails" component={PersonDetails} />
        <Stack.Screen name="AddItem" component={AddItem} />
        <Stack.Screen name="Item" component={Item} />
        <Stack.Screen name="User" component={User} />
        <Stack.Screen name="MyAccount" component={MyAccount} />
        <Stack.Screen name="Messages" component={Messages} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
