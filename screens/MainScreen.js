import { View, StyleSheet, Platform, Text } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import * as Permissions from "expo-permissions";
import { Camera } from "expo-camera";
import { cameraWithTensors, fetch } from "@tensorflow/tfjs-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

const TensorCamera = cameraWithTensors(Camera);
const AUTORENDER = true;
let frameCount = 0;
const makePredictionEveryNFrames = 1;
let requestAnimationFrameID = 0;

// Position of camera preview.
const previewLeft = 0;
const previewTop = 0;
const previewWidth = 415;
const previewHeight = 768;

export default class CameraScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isTfReady: false,
      cameraType: Camera.Constants.Type.front,
      lastShape: "none",
      hands: [],
      mobilenetClasses: [],
      gesture: "nothing detected",
      showCamera: true,
      playing: false,
      token: "",
      isFree: true,
      isFree1: true,
    };
    //this.frameCount = 0;
    //this.makePredictionEveryNFrames = 3;
    this.handleImageTensorReady = this.handleImageTensorReady.bind(this);
  }

  async loadHandposeModel() {
    return await handpose.load();
  }
  async componentDidMount() {
    try {
      let token = await AsyncStorage.getItem("token");
      console.log(token);
      token = token.substring(1, token.length);
      this.setState({ token: token });

      const headers = {
        Authorization: "Bearer " + token,
      };
      await tf.ready();
      const { status } = Camera.getCameraPermissionsAsync();
      let textureDims = { height: 1200, width: 1600 };
      if (Platform.OS === "ios") {
        textureDims = { height: 1920, width: 1080 };
      }
      // const tensorDims = {height: 300, width: 400 };
      const tensorDims = { height: 500, width: 292 };

      const scale = {
        height: 1,
        width: 1,
      };

      const handposeModel = await this.loadHandposeModel();
      this.setState({
        isTfReady: true,
        permissionsStatus: status,
        handDetector: handposeModel,
        textureDims,
        tensorDims,
        scale,
      });
    } catch (e) {
      console.log(e);
    }
  }

  renderInitialization() {
    return (
      <View style={styles.container}>
        <Text>Initializaing TensorFlow.js!</Text>
        <Text>tf.version {tf.version_core}</Text>
        <Text>tf.backend {tf.getBackend()}</Text>
      </View>
    );
  }

  renderHandsDebugInfo() {
    try {
      const { hands, scale, textureDims } = this.state;
      return hands.map((hand, i) => {
        // const {topLeft, bottomRight, probability} = hand;
        // Render landmarks
        if (
          hand.landmarks[5][1] > hand.landmarks[8][1] &&
          hand.landmarks[9][1] > hand.landmarks[12][1] &&
          hand.landmarks[13][1] > hand.landmarks[16][1] &&
          hand.landmarks[17][1] > hand.landmarks[20][1]
        ) {
          if (this.state.isFree1) {
            this.setState({ isFree1: false });
            console.log("Play/pause");
            if (this.state.playing == false) {
              this.setState({ playing: true });
              fetch("https://api.spotify.com/v1/me/player/play", {
                method: "PUT",
                headers: {
                  Authorization: "Bearer " + this.state.token,
                },
              })
                .then((response) => response.json())
                .then((data) => console.log(data))
                .catch((error) => console.log(error.message));

              if (this.state.gesture != "Play") {
                this.setState({ gesture: "Play" });
              }
            } else {
              this.setState({ playing: false });
              fetch("https://api.spotify.com/v1/me/player/pause", {
                method: "PUT",
                headers: {
                  Authorization: "Bearer " + this.state.token,
                },
              })
                .then((response) => response.json())
                .then((data) => console.log(data))
                .catch((error) => console.log(error.message));

              if (this.state.gesture != "Pause") {
                this.setState({ gesture: "Pause" });
              }
            }
            setTimeout(() => {
              this.setState({ isFree1: true });
            }, 2000);
          }
        }
//        else if () {
//          console.log("Skip song");
//
//        }
         else {
          if (this.state.gesture != "Nothing detected") {
            this.setState({ gesture: "Nothing detected" });
          }
        }
        const rate = 1;
      });
    } catch (e) {
      console.log(e);
    }
  }

  renderMain() {
    const { textureDims, hands, tensorDims } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <MaterialCommunityIcons
            name="arrow-left-circle"
            size={45}
            color="#39B3BB"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              this.props.navigation.navigate("SigninScreen");
            }}
          />
          <AntDesign
            name="questioncircle"
            size={40}
            color="#39B3BB"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              this.props.navigation.navigate("HowitworksScreen2");
            }}
          />
        </View>

        <View style={styles.cameraContainer}>
          {this.state.showCamera === true ? (
            <TensorCamera
              style={styles.camera}
              type={this.state.cameraType}
              zoom={0}
              cameraTextureHeight={textureDims.height}
              cameraTextureWidth={textureDims.width}
              resizeHeight={tensorDims.height}
              resizeWidth={tensorDims.width}
              resizeDepth={3}
              onReady={this.handleImageTensorReady}
              autorender={AUTORENDER}
            />
          ) : (
            <>
              <TensorCamera
                style={[styles.camera, { height: 0 }]}
                type={this.state.cameraType}
                zoom={0}
                cameraTextureHeight={textureDims.height}
                cameraTextureWidth={textureDims.width}
                resizeHeight={tensorDims.height}
                resizeWidth={tensorDims.width}
                resizeDepth={3}
                onReady={this.handleImageTensorReady}
                autorender={AUTORENDER}
              />
              <View
                style={{ flex: 1, backgroundColor: "#EAEAEA", borderRadius: 0 }}
              />
            </>
          )}
          <MaterialCommunityIcons
            name={this.state.showCamera ? "camera" : "camera-off"}
            size={45}
            style={{
              position: "absolute",
              zIndex: 100,
              bottom: 5,
              paddingLeft: "15%",
            }}
            color="white"
            onPress={() => {
              let cameraOn = !this.state.showCamera;
              this.setState({ showCamera: cameraOn });
            }}
          />
        </View>

        <View style={styles.spaceContainer}></View>
        <View style={styles.gestureContainer}>
          <Text style={{ color: "#39B3BB", fontSize: 18 }}>
            Detected Gesture
          </Text>
          <Text style={{ fontSize: 24 }}>{this.state.gesture}</Text>
        </View>
            {!this.state.playing && (
              <MaterialCommunityIcons
                name="play"
                onPress={() => {
                  this.setState({ playing: true });
                  fetch("https://api.spotify.com/v1/me/player/play", {
                    method: "PUT",
                    headers: {
                      Authorization: "Bearer " + this.state.token,
                    },
                  })
                    .then((response) => response.json())
                    .then((data) => console.log(data))
                    .catch((error) => console.log(error.message));
                }}
                size={55}
                color="black"
                style={{ paddingHorizontal: 10 }}
              />
            )}

            {this.state.playing && (
              <MaterialCommunityIcons
                name="pause"
                size={55}
                onPress={() => {
                  this.setState({ playing: false });
                  fetch("https://api.spotify.com/v1/me/player/pause", {
                    method: "PUT",
                    headers: {
                      Authorization: "Bearer " + this.state.token,
                    },
                  })
                    .then((response) => response.json())
                    .then((data) => console.log(data))
                    .catch((error) => console.log(error.message));
                }}
                color="black"
                style={{ paddingHorizontal: 10 }}
              />
            )}
          </View>
        </View>

        {this.renderHandsDebugInfo()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  spaceContainer: {
    flex: 0.01,
  },
  gestureContainer: {
    flex: 0.15,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  controlsContainer: {
    flex: 0.15,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  cameraContainer: {
    // display: 'flex',
    // flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
    // width: '100%',
    // height: '90%',
    // backgroundColor: '#fff',
    flex: 0.5,
    paddingHorizontal: "10%",
  },
  textContainer: {
    alignItems: "center",
    textAlign: "center",
    top: 30,
  },
  topContainer: {
    flex: 0.12,
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingBottom: "2%",
  },
  camera: {
    height: "100%",
    borderRadius: 12,
  },
  bbox: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "green",
    borderRadius: 0,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  infoContainer: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    top: 30,
  },
});
