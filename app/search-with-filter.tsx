import SocialPost, { ApiPost } from "@/components/home/SocialPost";
import {
  useGetCategoriesQuery,
  useGetOccasionsQuery,
  useGetPostsQuery,
} from "@/redux/features/posts/postApi";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Filter Modal ──────────────────────────────────────────────────────────────
interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  categories: { id: number; name: string }[];
  occasions: { id: number; name: string }[];
  targetAudience: string[];
  selectedAudience: string | null;
  selectedCategory: number | null;
  selectedOccasion: number | null;
  onSelectAudience: (aud: string | null) => void;
  onSelectCategory: (id: number | null) => void;
  onSelectOccasion: (id: number | null) => void;
  onApply: () => void;
  onReset: () => void;
}

const FilterModal = ({
  visible,
  onClose,
  categories,
  occasions,
  targetAudience,
  selectedAudience,
  selectedCategory,
  selectedOccasion,
  onSelectAudience,
  onSelectCategory,
  onSelectOccasion,
  onApply,
  onReset,
}: FilterModalProps) => {
  const slideAnim = useRef(new Animated.Value(400)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 12,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 400,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.35)" }}
        onPress={onClose}
      >
        <Pressable onPress={() => {}} style={{ flex: 1 }} />
      </Pressable>

      <Animated.View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "white",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          paddingBottom: 40,
          transform: [{ translateY: slideAnim }],
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 20,
        }}
      >
        {/* Handle */}
        <View
          style={{
            alignSelf: "center",
            width: 40,
            height: 4,
            backgroundColor: "#E5E7EB",
            borderRadius: 99,
            marginTop: 12,
            marginBottom: 4,
          }}
        />

        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: "#F3F4F6",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "700", color: "#111827" }}>
            Filter Posts
          </Text>
          <TouchableOpacity
            onPress={onClose}
            hitSlop={24}
            style={{
              backgroundColor: "#F3F4F6",
              borderRadius: 99,
              padding: 6,
            }}
          >
            <Ionicons name="close" size={18} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          {/* Target Audience */}
          <Text
            style={{
              fontSize: 13,
              fontWeight: "700",
              color: "#6B7280",
              textTransform: "uppercase",
              letterSpacing: 0.8,
              marginBottom: 10,
            }}
          >
            Target Audience
          </Text>
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 24 }}
          >
            {targetAudience.map((aud) => {
              const isActive =
                (aud === "all" && selectedAudience === null) ||
                selectedAudience === aud;
              return (
                <TouchableOpacity
                  key={aud}
                  onPress={() => onSelectAudience(aud === "all" ? null : aud)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 7,
                    borderRadius: 99,
                    backgroundColor: isActive ? "#FF4B3A" : "#F3F4F6",
                    borderWidth: 1,
                    borderColor: isActive ? "#FF4B3A" : "#E5E7EB",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: isActive ? "white" : "#374151",
                      textTransform: "capitalize",
                    }}
                  >
                    {aud}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Categories */}
          <Text
            style={{
              fontSize: 13,
              fontWeight: "700",
              color: "#6B7280",
              textTransform: "uppercase",
              letterSpacing: 0.8,
              marginBottom: 10,
            }}
          >
            Category
          </Text>

          <View
            style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 24 }}
          >
            <TouchableOpacity
              onPress={() => onSelectCategory(null)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 7,
                borderRadius: 99,
                backgroundColor: selectedCategory === null ? "#2B7FFF" : "#F3F4F6",
                borderWidth: 1,
                borderColor: selectedCategory === null ? "#2B7FFF" : "#E5E7EB",
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: selectedCategory === null ? "white" : "#374151",
                }}
              >
                All
              </Text>
            </TouchableOpacity>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() =>
                  onSelectCategory(selectedCategory === cat.id ? null : cat.id)
                }
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 7,
                  borderRadius: 99,
                  backgroundColor:
                    selectedCategory === cat.id ? "#2B7FFF" : "#F3F4F6",
                  borderWidth: 1,
                  borderColor:
                    selectedCategory === cat.id ? "#2B7FFF" : "#E5E7EB",
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "600",
                    color: selectedCategory === cat.id ? "white" : "#374151",
                  }}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Occasions */}
          <Text
            style={{
              fontSize: 13,
              fontWeight: "700",
              color: "#6B7280",
              textTransform: "uppercase",
              letterSpacing: 0.8,
              marginBottom: 10,
            }}
          >
            Occasion
          </Text>
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 32 }}
          >
            <TouchableOpacity
              onPress={() => onSelectOccasion(null)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 7,
                borderRadius: 99,
                backgroundColor: selectedOccasion === null ? "#DBEAFE" : "#F3F4F6",
                borderWidth: 1,
                borderColor: selectedOccasion === null ? "#DBEAFE" : "#E5E7EB",
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: selectedOccasion === null ? "#2B7FFF" : "#374151",
                }}
              >
                All
              </Text>
            </TouchableOpacity>
            {occasions.map((occ) => (
              <TouchableOpacity
                key={occ.id}
                onPress={() =>
                  onSelectOccasion(selectedOccasion === occ.id ? null : occ.id)
                }
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 7,
                  borderRadius: 99,
                  backgroundColor:
                    selectedOccasion === occ.id ? "#DBEAFE" : "#F3F4F6",
                  borderWidth: 1,
                  borderColor:
                    selectedOccasion === occ.id ? "#DBEAFE" : "#E5E7EB",
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "600",
                    color: selectedOccasion === occ.id ? "#2B7FFF" : "#374151",
                  }}
                >
                  {occ.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Action Buttons */}
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              onPress={onReset}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 14,
                backgroundColor: "#F3F4F6",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#E5E7EB",
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: "700", color: "#374151" }}>
                Reset
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onApply}
              style={{
                flex: 2,
                paddingVertical: 10,
                borderRadius: 14,
                backgroundColor: "#FF4B3A",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: "700", color: "white" }}>
                Apply Filters
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};

