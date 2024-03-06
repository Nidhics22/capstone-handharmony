import React from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";

export default function SignInButton(props) {
  return (
    <View style={styles.container}>
      {/* <Button title={props.title} onPress={() => props.onSignIn()} /> */}
      <TouchableOpacity onPress={props.onSignIn} style={styles.buttonColor}>
        <Text style={styles.textStyle}>{props.title}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  buttonColor: {
    backgroundColor: "rgba(0, 213, 117, 0.93)",
    width: 220,
    height: 45,
    borderRadius: 7,
    borderColor: "rgb(255, 255, 255)",
    opacity: 2,
  },
  textStyle: {
    textAlign: "center",
    marginBottom: "auto",
    marginTop: "auto",
    color: "rgba(255, 255, 255, 1)",
    fontSize: 20,
    fontWeight: "300",
    fontFamily: "bold",
  },
});
