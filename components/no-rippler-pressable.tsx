import { Pressable } from "react-native";

export default function NoRippleTabButton(props: any) {
  return (
    <Pressable
      android_ripple={{ color: "transparent" }} // removes ripple
      style={({ pressed }) => [
        props.style,
        { opacity: pressed ? 0.7 : 1 }, // Subtle feedback
      ]}
      onPress={props.onPress}
      onLongPress={props.onLongPress}
      accessibilityRole={props.accessibilityRole}
      accessibilityState={props.accessibilityState}
      accessibilityLabel={props.accessibilityLabel}
      testID={props.testID}
    >
      {props.children}
    </Pressable>
  );
}
