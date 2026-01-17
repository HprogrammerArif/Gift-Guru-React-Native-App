import { Pressable } from 'react-native';

export default function NoRippleTabButton(props: any) {
  return (
    <Pressable
      android_ripple={{ color: 'transparent' }} // removes ripple
      style={props.style}
      onPress={props.onPress}
      onLongPress={props.onLongPress}
      accessibilityRole={props.accessibilityRole}
      accessibilityState={props.accessibilityState}
      accessibilityLabel={props.accessibilityLabel}
      testID={props.testID}>
      {props.children}
    </Pressable>
  );
}
