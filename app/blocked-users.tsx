import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import {
  useGetBlockedUsersQuery,
  useUnblockUserMutation,
} from "@/redux/features/profileService/profileApi";
import { API_IMAGE_URL } from "@/redux/api/baseApi";

// ─── Single blocked user row ──────────────────────────────────────────────────
const BlockedUserRow = ({
  user,
  onUnblock,
  isUnblocking,
}: {
  user: any;
  onUnblock: () => void;
  isUnblocking: boolean;
}) => {
  const imageUri = user.image
    ? user.image.startsWith("http")
      ? user.image
      : `${API_IMAGE_URL}${user.image}`
    : null;

  const fullName =
    user.first_name || user.last_name
      ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
      : user.username ?? "Unknown User";

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
      }}
    >
      {/* Avatar */}
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: "#F3F4F6",
          overflow: "hidden",
          marginRight: 12,
        }}
      >
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="person" size={24} color="#9CA3AF" />
          </View>
        )}
      </View>

      {/* Name */}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: "QuickSand-SemiBold",
            fontSize: 15,
            color: "#111827",
          }}
          numberOfLines={1}
        >
          {fullName}
        </Text>
        {user.username && user.username !== fullName && (
          <Text
            style={{
              fontFamily: "QuickSand-Regular",
              fontSize: 12,
              color: "#9CA3AF",
              marginTop: 1,
            }}
          >
            @{user.username}
          </Text>
        )}
      </View>

      {/* Unblock button */}
      <TouchableOpacity
        onPress={onUnblock}
        disabled={isUnblocking}
        activeOpacity={0.7}
        style={{
          backgroundColor: isUnblocking ? "#F3F4F6" : "#EFF6FF",
          borderWidth: 1,
          borderColor: isUnblocking ? "#E5E7EB" : "#BFDBFE",
          borderRadius: 10,
          paddingHorizontal: 14,
          paddingVertical: 7,
        }}
      >
        {isUnblocking ? (
          <ActivityIndicator size="small" color="#2B7FFF" />
        ) : (
          <Text
            style={{
              fontFamily: "QuickSand-SemiBold",
              fontSize: 13,
              color: "#2B7FFF",
            }}
          >
            Unblock
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

// ─── Screen ───────────────────────────────────────────────────────────────────
const BlockedUsersScreen = () => {
  const router = useRouter();
  const { data, isLoading, isError } = useGetBlockedUsersQuery(undefined);
  const [unblockUser, { isLoading: isUnblocking }] = useUnblockUserMutation();
  const [unblockingId, setUnblockingId] = React.useState<
    string | number | null
  >(null);

  const blockedUsers: any[] = Array.isArray(data) ? data : data?.results ?? [];

  const handleUnblock = (user: any) => {
    Alert.alert(
      "Unblock User",
      `Are you sure you want to unblock ${user.first_name ?? user.username ?? "this user"}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Unblock",
          style: "default",
          onPress: async () => {
            setUnblockingId(user.user);
            try {
              const res: any = await unblockUser(user.user);
              if (res?.error) throw new Error();
              Toast.show({
                type: "success",
                text1: "User unblocked",
                text2: `${user.first_name ?? user.username ?? "User"} has been unblocked.`,
              });
            } catch {
              Toast.show({
                type: "error",
                text1: "Failed to unblock. Please try again.",
              });
            } finally {
              setUnblockingId(null);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#F9FAFB" }}
      edges={["top"]}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: "#F9FAFB",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#fff",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Ionicons name="chevron-back" size={22} color="#111827" />
        </TouchableOpacity>
        <View style={{ marginLeft: 12 }}>
          <Text
            style={{
              fontFamily: "QuickSand-Bold",
              fontSize: 20,
              color: "#111827",
            }}
          >
            Blocked Users
          </Text>
          {blockedUsers.length > 0 && !isLoading && (
            <Text
              style={{
                fontFamily: "QuickSand-Regular",
                fontSize: 12,
                color: "#9CA3AF",
              }}
            >
              {blockedUsers.length}{" "}
              {blockedUsers.length === 1 ? "person" : "people"} blocked
            </Text>
          )}
        </View>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#2B7FFF" />
        </View>
      ) : isError ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 32 }}>
          <Ionicons name="alert-circle-outline" size={48} color="#D1D5DB" />
          <Text
            style={{
              fontFamily: "QuickSand-SemiBold",
              fontSize: 16,
              color: "#6B7280",
              marginTop: 12,
              textAlign: "center",
            }}
          >
            Failed to load blocked users
          </Text>
        </View>
      ) : blockedUsers.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 32 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: "#EFF6FF",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Ionicons name="person-remove-outline" size={36} color="#2B7FFF" />
          </View>
          <Text
            style={{
              fontFamily: "QuickSand-Bold",
              fontSize: 18,
              color: "#111827",
              marginBottom: 6,
            }}
          >
            No blocked users
          </Text>
          <Text
            style={{
              fontFamily: "QuickSand-Regular",
              fontSize: 14,
              color: "#9CA3AF",
              textAlign: "center",
            }}
          >
            Users you block will appear here. You can unblock them at any time.
          </Text>
        </View>
      ) : (
        <View
          style={{
            margin: 20,
            backgroundColor: "#fff",
            borderRadius: 16,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOpacity: 0.04,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <FlatList
            data={blockedUsers}
            keyExtractor={(item) => String(item.user)}
            renderItem={({ item }) => (
              <BlockedUserRow
                user={item}
                onUnblock={() => handleUnblock(item)}
                isUnblocking={unblockingId === item.user}
              />
            )}
            scrollEnabled={false}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default BlockedUsersScreen;
