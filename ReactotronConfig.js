import Reactotron from "reactotron-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { NativeModules } from "react-native";

Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure({
    name: "React Native Demo",
    // On Android emulators, the host machine is at 10.0.2.2.
    // For physical devices, you should use your computer's local IP (e.g., 10.10.13.62)
    host:
      NativeModules.SourceCode?.scriptURL?.split("://")[1]?.split(":")[0] ||
      "localhost",
  })
  .useReactNative({
    asyncStorage: false, // there are more options to the async storage.
    networking: {
      // optionally, you can turn it off with false.
      ignoreUrls: /symbolicate/,
    },
    editor: false, // there are more options to editor
    errors: { veto: (stackFrame) => false }, // or turn it off with false
    overlay: false, // just turning off overlay
  })
  .connect();

console.tron = Reactotron;

export default Reactotron;
