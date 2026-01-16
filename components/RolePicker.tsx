// components/RolePicker.tsx
import { Picker } from "@react-native-picker/picker";
import cn from "clsx";
import React from "react";
import { Text, View } from "react-native";
interface RolePickerProps {
  value: "Male" | "Female" | "";
  onValueChange: (value: "Male" | "Female" | "") => void;
  containerClassName?: string;
}

const RolePicker = ({
  value,
  onValueChange,
  containerClassName,
}: RolePickerProps) => {
  return (
    <View className={cn("", containerClassName)}>
      {/* Label */}
      <Text className="text-dark-secondary ml-2 text-sm font-medium mb-1">
        Gender
      </Text>

      {/* Picker with Tailwind border */}
      <View
        className="border border-gray-300 rounded-xl bg-white overflow-hidden justify-center"
        style={{ height: 48 }}
      >
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          style={{
            height: 48,
            width: "100%",
            color: value === "" ? "#9CA3AF" : "#000000",
            backgroundColor: "transparent",
          }}
          dropdownIconColor="#2B7FFF"
          mode="dropdown"
        >
          <Picker.Item
            label="Select Role"
            value=""
           
            style={{ fontSize: 14 }}
          />
          <Picker.Item
            label="Male"
            value="Male"
           
            style={{ fontSize: 14 }}
          />
          <Picker.Item
            label="Female"
            value="Female"
           
            style={{ fontSize: 14 }}
          />
        </Picker>
      </View>
    </View>
  );
};

export default RolePicker;
