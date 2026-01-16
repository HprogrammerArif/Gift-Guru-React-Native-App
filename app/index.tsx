import { Redirect } from "expo-router";

export default function Index() {
  const isSignedIn = false;

  if (isSignedIn) return <Redirect href="/(tabs)" />;

  return <Redirect href="/(auth)/sign-in" />;
}
