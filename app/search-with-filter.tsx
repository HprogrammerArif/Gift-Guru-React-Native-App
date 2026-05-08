import SocialPost, { ApiPost } from "@/components/home/SocialPost";
import {
  useGetCategoriesQuery,
  useGetOccasionsQuery,
  useSearchPostsQuery,
} from "@/redux/features/posts/postApi";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EmptyState from "@/components/search/EmptyState";
import FilterModal from "@/components/search/FilterModal";

// ─── Main Screen ───────────────────────────────────────────────────────────────
const ItemSeparator = () => <View style={{ height: 8 }} />;

export default function SearchWithFilterScreen() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [pendingCategory, setPendingCategory] = useState<number | null>(null);
  const [pendingOccasion, setPendingOccasion] = useState<number | null>(null);
  const [pendingAudience, setPendingAudience] = useState<string | null>(null);
  const [appliedCategory, setAppliedCategory] = useState<number | null>(null);
  const [appliedOccasion, setAppliedOccasion] = useState<number | null>(null);
  const [appliedAudience, setAppliedAudience] = useState<string | null>(null);
  const [isApplied, setIsApplied] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const { data: categoriesData } = useGetCategoriesQuery(undefined);
  const { data: occasionsData } = useGetOccasionsQuery(undefined);
  const targetAudience = ["all", "men", "women", "kids", "teens"];

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const categories: { id: number; name: string }[] = useMemo(
    () => (Array.isArray(categoriesData) ? categoriesData : []),
    [categoriesData],
  );
  const occasions: { id: number; name: string }[] = useMemo(
    () => (Array.isArray(occasionsData) ? occasionsData : []),
    [occasionsData],
  );

  const queryParams = useMemo(() => {
    const params: Record<string, string | number> = { page: 1, page_size: 100 };

    const q = debouncedSearch.trim();
    if (q) {
      params.q = q;
    }

    if (appliedCategory !== null) {
      const cat = categories.find((c) => c.id === appliedCategory);
      if (cat) params.category = cat.name;
    }
    if (appliedOccasion !== null) {
      const occ = occasions.find((o) => o.id === appliedOccasion);
      if (occ) params.occasion = occ.name;
    }
    if (appliedAudience !== null && appliedAudience !== "all") {
      params.target = appliedAudience;
    }
    return params;
  }, [
    appliedCategory,
    appliedOccasion,
    appliedAudience,
    categories,
    occasions,
    debouncedSearch,
  ]);

  const { data: postsData, isLoading, refetch } = useSearchPostsQuery(queryParams);

  const allPosts: ApiPost[] = useMemo(
    () =>
      Array.isArray(postsData)
        ? postsData
        : ((postsData as any)?.results ?? []),
    [postsData],
  );

  // The API handles all filtering.
  const filteredPosts = allPosts;

  const hasActiveFilters =
    appliedCategory !== null ||
    appliedOccasion !== null ||
    appliedAudience !== null;
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
    setIsApplied(true);
    setFilterVisible(false);
    refetch();
  }, [pendingCategory, pendingOccasion, pendingAudience, refetch]);

  const handleResetFilter = useCallback(() => {
    setPendingCategory(null);
    setPendingOccasion(null);
    setPendingAudience(null);
    setAppliedCategory(null);
    setAppliedOccasion(null);
    setAppliedAudience(null);
    setIsApplied(false);
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
          <Ionicons
            name="search-outline"
            size={18}
            color="#9CA3AF"
            style={{ marginRight: 8 }}
          />
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
              <TouchableOpacity
                onPress={() => setAppliedAudience(null)}
                hitSlop={8}
              >
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
              <Text
                style={{ fontSize: 12, color: "#FF4B3A", fontWeight: "600" }}
              >
                {categories.find((c) => c.id === appliedCategory)?.name ??
                  "Category"}
              </Text>
              <TouchableOpacity
                onPress={() => setAppliedCategory(null)}
                hitSlop={8}
              >
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
              <Text
                style={{ fontSize: 12, color: "#2B7FFF", fontWeight: "600" }}
              >
                {occasions.find((o) => o.id === appliedOccasion)?.name ??
                  "Occasion"}
              </Text>
              <TouchableOpacity
                onPress={() => setAppliedOccasion(null)}
                hitSlop={8}
              >
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
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color="#FF4B3A" />
          <Text style={{ marginTop: 12, color: "#9CA3AF", fontSize: 14 }}>
            Loading posts…
          </Text>
        </View>
      ) : (
        <FlatList
          data={search.length > 0 || hasActiveFilters || isApplied ? filteredPosts : []}
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
            search.length > 0 || hasActiveFilters || isApplied ? (
              <EmptyState query={search} hasFilters={hasActiveFilters || isApplied} />
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
                  style={{
                    fontSize: 17,
                    fontWeight: "700",
                    color: "#111827",
                    marginBottom: 6,
                  }}
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
