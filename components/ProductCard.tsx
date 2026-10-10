import { View } from 'react-native';
import { PressableFeedback } from 'heroui-native';
import { router } from 'expo-router';
import { AppText } from '@/components/AppText';
import { ProductArtwork } from '@/components/ProductArtwork';
import { ScoreBadge } from '@/components/ScoreBadge';
import type { Product } from '@/lib/catalog';
import { colors } from '@/lib/theme';
export function ProductCard({ product }: { product: Product }) {
  return (
    <PressableFeedback
      accessibilityRole="button"
      accessibilityLabel={`View ${product.brand} ${product.name}`}
      onPress={() => router.push({ pathname: '/product/[id]', params: { id: product.id } })}
      style={{ flex: 1 }}
    >
      <View
        style={{
          borderRadius: 18,
          backgroundColor: colors[product.tone],
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <ProductArtwork product={product} height={168} />
      </View>
      <View style={{ paddingTop: 11, gap: 5 }}>
        <AppText weight="semibold" style={{ fontSize: 11, color: colors.muted }}>
          {product.brand}
        </AppText>
        <AppText
          weight="semibold"
          numberOfLines={2}
          style={{ fontSize: 14, lineHeight: 20, minHeight: 40 }}
        >
          {product.name}
        </AppText>
        <View style={{ alignItems: 'flex-start', marginTop: 3 }}>
          <ScoreBadge product={product} />
        </View>
      </View>
    </PressableFeedback>
  );
}
