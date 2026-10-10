import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Stack, Link, router } from 'expo-router';
import { Button, Input, Label, FieldError } from 'heroui-native';
import { AlertCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BarcodeCamera from '@/components/BarcodeCamera';
import { AppText } from '@/components/AppText';
import { products, findBarcode } from '@/lib/catalog';
import { colors } from '@/lib/theme';

export default function ScanScreen() {
  const [barcode, setBarcode] = useState('');
  const [message, setMessage] = useState('');
  const [active, setActive] = useState(true);
  const lock = useRef(false);
  const insets = useSafeAreaInsets();
  const lookup = (code: string) => {
    if (lock.current) return;
    lock.current = true;
    setActive(false);
    const product = findBarcode(code);
    if (product) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace({ pathname: '/product/[id]', params: { id: product.id } });
    } else {
      setMessage(
        code.trim()
          ? 'This barcode is not in the sample catalog. Try a sample product below.'
          : 'Enter a barcode to find a product.',
      );
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };
  const reset = () => {
    lock.current = false;
    setActive(true);
    setMessage('');
    void Haptics.selectionAsync();
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <Stack.Screen
        options={{
          title: 'Scan a product',
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
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 22, paddingBottom: insets.bottom + 28, gap: 23 }}
      >
        <AppText weight="semibold" style={{ fontSize: 28, letterSpacing: -0.8 }}>
          What&apos;s in your bottle?
        </AppText>
        <BarcodeCamera active={active} onScan={lookup} />
        {Platform.OS !== 'web' && (
          <AppText style={{ color: colors.muted, textAlign: 'center', fontSize: 12 }}>
            Place the product barcode inside the frame.
          </AppText>
        )}
        {!!message && (
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <AlertCircle size={19} color={colors.red} />
              <FieldError style={{ flex: 1 }}>{message}</FieldError>
            </View>
            <Button variant="secondary" onPress={reset}>
              <Button.Label>Try another barcode</Button.Label>
            </Button>
          </View>
        )}
        <View style={{ gap: 12 }}>
          <Label>Enter barcode</Label>
          <Input
            value={barcode}
            onChangeText={(value) => {
              setBarcode(value);
              if (message) {
                setMessage('');
                lock.current = false;
                setActive(true);
              }
            }}
            accessibilityLabel="Product barcode"
            placeholder="e.g. 2000000000015"
            keyboardType="number-pad"
            returnKeyType="search"
            onSubmitEditing={() => lookup(barcode)}
          />
          <Button
            onPress={() => {
              lock.current = false;
              lookup(barcode);
            }}
          >
            <Button.Label>Find product</Button.Label>
          </Button>
        </View>
        <View style={{ paddingTop: 6, gap: 14 }}>
          <AppText weight="semibold" style={{ fontSize: 20 }}>
            Try a sample
          </AppText>
          {products.slice(0, 3).map((product) => (
            <Button
              key={product.id}
              variant="tertiary"
              onPress={() => {
                lock.current = false;
                lookup(product.barcode);
              }}
              style={{
                height: 'auto',
                justifyContent: 'flex-start',
                paddingVertical: 12,
                backgroundColor: colors.white,
                borderRadius: 14,
              }}
            >
              <View style={{ flex: 1, gap: 5 }}>
                <Button.Label numberOfLines={1} style={{ fontSize: 13 }}>
                  {product.name}
                </Button.Label>
                <AppText style={{ fontSize: 11, color: colors.muted }}>{product.barcode}</AppText>
              </View>
            </Button>
          ))}
        </View>
        <AppText style={{ fontSize: 11, lineHeight: 17, color: colors.muted }}>
          Only the six fictional catalog barcodes are supported in this MVP.
        </AppText>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
