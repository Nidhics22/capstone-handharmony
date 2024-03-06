import React from "react";
import { Text, StyleSheet, Platform } from "react-native";

import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_900Black,
} from "@expo-google-fonts/montserrat";

export default function Text({ children, style, ...otherProps }) {
  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_900Black,
  });

  if (fontsLoaded) {
    return (
      <Text style={[styles.text, style]} {...otherProps}>
        {children}
      </Text>
    );
  } else {
    return "Contact system admin";
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    // fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
    fontFamily: "Montserrat_400Regular",
  },
});
