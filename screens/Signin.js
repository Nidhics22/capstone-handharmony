import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";

import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthSession } from "expo";
import SignInButton from "../components/SignInButton";

console.disableYellowBox = true;

const client_id = "5039b33f682d48358eaae288e62041a2";
const client_secret = "c12c6a4c8497496b87135e448e76e07a";

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

export default function Signin({ navigation }) {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: client_id,
      response_type: "code",
      scopes: [
        "user-read-email",
        "playlist-modify-public",
        "app-remote-control",
        "user-modify-playback-state",
        "user-read-playback-state",
        "streaming",
      ],

      usePKCE: false,
      show_dialog: true,
      // For usage in managed apps using the proxy
      redirectUri: makeRedirectUri({
        // For usage in bare and standalone
        native: "http://localhost:4200/login",
      }),
    },
    discovery
  );

  const handleAccessToken = (code) => {
    var details = {
      client_id: client_id,
      client_secret: client_secret,
      code: code,
      grant_type: "authorization_code",
      redirect_uri: makeRedirectUri(),
    };

    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: formBody,
    })
      .then((response) => response.json())
      .then((data) => {
      // Temporary storing token
      // Need to change it to Redis Server
        if (data.access_token) {
          AsyncStorage.setItem("token", JSON.stringify(data.access_token));
          console.log(data.access_token);
          navigation.navigate("MainScreen");
        }
      });
  };

  React.useEffect(() => {
    console.log(makeRedirectUri());
    if (response?.type === "success") {
      const { code } = response.params;

      handleAccessToken(code);

      // AsyncStorage.setItem("token", JSON.stringify(code));
      // navigation.navigate("PhoneScreen");
    }
  }, [response]);

  const handleSpotify = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    promptAsync();
  };

  const handleHowitworks = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("HowitworksScreen");
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonsFlex}>
        <SignInButton title="Sign In with Spotify" onSignIn={handleSpotify} />

        {/* <SigninButton
          handlePress={handleHowitworks}
          icon="questioncircle"
          iconType="AntDesign"
        >
          How it works
        </SigninButton> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(249, 242, 246, 0.8)",
    justifyContent: "center",
  },

  buttonsFlex: {
    //justifyContent: "center",
    alignItems: "center",
  },
  bottomFlex: {
    flex: 0.13,
  },
});
