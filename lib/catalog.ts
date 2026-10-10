export type Rating = 'favorable' | 'caution' | 'flagged';
export type Category = 'All' | 'Cleansers' | 'Serums' | 'Moisturizers' | 'Sun care';
export type Ingredient = { name: string; role: string; rating: Rating; note: string };
export type Product = {
  id: string;
  brand: string;
  name: string;
  category: Exclude<Category, 'All'>;
  size: string;
  barcode: string;
  shape: 'pump' | 'dropper' | 'jar' | 'tube';
  tone: 'peach' | 'lavender' | 'blue';
  ingredients: Ingredient[];
};
const water: Ingredient = {
  name: 'Aqua',
  role: 'Solvent',
  rating: 'favorable',
  note: 'The water base of the sample formula.',
};
const glycerin: Ingredient = {
  name: 'Glycerin',
  role: 'Humectant',
  rating: 'favorable',
  note: 'Helps attract moisture to the skin.',
};
const niacinamide: Ingredient = {
  name: 'Niacinamide',
  role: 'Skin conditioning',
  rating: 'favorable',
  note: 'A form of vitamin B3 used in skincare.',
};
const fragrance: Ingredient = {
  name: 'Parfum',
  role: 'Fragrance',
  rating: 'flagged',
  note: 'Fragrance may be unsuitable for some sensitive users. This demo flag is not a safety verdict.',
};
const preservative: Ingredient = {
  name: 'Phenoxyethanol',
  role: 'Preservative',
  rating: 'caution',
  note: 'Helps preserve a formula. Suitability depends on concentration and the complete formulation.',
};
const hyaluronic: Ingredient = {
  name: 'Sodium Hyaluronate',
  role: 'Humectant',
  rating: 'favorable',
  note: 'A hyaluronic acid salt used to support hydration.',
};
const ceramide: Ingredient = {
  name: 'Ceramide NP',
  role: 'Skin conditioning',
  rating: 'favorable',
  note: 'A lipid used in skin-barrier care.',
};
export const products: Product[] = [
  {
    id: 'daily-hydration',
    brand: 'FORME',
    name: 'Daily hydration serum',
    category: 'Serums',
    size: '30 ml',
    barcode: '2000000000015',
    shape: 'dropper',
    tone: 'peach',
    ingredients: [water, glycerin, niacinamide, hyaluronic, preservative],
  },
  {
    id: 'cloud-cream',
    brand: 'SOFT THEORY',
    name: 'Cloud barrier cream',
    category: 'Moisturizers',
    size: '50 ml',
    barcode: '2000000000022',
    shape: 'jar',
    tone: 'lavender',
    ingredients: [
      water,
      glycerin,
      ceramide,
      {
        name: 'Squalane',
        role: 'Emollient',
        rating: 'favorable',
        note: 'Helps soften skin and reduce moisture loss.',
      },
      preservative,
    ],
  },
  {
    id: 'gentle-cleanser',
    brand: 'FORME',
    name: 'Gentle everyday cleanser',
    category: 'Cleansers',
    size: '150 ml',
    barcode: '2000000000039',
    shape: 'pump',
    tone: 'blue',
    ingredients: [
      water,
      glycerin,
      {
        name: 'Coco-Glucoside',
        role: 'Cleansing agent',
        rating: 'favorable',
        note: 'A surfactant used to remove dirt and oil.',
      },
      preservative,
      fragrance,
    ],
  },
  {
    id: 'daily-spf',
    brand: 'DAY KIND',
    name: 'Daily mineral sunscreen SPF 30',
    category: 'Sun care',
    size: '50 ml',
    barcode: '2000000000046',
    shape: 'tube',
    tone: 'peach',
    ingredients: [
      water,
      {
        name: 'Zinc Oxide',
        role: 'UV filter',
        rating: 'favorable',
        note: 'A mineral UV filter. This fictional sample has no verified SPF or protection claims.',
      },
      glycerin,
      preservative,
      fragrance,
    ],
  },
  {
    id: 'night-serum',
    brand: 'SOFT THEORY',
    name: 'Overnight replenishing peptide concentrate',
    category: 'Serums',
    size: '30 ml',
    barcode: '2000000000053',
    shape: 'dropper',
    tone: 'lavender',
    ingredients: [
      water,
      glycerin,
      {
        name: 'Palmitoyl Tripeptide-1',
        role: 'Skin conditioning',
        rating: 'favorable',
        note: 'A peptide used in cosmetic skin-conditioning formulas.',
      },
      hyaluronic,
      preservative,
    ],
  },
  {
    id: 'gel-cleanser',
    brand: 'DAY KIND',
    name: 'Fresh start gel wash',
    category: 'Cleansers',
    size: '120 ml',
    barcode: '2000000000060',
    shape: 'tube',
    tone: 'blue',
    ingredients: [
      water,
      glycerin,
      {
        name: 'Sodium Laureth Sulfate',
        role: 'Cleansing agent',
        rating: 'caution',
        note: 'A cleansing surfactant; tolerance depends on the formula and individual skin.',
      },
      preservative,
      fragrance,
    ],
  },
];
export const categories: Category[] = ['All', 'Cleansers', 'Serums', 'Moisturizers', 'Sun care'];
export const ratingLabels: Record<Rating, string> = {
  favorable: 'Favorable',
  caution: 'Caution',
  flagged: 'Flagged',
};
export function getScore(product: Product): number {
  const points: Record<Rating, number> = { favorable: 100, caution: 65, flagged: 25 };
  return Math.round(
    product.ingredients.reduce((sum, ingredient) => sum + points[ingredient.rating], 0) /
      product.ingredients.length,
  );
}
export function getScoreRating(score: number): Rating {
  return score >= 85 ? 'favorable' : score >= 65 ? 'caution' : 'flagged';
}
export function findBarcode(code: string) {
  return products.find((product) => product.barcode === code.trim());
}
export const demoNotice =
  'Fictional products and illustrative ratings. Not a medical assessment or a verified measure of product safety.';