// ─── Empty State ───────────────────────────────────────────────────────────────
const EmptyState = ({
  query,
  hasFilters,
}: {
  query: string;
  hasFilters: boolean;
}) => (
  <View
    style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 80 }}
  >
    <View
      style={{
        width: 72,
        height: 72,
        borderRadius: 99,
        backgroundColor: "#FFF0ED",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
      }}
    >
      <Ionicons name="search-outline" size={32} color="#FF4B3A" />
    </View>
    <Text style={{ fontSize: 17, fontWeight: "700", color: "#111827", marginBottom: 6 }}>
      No results found
    </Text>
    <Text
      style={{ fontSize: 14, color: "#6B7280", textAlign: "center", maxWidth: 240 }}
    >
      {query
        ? `No posts match "${query}"`
        : hasFilters
        ? "No posts match the selected filters"
        : "Start typing to search for posts"}
    </Text>
  </View>
);

// ─── Main Screen ───────────────────────────────────────────────────────────────
const ItemSeparator = () => <View style={{ height: 8 }} />;

export default function SearchWithFilterScreen() {
  const [search, setSearch] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [pendingCategory, setPendingCategory] = useState<number | null>(null);
  const [pendingOccasion, setPendingOccasion] = useState<number | null>(null);
  const [pendingAudience, setPendingAudience] = useState<string | null>(null);
  const [appliedCategory, setAppliedCategory] = useState<number | null>(null);
  const [appliedOccasion, setAppliedOccasion] = useState<number | null>(null);
  const [appliedAudience, setAppliedAudience] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);

  const { data: postsData, isLoading } = useGetPostsQuery({ page: 1, page_size: 100 });
  const { data: categoriesData } = useGetCategoriesQuery(undefined);
  const { data: occasionsData } = useGetOccasionsQuery(undefined);
  const targetAudience = ["all", "men", "women", "kids", "teens"];

  const categories: { id: number; name: string }[] = useMemo(
    () => (Array.isArray(categoriesData) ? categoriesData : []),
    [categoriesData],
  );
  const occasions: { id: number; name: string }[] = useMemo(
    () => (Array.isArray(occasionsData) ? occasionsData : []),
    [occasionsData],
  );

  const allPosts: ApiPost[] = useMemo(
    () =>
      Array.isArray(postsData)
        ? postsData
        : ((postsData as any)?.results ?? []),
    [postsData],
  );

  // Filter posts client-side by search query + applied filters
  const filteredPosts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allPosts.filter((post) => {
      const matchesSearch =
        !q ||
        post.title?.toLowerCase().includes(q) ||
        post.content?.toLowerCase().includes(q) ||
        post.user?.first_name?.toLowerCase().includes(q) ||
        post.user?.last_name?.toLowerCase().includes(q) ||
        post.user?.username?.toLowerCase().includes(q) ||
        post.amazon_product_name?.toLowerCase().includes(q) ||
        post.category?.name?.toLowerCase().includes(q) ||
        post.occasion?.name?.toLowerCase().includes(q);

      const matchesCategory =
        appliedCategory === null || post.category?.id === appliedCategory;
      const matchesOccasion =
        appliedOccasion === null || post.occasion?.id === appliedOccasion;
      const matchesAudience =
        appliedAudience === null ||
        (post.target_category && post.target_category.toLowerCase().includes(appliedAudience.toLowerCase()));

      return matchesSearch && matchesCategory && matchesOccasion && matchesAudience;
    });
  }, [allPosts, search, appliedCategory, appliedOccasion, appliedAudience]);

  const hasActiveFilters =
    appliedCategory !== null || appliedOccasion !== null || appliedAudience !== null;
  const filterCount =
    (appliedCategory !== null ? 1 : 0) +
    (appliedOccasion !== null ? 1 : 0) +
    (appliedAudience !== null ? 1 : 0);

  const handleOpenFilter = useCallback(() => {
    setPendingCategory(appliedCategory);
    setPendingOccasion(appliedOccasion);
    setPendingAudience(appliedAudience);
    setFilterVisible(true);
  }, [appliedCategory, appliedOccasion, appliedAudience]);

  const handleApplyFilter = useCallback(() => {
    setAppliedCategory(pendingCategory);
    setAppliedOccasion(pendingOccasion);
    setAppliedAudience(pendingAudience);
    setFilterVisible(false);
  }, [pendingCategory, pendingOccasion, pendingAudience]);

  const handleResetFilter = useCallback(() => {
    setPendingCategory(null);
    setPendingOccasion(null);
    setPendingAudience(null);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: ApiPost }) => (
      <View style={{ paddingHorizontal: 12 }}>
        <SocialPost post={item} />
      </View>
    ),
    [],
  );

  const keyExtractor = useCallback((item: ApiPost) => String(item.id), []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} edges={["top"]}>
      {/* ── Header ── */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 10,
          gap: 10,
        }}
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={{
            width: 40,
            height: 40,
            borderRadius: 99,
            backgroundColor: "#F3F4F6",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Ionicons name="chevron-back" size={22} color="#111827" />
        </TouchableOpacity>

        {/* Search Bar */}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#F3F4F6",
            borderRadius: 99,
            paddingHorizontal: 14,
            height: 44,
            borderWidth: 1,
            borderColor: search.length > 0 ? "#FF4B3A" : "transparent",
          }}
        >
          <Ionicons name="search-outline" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
          <TextInput
            ref={inputRef}
            value={search}
            onChangeText={setSearch}
            placeholder="Search"
            placeholderTextColor="#9CA3AF"
            autoFocus
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            style={{
              flex: 1,
              fontSize: 15,
              color: "#111827",
              padding: 0,
            }}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")} hitSlop={12}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Button */}
        <TouchableOpacity
          onPress={handleOpenFilter}
          activeOpacity={0.7}
          style={{
            width: 40,
            height: 40,
            borderRadius: 99,
            backgroundColor: hasActiveFilters ? "#FFF0ED" : "#F3F4F6",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Ionicons
            name="filter-outline"
            size={20}
            color={hasActiveFilters ? "#FF4B3A" : "#6B7280"}
          />
          {filterCount > 0 && (
            <View
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 16,
                height: 16,
                borderRadius: 99,
                backgroundColor: "#FF4B3A",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: "white",
              }}
            >
              <Text style={{ fontSize: 9, fontWeight: "800", color: "white" }}>
                {filterCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* ── Active filter chips ── */}
      {hasActiveFilters && (
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 16,
            paddingBottom: 10,
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {appliedAudience !== null && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#DBEAFE",
                borderRadius: 99,
                paddingHorizontal: 12,
                paddingVertical: 5,
                gap: 4,
              }}
            >
              <Ionicons name="people" size={11} color="#8B5CF6" />
              <Text
                style={{
                  fontSize: 12,
                  color: "#8B5CF6",
                  fontWeight: "600",
                  textTransform: "capitalize",
                }}
              >
                {appliedAudience}
              </Text>
              <TouchableOpacity onPress={() => setAppliedAudience(null)} hitSlop={8}>
                <Ionicons name="close" size={13} color="#8B5CF6" />
              </TouchableOpacity>
            </View>
          )}
          {appliedCategory !== null && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#FFF0ED",
                borderRadius: 99,
                paddingHorizontal: 12,
                paddingVertical: 5,
                gap: 4,
              }}
            >
              <Ionicons name="pricetag" size={11} color="#FF4B3A" />
              <Text style={{ fontSize: 12, color: "#FF4B3A", fontWeight: "600" }}>
                {categories.find((c) => c.id === appliedCategory)?.name ?? "Category"}
              </Text>
              <TouchableOpacity onPress={() => setAppliedCategory(null)} hitSlop={8}>
                <Ionicons name="close" size={13} color="#FF4B3A" />
              </TouchableOpacity>
            </View>
          )}
          {appliedOccasion !== null && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#EFF6FF",
                borderRadius: 99,
                paddingHorizontal: 12,
                paddingVertical: 5,
                gap: 4,
              }}
            >
              <Ionicons name="flame" size={11} color="#2B7FFF" />
              <Text style={{ fontSize: 12, color: "#2B7FFF", fontWeight: "600" }}>
                {occasions.find((o) => o.id === appliedOccasion)?.name ?? "Occasion"}
              </Text>
              <TouchableOpacity onPress={() => setAppliedOccasion(null)} hitSlop={8}>
                <Ionicons name="close" size={13} color="#2B7FFF" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* ── Results count ── */}
      {(search.length > 0 || hasActiveFilters) && !isLoading && (
        <Text
          style={{
            paddingHorizontal: 16,
            paddingBottom: 8,
            fontSize: 13,
            color: "#6B7280",
            fontWeight: "500",
          }}
        >
          {filteredPosts.length} result{filteredPosts.length !== 1 ? "s" : ""}
        </Text>
      )}

      {/* ── Content ── */}
      {isLoading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#FF4B3A" />
          <Text style={{ marginTop: 12, color: "#9CA3AF", fontSize: 14 }}>
            Loading posts…
          </Text>
        </View>
      ) : (
        <FlatList
          data={search.length > 0 || hasActiveFilters ? filteredPosts : []}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={ItemSeparator}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingTop: 4,
            paddingBottom: 40,
            flexGrow: 1,
          }}
          ListEmptyComponent={
            search.length > 0 || hasActiveFilters ? (
              <EmptyState query={search} hasFilters={hasActiveFilters} />
            ) : (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: 80,
                }}
              >
                <View
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 99,
                    backgroundColor: "#F3F4F6",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <Ionicons name="search-outline" size={32} color="#9CA3AF" />
                </View>
                <Text
                  style={{ fontSize: 17, fontWeight: "700", color: "#111827", marginBottom: 6 }}
                >
                  Search posts
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#6B7280",
                    textAlign: "center",
                    maxWidth: 240,
                  }}
                >
                  Type something or use filters to discover posts
                </Text>
              </View>
            )
          }
        />
      )}

      {/* ── Filter Modal ── */}
      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        categories={categories}
        occasions={occasions}
        targetAudience={targetAudience}
        selectedAudience={pendingAudience}
        selectedCategory={pendingCategory}
        selectedOccasion={pendingOccasion}
        onSelectAudience={setPendingAudience}
        onSelectCategory={setPendingCategory}
        onSelectOccasion={setPendingOccasion}
        onApply={handleApplyFilter}
        onReset={handleResetFilter}
      />
    </SafeAreaView>
  );
}