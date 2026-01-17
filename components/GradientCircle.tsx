// components/GradientCircle.tsx
import React from "react";
import Svg, { Defs, RadialGradient, Stop, Circle } from "react-native-svg";

interface GradientCircleProps {
  children?: React.ReactNode;
}

const GradientCircle = ({ children }: GradientCircleProps) => (
  <Svg width="48" height="48" viewBox="0 0 48 48" className="absolute">
    <Defs>
      <RadialGradient id="grad" cx="50%" cy="50%" r="50%">
        <Stop offset="70%" stopColor="#2B7FFF" />
        <Stop offset="100%" stopColor="#7CB0FF" />
      </RadialGradient>
    </Defs>
    <Circle cx="24" cy="24" r="22" fill="url(#grad)" />
    {children}
  </Svg>
);

export default GradientCircle;