import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SpotifySignin from "../screens/Signin";
import MainScreen from "../screens/MainScreen";

const Stack = createStackNavigator();

const MainNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="SigninScreen"
      component={SpotifySignin}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="MainScreen"
      component={MainScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default MainNavigator;
