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
import SearchResults from "./components/SearchResults";
import Favorites from "./components/Favorites";
import PurchaseScreen from "./components/PurchaseScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
      <NavigationContainer>

        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Login" component={Login}options={{ title: "Logowanie" }} />
          <Stack.Screen name="Register" component={Registration}options={{ title: "Rejestracja" }} />
          <Stack.Screen name="PersonDetails" component={PersonDetails} options={{ title: "Szczegóły profilu" }}/>
          <Stack.Screen name="AddItem" component={AddItem} options={{ title: "Dodaj ogłoszenie" }}/>
          <Stack.Screen name="Navbar" component={Navbar} options={{ headerShown: false }} />
          <Stack.Screen
              name="Item"
              component={Item}
              options={{ title: "Szczegóły Przedmiotu" }}
          />
          <Stack.Screen name="User" component={User} options={{ title: "Użytkownik" }}/>
          <Stack.Screen name="MyAccount" component={MyAccount} options={{ title: "Mój Profil" }}/>
          <Stack.Screen name="Favorites" component={Favorites} options={{title: "Ulubione ogłoszenia" }}/>
          <Stack.Screen name="Purchase" component={PurchaseScreen} options={{title: "Zakup" }}/>

          <Stack.Screen name="Messages" component={Messages}options={{ title: "Wiadomości" }} />
          <Stack.Screen name="Home" component={Home}options={{ title: "Strona główna" }} />
          <Stack.Screen name="SearchResults" component={SearchResults} options={{ title: "Wyniki wyszukiwania" }}/>
          <Stack.Screen
              name="CategoryPage"
              component={CategoryPage}

              options={({ route }) => ({ title: route.params?.categoryName || 'Category' })}
          />
        </Stack.Navigator>
      </NavigationContainer>
  );
}
