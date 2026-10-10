import { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Stack, Link, router, useLocalSearchParams } from 'expo-router';
import { Button, Tabs, PressableFeedback } from 'heroui-native';
import { ChevronDown, ChevronUp, Info, Fingerprint, FlaskConical } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { products, getScore, ratingLabels, demoNotice, type Rating } from '@/lib/catalog';
import { colors } from '@/lib/theme';
import { AppText } from '@/components/AppText';
import { ProductArtwork } from '@/components/ProductArtwork';
import { ratingColors } from '@/components/ScoreBadge';

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = products.find((item) => item.id === id);
  const [tab, setTab] = useState('ingredients');
  const [expanded, setExpanded] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const header = (
    <Stack.Screen
      options={{
        title: 'Product details',
        headerLeft: router.canGoBack()
          ? undefined
          : () => (
              <Link
                href="/"
                style={{
                  color: colors.ink,
                  paddingHorizontal: 12,
                  fontFamily: 'Inter_500Medium',
                  fontSize: 14,
                }}
              >
                Home
              </Link>
            ),
      }}
    />
  );
  if (!product)
    return (
      <View
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18, padding: 24 }}
      >
        {header}
        <FlaskConical size={36} color={colors.muted} />
        <AppText>That product isn&apos;t in the demo catalog.</AppText>
        <Link href="/" asChild>
          <Button>
            <Button.Label>Explore products</Button.Label>
          </Button>
        </Link>
      </View>
    );
  const score = getScore(product);
  const ratings: Rating[] = ['favorable', 'caution', 'flagged'];
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: insets.bottom + 28 }}
      showsVerticalScrollIndicator={false}
    >
      {header}
      <View
        style={{
          marginHorizontal: 22,
          marginTop: 12,
          borderRadius: 22,
          backgroundColor: colors[product.tone],
          paddingVertical: 8,
        }}
      >
        <ProductArtwork product={product} height={225} />
        <AppText
          style={{ textAlign: 'center', fontSize: 11, color: colors.muted, marginBottom: 12 }}
        >
          Sample packaging
        </AppText>
      </View>
      <View style={{ paddingHorizontal: 22, paddingTop: 23 }}>
        <AppText weight="semibold" style={{ fontSize: 12, color: colors.muted, marginBottom: 8 }}>
          {product.brand}
        </AppText>
        <AppText weight="semibold" style={{ fontSize: 27, lineHeight: 34, letterSpacing: -0.8 }}>
          {product.name}
        </AppText>
        <AppText style={{ color: colors.muted, marginTop: 9, fontSize: 13 }}>
          {product.category} · {product.size}
        </AppText>
        <View
          style={{
            marginTop: 24,
            marginBottom: 25,
            padding: 20,
            borderRadius: 18,
            backgroundColor: colors.ink,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <View style={{ flex: 1, gap: 7 }}>
              <AppText weight="medium" style={{ color: colors.white, fontSize: 16 }}>
                Ingredient score
              </AppText>
              <AppText style={{ color: colors.lavender, fontSize: 12 }}>
                Illustrative · not a safety rating
              </AppText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <AppText
                weight="semibold"
                style={{ color: colors.white, fontSize: 38, letterSpacing: -1.5 }}
              >
                {score}
              </AppText>
              <AppText style={{ color: colors.lavender, fontSize: 13 }}>/100</AppText>
            </View>
          </View>
          <View
            accessibilityLabel="Demo ingredient rating distribution"
            style={{ flexDirection: 'row', gap: 4, height: 6, marginTop: 20 }}
          >
            {product.ingredients.map((ingredient) => (
              <View
                key={ingredient.name}
                style={{
                  flex: 1,
                  borderRadius: 3,
                  backgroundColor:
                    ingredient.rating === 'favorable'
                      ? colors.greenSoft
                      : ingredient.rating === 'caution'
                        ? colors.orangeSoft
                        : colors.pink,
                }}
              />
            ))}
          </View>
        </View>
        <Tabs
          value={tab}
          onValueChange={(value) => {
            setTab(value);
            void Haptics.selectionAsync();
          }}
        >
          <Tabs.List className="mb-6">
            <Tabs.Indicator />
            <Tabs.Trigger value="ingredients" className="flex-1">
              <Tabs.Label>Ingredients</Tabs.Label>
            </Tabs.Trigger>
            <Tabs.Trigger value="compatibility" className="flex-1">
              <Tabs.Label>Compatibility</Tabs.Label>
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="ingredients">
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 18,
              }}
            >
              <AppText weight="semibold" style={{ fontSize: 20 }}>
                Inside the formula
              </AppText>
              <AppText style={{ color: colors.muted, fontSize: 12 }}>
                {product.ingredients.length} ingredients
              </AppText>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 18 }}>
              {ratings.map((rating) => (
                <View key={rating} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                  <View
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 4,
                      backgroundColor: ratingColors[rating].foreground,
                    }}
                  />
                  <AppText style={{ fontSize: 11, color: colors.muted }}>
                    {ratingLabels[rating]}
                  </AppText>
                </View>
              ))}
            </View>
            {product.ingredients.map((ingredient) => {
              const palette = ratingColors[ingredient.rating];
              const open = expanded === ingredient.name;
              return (
                <View
                  key={ingredient.name}
                  style={{ borderTopWidth: 1, borderTopColor: colors.border }}
                >
                  <PressableFeedback
                    onPress={() => {
                      setExpanded(open ? null : ingredient.name);
                      void Haptics.selectionAsync();
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`${ingredient.name}, ${ratingLabels[ingredient.rating]}, show explanation`}
                    accessibilityState={{ expanded: open }}
                    style={{ paddingVertical: 17 }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <View style={{ flex: 1, gap: 5 }}>
                        <AppText
                          weight="semibold"
                          style={{ fontSize: 14, color: palette.foreground }}
                        >
                          {ingredient.name}
                        </AppText>
                        <AppText style={{ fontSize: 12, color: colors.muted }}>
                          {ingredient.role}
                        </AppText>
                      </View>
                      <View
                        style={{
                          backgroundColor: palette.background,
                          borderRadius: 20,
                          paddingHorizontal: 8,
                          paddingVertical: 5,
                        }}
                      >
                        <AppText
                          numberOfLines={1}
                          weight="medium"
                          style={{ fontSize: 11, color: palette.foreground }}
                        >
                          {ratingLabels[ingredient.rating]}
                        </AppText>
                      </View>
                      {open ? (
                        <ChevronUp size={16} color={colors.muted} />
                      ) : (
                        <ChevronDown size={16} color={colors.muted} />
                      )}
                    </View>
                  </PressableFeedback>
                  {open && (
                    <AppText
                      style={{
                        color: colors.muted,
                        lineHeight: 21,
                        fontSize: 13,
                        paddingBottom: 18,
                      }}
                    >
                      {ingredient.note}
                    </AppText>
                  )}
                </View>
              );
            })}
            <View
              style={{
                flexDirection: 'row',
                gap: 9,
                marginTop: 18,
                padding: 16,
                backgroundColor: colors.white,
                borderRadius: 14,
              }}
            >
              <Info size={17} color={colors.muted} />
              <View style={{ flex: 1, gap: 8 }}>
                <AppText weight="medium" style={{ fontSize: 12 }}>
                  About this demo score
                </AppText>
                <AppText style={{ fontSize: 11, color: colors.muted, lineHeight: 17 }}>
                  {demoNotice} Scores average demo ingredient points: favorable 100, caution 65,
                  flagged 25. Formula concentrations are not considered.
                </AppText>
              </View>
            </View>
          </Tabs.Content>
          <Tabs.Content value="compatibility">
            <View style={{ alignItems: 'center', paddingVertical: 28, gap: 18 }}>
              <Fingerprint size={43} color={colors.ink} strokeWidth={1.8} />
              <AppText weight="semibold" style={{ fontSize: 21 }}>
                Skincare, made personal.
              </AppText>
              <AppText style={{ color: colors.muted, textAlign: 'center', lineHeight: 22 }}>
                Personalized results based on your health details are coming in a future version.
              </AppText>
              <View
                style={{
                  backgroundColor: colors.peach,
                  borderRadius: 20,
                  paddingHorizontal: 14,
                  paddingVertical: 7,
                }}
              >
                <AppText weight="medium" style={{ fontSize: 12 }}>
                  Coming later
                </AppText>
              </View>
            </View>
          </Tabs.Content>
        </Tabs>
        <AppText style={{ color: colors.muted, fontSize: 11, marginTop: 24 }}>
          Demo barcode: {product.barcode}
        </AppText>
      </View>
    </ScrollView>
  );
}
