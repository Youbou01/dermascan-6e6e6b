import { View } from 'react-native';
import { colors } from '@/lib/theme';
import { AppText } from '@/components/AppText';
import { getScore, getScoreRating, type Product, type Rating } from '@/lib/catalog';
export const ratingColors: Record<Rating, { foreground: string; background: string }> = {
  favorable: { foreground: colors.green, background: colors.greenSoft },
  caution: { foreground: colors.orange, background: colors.orangeSoft },
  flagged: { foreground: colors.red, background: colors.redSoft },
};
export function ScoreBadge({ product }: { product: Product }) {
  const score = getScore(product);
  const palette = ratingColors[getScoreRating(score)];
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: palette.background,
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: 20,
      }}
    >
      <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: palette.foreground }} />
      <AppText
        weight="semibold"
        numberOfLines={1}
        style={{ fontSize: 11, color: palette.foreground }}
      >
        {score}/100 · Demo
      </AppText>
    </View>
  );
}
