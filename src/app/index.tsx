import { useState, useRef } from "react";
import { View, FlatList, SectionList, Text } from "react-native";

import { Link } from "expo-router";

import { CATEGORIES, MENU } from "@/utils/data/products";

import { useCartStore } from "@/stores/cartStore";

import { Header } from "@/components/header";
import { CategoryButton } from "@/components/categoryButton";
import { Product } from "@/components/product";

export default function Home() {
  const [category, setCategory] = useState(CATEGORIES[0]);

  const { products } = useCartStore();

  const cardQuantityItems = products.reduce(
    (total, product) => total + product.quantity,
    0
  );

  const sectionListRef = useRef<SectionList>(null);
  const flatListRef = useRef<FlatList>(null);

  function handleCategorySelect(selectedCategory: string) {
    setCategory(selectedCategory);

    const sectionIndex = CATEGORIES.findIndex(
      (category) => category === selectedCategory
    );

    if (sectionListRef.current) {
      sectionListRef.current.scrollToLocation({
        animated: true,
        sectionIndex,
        itemIndex: 0,
      });
    }

    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        viewPosition: 0,
        viewOffset: 20,
        index: sectionIndex,
      });
    }
  }

  return (
    <View className=" flex-1 pt-8">
      <Header title="Faça seu pedido" cartQuantityItems={cardQuantityItems} />
      <FlatList
        ref={flatListRef}
        data={CATEGORIES}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <CategoryButton
            title={item}
            isSelected={item === category}
            onPress={() => handleCategorySelect(item)}
          />
        )}
        horizontal
        className="max-h-10 mt-5"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }}
      />

      <SectionList
        ref={sectionListRef}
        sections={MENU}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        renderItem={({ item }) => (
          <Link href={`/product/${item.id}`} asChild>
            <Product data={item} />
          </Link>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text className="text-xl text-white font-heading mt-8 mb-3">
            {title}
          </Text>
        )}
        className="flex-1 p-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}
