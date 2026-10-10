import { useState } from 'react';
import { FlatList, View, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Button, Input } from 'heroui-native';
import { Search, ScanLine, ArrowUpRight, X, FlaskConical } from 'lucide-react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { products, categories, demoNotice, type Category } from '@/lib/catalog';
import { colors } from '@/lib/theme';
import { AppText } from '@/components/AppText';
import { ProductCard } from '@/components/ProductCard';

export default function Home() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category>('All');
  const insets = useSafeAreaInsets();
  const normalized = query.trim().toLowerCase();
  const filtered = products.filter(
    (product) =>
      (category === 'All' || product.category === category) &&
      [
        product.name,
        product.brand,
        product.category,
        ...product.ingredients.map((ingredient) => ingredient.name),
      ].some((value) => value.toLowerCase().includes(normalized)),
  );
  const filtering = normalized.length > 0 || category !== 'All';
  const clear = () => {
    setQuery('');
    setCategory('All');
    void Haptics.selectionAsync();
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ gap: 15 }}
        contentContainerStyle={{
          paddingHorizontal: 22,
          paddingTop: insets.top + 18,
          paddingBottom: insets.bottom + 28,
        }}
        ItemSeparatorComponent={() => <View style={{ height: 25 }} />}
        renderItem={({ item }) => <ProductCard product={item} />}
        ListHeaderComponent={
          <>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 26,
              }}
            >
              <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                <ScanLine size={24} color={colors.ink} strokeWidth={1.8} />
                <AppText weight="bold" style={{ fontSize: 22, letterSpacing: -0.9 }}>
                  DermaScan
                </AppText>
              </View>
              <View
                style={{
                  backgroundColor: colors.peach,
                  borderRadius: 20,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                }}
              >
                <AppText weight="medium" style={{ fontSize: 11 }}>
                  Demo catalog
                </AppText>
              </View>
            </View>
            <AppText
              weight="semibold"
              style={{ fontSize: 29, lineHeight: 36, letterSpacing: -1.2, marginBottom: 20 }}
            >
              Know your skincare.
            </AppText>
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 22 }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: colors.white,
                  borderRadius: 15,
                  borderWidth: 1,
                  borderColor: colors.border,
                  paddingLeft: 13,
                }}
              >
                <Search size={19} color={colors.muted} strokeWidth={1.8} />
                <Input
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Product or ingredient"
                  accessibilityLabel="Search by product, ingredient or category"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="search"
                  className="flex-1 border-0 bg-transparent"
                  style={{ fontSize: 12, height: 51, paddingHorizontal: 10 }}
                />
                {!!query && (
                  <Button
                    isIconOnly
                    size="sm"
                    variant="tertiary"
                    accessibilityLabel="Clear search"
                    onPress={() => setQuery('')}
                  >
                    <X size={16} color={colors.muted} />
                  </Button>
                )}
              </View>
              <Button
                isIconOnly
                accessibilityLabel="Scan a product barcode"
                onPress={() => router.push('/scan')}
                style={{ height: 53, width: 53, borderRadius: 15 }}
              >
                <ScanLine size={24} color={colors.white} strokeWidth={1.8} />
              </Button>
            </View>
            {!filtering && (
              <View
                style={{
                  height: 209,
                  backgroundColor: colors.peach,
                  borderRadius: 20,
                  overflow: 'hidden',
                  marginBottom: 26,
                }}
              >
                <Image
                  source={require('@/assets/images/beauty-counter.png')}
                  resizeMode="cover"
                  style={{ position: 'absolute', width: '100%', height: 209 }}
                />
                <View
                  style={{
                    padding: 18,
                    width: '60%',
                    height: '100%',
                    justifyContent: 'space-between',
                  }}
                >
                  <AppText
                    weight="semibold"
                    style={{ fontSize: 23, lineHeight: 29, letterSpacing: -0.9 }}
                  >
                    Less guessing.{'\n'}More knowing.
                  </AppText>
                  <Button
                    size="sm"
                    variant="tertiary"
                    onPress={() =>
                      router.push({ pathname: '/product/[id]', params: { id: 'daily-hydration' } })
                    }
                    style={{
                      alignSelf: 'flex-start',
                      paddingHorizontal: 0,
                      backgroundColor: 'transparent',
                    }}
                  >
                    <Button.Label style={{ fontSize: 12 }}>Explore a serum</Button.Label>
                    <ArrowUpRight size={16} color={colors.ink} />
                  </Button>
                </View>
              </View>
            )}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginHorizontal: -22, marginBottom: 26 }}
              contentContainerStyle={{ paddingHorizontal: 22, gap: 8 }}
            >
              {categories.map((item) => (
                <Button
                  key={item}
                  size="sm"
                  variant={item === category ? 'primary' : 'tertiary'}
                  onPress={() => {
                    setCategory(item);
                    void Haptics.selectionAsync();
                  }}
                  style={{
                    borderRadius: 30,
                    borderWidth: item === category ? 0 : 1,
                    borderColor: colors.border,
                    paddingHorizontal: 16,
                    backgroundColor: item === category ? colors.ink : colors.white,
                  }}
                >
                  <Button.Label numberOfLines={1} style={{ fontSize: 12 }}>
                    {item}
                  </Button.Label>
                </Button>
              ))}
            </ScrollView>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 17,
              }}
            >
              <AppText weight="semibold" style={{ fontSize: 22, letterSpacing: -0.6 }}>
                {filtering ? 'Search results' : 'Popular picks'}
              </AppText>
              <AppText style={{ fontSize: 12, color: colors.muted }}>
                {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
              </AppText>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingVertical: 44, gap: 18 }}>
            <Search size={32} color={colors.muted} strokeWidth={1.8} />
            <AppText weight="medium">No products match your search.</AppText>
            <Button variant="secondary" onPress={clear}>
              <Button.Label>Clear filters</Button.Label>
            </Button>
          </View>
        }
        ListFooterComponent={
          <View
            style={{
              flexDirection: 'row',
              gap: 8,
              marginTop: 30,
              paddingTop: 18,
              borderTopWidth: 1,
              borderTopColor: colors.border,
            }}
          >
            <FlaskConical size={17} color={colors.muted} strokeWidth={1.8} />
            <AppText style={{ flex: 1, color: colors.muted, fontSize: 11, lineHeight: 17 }}>
              {demoNotice}
            </AppText>
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
}
