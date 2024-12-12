import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './components/Login';
import Registration from './components/Registration';
import PersonDetails from './components/PersonDetails';
import AddItem from './components/AddItem';
import Navbar from './components/Navbar';
import Item from './components/Item';
import User from './components/User';
import MyAccount from './components/MyAccount';
import Messages from './components/Messages';
import Home from './components/Home';
import CategoryPage from './components/CategoryPage';

const Stack = createStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Registration} />
          <Stack.Screen name="PersonDetails" component={PersonDetails} />
          <Stack.Screen name="AddItem" component={AddItem} />
          <Stack.Screen name="Navbar" component={Navbar} options={{ headerShown: false }} />
          <Stack.Screen name="Item" component={Item} />
          <Stack.Screen name="User" component={User} />
          <Stack.Screen name="MyAccount" component={MyAccount} />
          <Stack.Screen name="Messages" component={Messages} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen
              name="CategoryPage"
              component={CategoryPage}
              options={({ route }) => ({ title: route.params?.categoryName || 'Category' })}
          />
        </Stack.Navigator>
      </NavigationContainer>
  );
}
