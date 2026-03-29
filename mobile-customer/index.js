import { registerRootComponent } from "expo";
import "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import RootNavigator from "./src/navigation/RootNavigator";
import { useCartStore } from "./src/stores/cartStore";

export default function App() {
  const appStateRef = useRef(AppState.currentState);
  const { initializeCart } = useCartStore();

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );
    return () => {
      subscription.remove();
    };
  }, []); // Empty dependency array - listener is set up once

  const handleAppStateChange = (nextAppState) => {
    if (
      appStateRef.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      // App has come to foreground - sync cart with server
      console.log("App came to foreground - syncing cart");
      initializeCart();
    }
    appStateRef.current = nextAppState;
  };

  return (
    <>
      <RootNavigator />
      <StatusBar style="light" />
    </>
  );
}

registerRootComponent(App);
