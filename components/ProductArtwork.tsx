import { View } from 'react-native';
import { Svg } from '@/components/ui/primitives/Svg';
import { Rect, Ellipse, Text as SvgText, Path } from 'react-native-svg';
import type { Product } from '@/lib/catalog';
import { colors } from '@/lib/theme';

export function ProductArtwork({ product, height = 160 }: { product: Product; height?: number }) {
  const { shape, brand } = product;
  const bottleColor =
    shape === 'dropper'
      ? colors.amber
      : shape === 'tube' && product.tone === 'peach'
        ? colors.pink
        : colors.bottleWhite;
  return (
    <View
      accessible
      accessibilityLabel={`${brand} ${product.name} sample packaging`}
      style={{ height, width: '100%', alignItems: 'center', justifyContent: 'center' }}
    >
      <Svg width="100%" height={height} viewBox="0 0 180 200">
        <Ellipse
          cx="90"
          cy="180"
          rx={shape === 'jar' ? 52 : 33}
          ry="5"
          fill={colors.ink}
          opacity={0.07}
        />
        {shape === 'jar' ? (
          <>
            <Rect x="35" y="102" width="110" height="75" rx="18" fill={bottleColor} />
            <Rect
              x="33"
              y="89"
              width="114"
              height="27"
              rx="9"
              fill={colors.bottleWhite}
              stroke={colors.border}
              strokeWidth="1"
            />
            <Rect x="41" y="113" width="98" height="58" rx="6" fill={colors.lavender} />
          </>
        ) : shape === 'tube' ? (
          <>
            <Path d="M53 36 L127 36 L119 162 Q90 173 61 162 Z" fill={bottleColor} />
            <Rect x="61" y="159" width="58" height="19" rx="3" fill={colors.ink} />
            <Path d="M56 43 H124" stroke={colors.border} strokeWidth="2" />
          </>
        ) : (
          <>
            {shape === 'pump' ? (
              <>
                <Rect x="81" y="28" width="18" height="28" rx="3" fill={colors.ink} />
                <Rect x="77" y="21" width="43" height="10" rx="4" fill={colors.ink} />
                <Rect x="69" y="49" width="42" height="15" rx="4" fill={colors.ink} />
              </>
            ) : (
              <>
                <Rect x="77" y="20" width="26" height="38" rx="11" fill={colors.bottleWhite} />
                <Rect x="67" y="48" width="46" height="20" rx="4" fill={colors.bottleWhite} />
              </>
            )}
            <Rect x="53" y="64" width="74" height="112" rx="12" fill={bottleColor} />
            <Rect
              x="60"
              y="90"
              width="60"
              height="69"
              rx="2"
              fill={shape === 'dropper' ? colors.bottleWhite : colors.blue}
            />
            <Path d="M59 75 V166" stroke={colors.white} opacity="0.3" strokeWidth="3" />
          </>
        )}
        <SvgText
          x="90"
          y={shape === 'jar' ? 135 : 112}
          fill={colors.ink}
          fontSize={brand.length > 8 ? 7 : 12}
          textAnchor="middle"
          fontWeight="600"
          letterSpacing="1"
        >
          {brand}
        </SvgText>
        <SvgText
          x="90"
          y={shape === 'jar' ? 148 : 130}
          fill={colors.ink}
          fontSize="6"
          textAnchor="middle"
        >
          {product.category === 'Serums'
            ? 'HYDRATION + CARE'
            : product.category === 'Cleansers'
              ? 'GENTLE DAILY CARE'
              : product.category === 'Sun care'
                ? 'MINERAL SPF 30'
                : 'BARRIER CARE'}
        </SvgText>
        <SvgText
          x="90"
          y={shape === 'jar' ? 160 : 145}
          fill={colors.muted}
          fontSize="6"
          textAnchor="middle"
        >
          {product.size}
        </SvgText>
      </Svg>
    </View>
  );
}
