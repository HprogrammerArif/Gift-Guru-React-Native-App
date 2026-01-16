import { Image, StatusBar, StyleSheet, View } from "react-native";
import splash from "../assets/images/splashScreen.png";

export default function SplashScreenView() {
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Image source={splash} style={styles.image} resizeMode="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
