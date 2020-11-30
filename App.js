import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const camera = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return null;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  async function savePicture() {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      const { uri } = await camera.current.takePictureAsync();

      if (status === MediaLibrary.PermissionStatus.GRANTED) {
        await MediaLibrary.createAssetAsync(uri);
      }
    } catch (err) {
      console.log("err", err);
    }
  }

  return (
    <Camera
      ref={camera}
      style={styles.container}
      type={Camera.Constants.Type.back}
    >
      <Button
        style={styles.button}
        title={"Save photo"}
        onPress={savePicture}
      />
    </Camera>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    position: "absolute",
    bottom: 100,
  },
});
