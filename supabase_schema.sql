-- ==============================================================================
-- WORKOUT NUTRITION - SUPABASE COMPLETE DATABASE SCHEMA & SEED DATA
-- ==============================================================================
-- Execute this entire script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/sopezjolczjazecengwl/sql/new
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USER PROFILES TABLE (Linked with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  address_line TEXT,
  city TEXT,
  state TEXT,
  pin_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Helper function with SECURITY DEFINER to avoid infinite recursion in RLS policies
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by owner and admin" ON public.profiles;
CREATE POLICY "Public profiles are viewable by owner and admin"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() = id OR public.is_admin()
  );

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Trigger to automatically create a profile on new auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    COALESCE(new.raw_user_meta_data->>'role', 'customer')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  brand TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC NOT NULL,
  discount NUMERIC NOT NULL DEFAULT 0,
  rating NUMERIC NOT NULL DEFAULT 5.0,
  review_count INTEGER NOT NULL DEFAULT 0,
  images TEXT[] NOT NULL DEFAULT '{}',
  description TEXT NOT NULL,
  benefits TEXT[] NOT NULL DEFAULT '{}',
  ingredients TEXT NOT NULL DEFAULT '',
  servings INTEGER NOT NULL DEFAULT 1,
  flavours TEXT[] NOT NULL DEFAULT '{}',
  sizes TEXT[] NOT NULL DEFAULT '{}',
  size_variants JSONB DEFAULT '[]'::jsonb,
  stock INTEGER NOT NULL DEFAULT 0,
  is_best_seller BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_new BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[] NOT NULL DEFAULT '{}',
  goals TEXT[] NOT NULL DEFAULT '{}',
  dietary TEXT NOT NULL DEFAULT 'Vegetarian',
  nutrition_facts JSONB NOT NULL DEFAULT '[]'::jsonb,
  how_to_use TEXT NOT NULL DEFAULT '',
  flavour_notes TEXT,
  who_is_it_for TEXT[] NOT NULL DEFAULT '{}',
  when_to_use TEXT NOT NULL DEFAULT '',
  goal_supported TEXT NOT NULL DEFAULT '',
  what_goal_does_it_support TEXT NOT NULL DEFAULT '',
  authenticity_details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Products Policies:
-- A. Anyone (authenticated or guest/anon) can view all products
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT
  USING (true);

-- B. Only users with role = 'admin' can insert products
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  WITH CHECK (public.is_admin());

-- C. Only users with role = 'admin' can update products
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  USING (public.is_admin());

-- D. Only users with role = 'admin' can delete products
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  USING (public.is_admin());


-- 4. STORAGE BUCKET FOR PRODUCT IMAGES (Optional if using Supabase Storage)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public can view images in product-images bucket
DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
CREATE POLICY "Public read product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Only admins can upload product images
DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
CREATE POLICY "Admins can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );


-- 5. SEED INITIAL PRODUCTS (12 Catalog Items)
INSERT INTO public.products (
  id, slug, brand, name, category, subcategory, price, original_price, discount,
  rating, review_count, images, description, benefits, ingredients, servings,
  flavours, sizes, stock, is_best_seller, is_featured, is_new, tags, goals,
  dietary, nutrition_facts, how_to_use, who_is_it_for, when_to_use, what_goal_does_it_support
) VALUES
(
  'on-gold-standard-100-whey',
  'on-gold-standard-100-whey',
  'Optimum Nutrition',
  'Gold Standard 100% Whey Protein',
  'Whey Protein',
  'Blended Whey',
  3699, 4899, 24,
  4.8, 3420,
  ARRAY['/products/on-gold-standard.jpg', '/products/Whey-Isolate-2.jpg'],
  'The world’s best-selling whey protein powder delivers 24g of high biological value whey protein per serving. Primarily formulated with Whey Protein Isolate (WPI), micro-filtered for rapid digestion, instant mixing, and lean recovery.',
  ARRAY[
    'Delivers 24g of protein per scoop primarily from Whey Protein Isolate to support muscle protein synthesis',
    'Provides 5.5g naturally occurring BCAAs designed for intra-muscular recovery',
    'Informed Choice certified — tested for banned substances',
    'Instantized formula mixes seamlessly with a spoon in seconds'
  ],
  'Protein Blend (Whey Protein Isolate, Whey Protein Concentrate, Hydrolyzed Whey Peptides), Cocoa, Natural & Artificial Flavors, Lecithin, Acesulfame Potassium, Aminogen, Lactase.',
  73,
  ARRAY['Double Rich Chocolate', 'Extreme Milk Chocolate', 'Delicious Strawberry', 'Vanilla Ice Cream', 'Mocha Cappuccino'],
  ARRAY['2 lbs (907g)', '5 lbs (2.27 kg)', '10 lbs (4.54 kg)'],
  45, true, true, false,
  ARRAY['whey', 'protein', 'bestseller', 'on', 'recovery'],
  ARRAY['build-muscle', 'recovery', 'health-wellness'],
  'Vegetarian',
  '[{"nutrient": "Calories", "amountPerServing": "120 kcal"}, {"nutrient": "Total Protein", "amountPerServing": "24 g"}, {"nutrient": "Total Carbohydrates", "amountPerServing": "3 g"}, {"nutrient": "Total Fat", "amountPerServing": "1.5 g"}, {"nutrient": "BCAAs", "amountPerServing": "5.5 g"}, {"nutrient": "Glutamine", "amountPerServing": "4 g"}]'::jsonb,
  'Mix 1 rounded scoop with 180-240ml of cold water or skimmed milk. Shake for 20 seconds until smooth.',
  ARRAY['Lifters aiming for lean muscle building', 'Athletes requiring fast post-workout recovery', 'Anyone needing convenient daily protein intake'],
  'Consume within 30 to 45 minutes post-workout or first thing in the morning.',
  'Supports muscle hypertrophy, muscle protein synthesis, and everyday lean recovery.'
),
(
  'muscletech-platinum-creatine',
  'muscletech-platinum-creatine',
  'MuscleTech',
  'Platinum 100% Micronized Creatine',
  'Creatine',
  'Micronized Creatine',
  749, 1999, 62,
  4.8, 1890,
  ARRAY['/products/Creatine.jpg', '/products/Whey-Isolate-2.jpg'],
  'MuscleTech Platinum 100% Creatine delivers a full 3g dose of ultra-pure HPLC-tested micronized creatine monohydrate per scoop. Designed to support intramuscular phosphocreatine replenishment and power output.',
  ARRAY[
    'Supplies 3g of pure HPLC-tested micronized creatine monohydrate per serving',
    'Supports cellular ATP resynthesis during short-burst, high-intensity lifting',
    'Aids in cellular muscular volumization and hydration',
    'Zero fillers, unflavoured, mixes effortlessly into water or shakes'
  ],
  '100% Pure Micronized Creatine Monohydrate.',
  83,
  ARRAY['Unflavoured'],
  ARRAY['250g (83 Servings)', '400g (133 Servings)'],
  120, true, true, false,
  ARRAY['creatine', 'strength', 'power', 'muscletech', 'bestseller'],
  ARRAY['increase-strength', 'build-muscle', 'boost-energy'],
  'Vegan',
  '[{"nutrient": "Creatine Monohydrate", "amountPerServing": "3 g"}, {"nutrient": "Carbohydrates", "amountPerServing": "0 g"}, {"nutrient": "Calories", "amountPerServing": "0 kcal"}]'::jsonb,
  'Mix 1 scoop (3g) with 200ml of water, fruit juice, or post-workout whey shake once daily.',
  ARRAY['Strength athletes and powerlifters', 'Bodybuilders seeking increased training volume', 'High-intensity interval and combat sports athletes'],
  'Take 3g to 5g daily consistently, either post-workout with protein or in the morning.',
  'Designed to support explosive power output, training capacity, and strength progression.'
),
(
  'muscleblaze-biozyme-performance-whey',
  'muscleblaze-biozyme-performance-whey',
  'MuscleBlaze',
  'Biozyme Performance Whey Protein',
  'Whey Protein',
  'Whey Concentrate',
  2499, 3899, 36,
  4.7, 5210,
  ARRAY['/products/biozyme-whey.jpg'],
  'India’s first clinically tested whey protein customized for South Asian digestive enzymes. Biozyme Whey features an Enhanced Absorption Formula (EAF) clinically tested to support higher protein absorption and minimize stomach discomfort.',
  ARRAY[
    'Supplies 25g pure protein & 5.51g BCAAs per scoop',
    'Enhanced Absorption Formula (EAF) designed to support 50% higher protein absorption',
    'Formulated to help lower post-shake stomach discomfort',
    'Informed-Choice UK certified and Clean Label Project verified'
  ],
  'Whey Protein Concentrate, Cocoa Powder, Flavors, Biozyme Digestive Enzymes Blend, Sweetener (INS 955).',
  56,
  ARRAY['Rich Chocolate', 'Magical Mango', 'Kesar Kulfi', 'Cafe Mocha'],
  ARRAY['1 kg (2.2 lbs)', '2 kg (4.4 lbs)', '4 kg (8.8 lbs)'],
  80, true, true, false,
  ARRAY['muscleblaze', 'biozyme', 'whey', 'india', 'bestseller'],
  ARRAY['build-muscle', 'recovery'],
  'Vegetarian',
  '[{"nutrient": "Calories", "amountPerServing": "133 kcal"}, {"nutrient": "Total Protein", "amountPerServing": "25 g"}, {"nutrient": "Total Carbohydrates", "amountPerServing": "3.6 g"}, {"nutrient": "Total Fat", "amountPerServing": "2.1 g"}, {"nutrient": "BCAAs", "amountPerServing": "5.51 g"}]'::jsonb,
  'Add 1 heaping scoop (36g) in 200ml of chilled water. Shake for 15-20 seconds until completely dissolved.',
  ARRAY['Athletes with sensitive stomachs or enzyme intolerance', 'Beginner to advanced lifters looking for maximum protein uptake', 'Daily protein supplement users'],
  'Consume within 30 minutes post-workout or in between main meals.',
  'Supports muscle recovery, digestive ease, and sustained nitrogen retention.'
),
(
  'dymatize-iso100-hydrolyzed',
  'dymatize-iso100-hydrolyzed',
  'Dymatize',
  'ISO100 Hydrolyzed 100% Whey Isolate',
  'Whey Isolate',
  'Hydrolyzed Isolate',
  6899, 9499, 27,
  4.9, 2150,
  ARRAY['/products/dymatize-whey-protein.jpg', '/products/Whey-Isolate-2.jpg'],
  'Dymatize ISO100 delivers 25g of hydrolyzed 100% whey protein isolate and 5.5g BCAAs per scoop with less than 1g sugar and zero fat. Engineered for rapid amino absorption and contest-prep purity.',
  ARRAY[
    '25g Hydrolyzed 100% Whey Protein Isolate per serving with ultra-fast digestion',
    'Less than 1g Sugar and virtually zero fat per scoop',
    'Pre-broken peptide bonds designed for fast gastric transit',
    'Informed-Choice certified for athletic competition'
  ],
  'Hydrolyzed Whey Protein Isolate, Whey Protein Isolate, Natural and Artificial Flavors, Cocoa, Salt, Sucralose, Stevia.',
  71,
  ARRAY['Gourmet Chocolate', 'Cookies & Cream', 'Fudge Brownie', 'Strawberry'],
  ARRAY['5 lbs (2.3 kg)', '3 lbs (1.36 kg)'],
  0, true, true, false,
  ARRAY['dymatize', 'iso100', 'isolate', 'pure', 'fast-absorbing'],
  ARRAY['build-muscle', 'lose-fat', 'recovery'],
  'Gluten-Free',
  '[{"nutrient": "Calories", "amountPerServing": "120 kcal"}, {"nutrient": "Total Protein", "amountPerServing": "25 g"}, {"nutrient": "Total Carbohydrates", "amountPerServing": "2 g"}, {"nutrient": "Total Fat", "amountPerServing": "0.5 g"}, {"nutrient": "BCAAs", "amountPerServing": "5.5 g"}]'::jsonb,
  'Mix 1 scoop with 150-180ml of cold water or almond milk.',
  ARRAY['Athletes in cutting or contest-preparation phases', 'Lactose-intolerant individuals seeking zero-carb protein', 'Competitive athletes needing the cleanest possible macronutrient profile'],
  'First thing in the morning or immediately post-training.',
  'Supports lean muscle definition, fast amino delivery, and fat loss dieting.'
),
(
  'cellucor-c4-original-preworkout',
  'cellucor-c4-original-preworkout',
  'Cellucor',
  'C4 Original Explosive Pre-Workout',
  'Pre Workout',
  'High Stimulant',
  1899, 2999, 37,
  4.8, 4120,
  ARRAY['/products/Cellucor-pre-workout.jpg', 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80'],
  'Fuel intense training sessions with America’s top-selling pre-workout. C4 Original combines CarnoSyn Beta-Alanine, Creatine Nitrate, and caffeine for training drive, muscular endurance, and mental focus.',
  ARRAY[
    '150mg Anhydrous Caffeine formulated to support alert mental focus and training energy',
    '1.6g CarnoSyn Beta-Alanine designed to help buffer muscular fatigue in higher reps',
    '1g Creatine Nitrate (NO3-T) for nitric oxide support and cellular pumps',
    'Zero sugar, zero crash formulation'
  ],
  'CarnoSyn Beta-Alanine, Micronized Creatine Monohydrate, Arginine AKG, Caffeine Anhydrous, Tyrosine, Vitamin C, Niacin, B12, Malic Acid.',
  30,
  ARRAY['Fruit Punch', 'Icy Blue Razz', 'Watermelon', 'Orange Burst'],
  ARRAY['30 Servings (195g)', '60 Servings (390g)'],
  64, true, true, false,
  ARRAY['c4', 'pre-workout', 'energy', 'focus', 'cellucor'],
  ARRAY['boost-energy', 'increase-strength'],
  'Vegetarian',
  '[{"nutrient": "Caffeine Anhydrous", "amountPerServing": "150 mg"}, {"nutrient": "CarnoSyn Beta-Alanine", "amountPerServing": "1600 mg"}, {"nutrient": "Creatine Nitrate", "amountPerServing": "1000 mg"}]'::jsonb,
  'Take 1 level scoop with 180ml of cold water 20-30 minutes before exercise.',
  ARRAY['Lifters needing extra drive before heavy training', 'Endurance and strength athletes looking to delay fatigue', 'Anyone training early morning or after long work days'],
  'Take 20 to 30 minutes before training. Avoid within 4-5 hours of sleep.',
  'Designed to support explosive energy, workout focus, and athletic stamina.'
),
(
  'labrada-muscle-mass-gainer',
  'labrada-muscle-mass-gainer',
  'Labrada',
  'Muscle Mass Gainer High-Calorie Formula',
  'Mass Gainer',
  'High Calorie Mass Gainer',
  3499, 5199, 33,
  4.8, 3120,
  ARRAY['/products/Labrada-Muscle-Mass-Gainer-Powder.jpg'],
  'Engineered by Lee Labrada for hardgainers who struggle to put on weight. Packs 1244 rich calories, 52g high-grade multi-phase protein, and 250g energy-dense carbs per serving with zero dextrose or fructose spikes.',
  ARRAY[
    'Supplies 1244 calories and 52g protein per full serving to support positive caloric balance',
    'Rich in BCAAs and muscle-building EAAs to support nitrogen retention',
    'Fortified with 17 vitamins and minerals for daily metabolic balance',
    'Creamy shake that digests smoothly without heavy bloating'
  ],
  'Maltodextrin, Cross Flow Ultra-Microfiltered Whey Protein Concentrate, Dutch Cocoa, Natural & Artificial Flavors, Vitamin & Mineral Blend.',
  28,
  ARRAY['Chocolate', 'Vanilla', 'Strawberry'],
  ARRAY['6 lbs (2.7 kg)', '11 lbs (5 kg)'],
  52, true, true, false,
  ARRAY['labrada', 'mass-gainer', 'bulking', 'high-calorie'],
  ARRAY['gain-weight', 'build-muscle', 'increase-strength'],
  'Vegetarian',
  '[{"nutrient": "Calories", "amountPerServing": "1244 kcal"}, {"nutrient": "Total Protein", "amountPerServing": "52 g"}, {"nutrient": "Total Carbohydrates", "amountPerServing": "250 g"}, {"nutrient": "Total Fat", "amountPerServing": "4.5 g"}, {"nutrient": "BCAAs", "amountPerServing": "10.9 g"}]'::jsonb,
  'Add 9 scoops to 32 oz. of milk or cold water. Blend for 45-60 seconds. Drink 1 serving daily between meals.',
  ARRAY['Hardgainers and ectomorphs struggling to gain scale weight', 'Athletes with extremely high daily caloric expenditures', 'Anyone needing a convenient, calorie-dense liquid meal'],
  'Consume between meals or post-workout to achieve a steady daily caloric surplus.',
  'Designed to support healthy weight gain, bulk progression, and glycogen recovery.'
),
(
  'wellcore-micronized-creatine',
  'wellcore-micronized-creatine',
  'Wellcore',
  'Pure Micronized Creatine Monohydrate',
  'Creatine',
  'Micronized Creatine',
  899, 1499, 40,
  4.9, 2840,
  ARRAY['/products/Wellcore-Pure-Micronised-Creatine-Monohydrate-Powder.jpg', '/products/Whey-Isolate-2.jpg'],
  'Wellcore Micronized Creatine features Mesh 200 ultra-fine particle milling for lightning-fast solubility and zero grittiness. Supports cellular ATP power and muscular phosphocreatine storage.',
  ARRAY[
    '100% Pure Creatine Monohydrate (Mesh 200 particle size) for effortless dissolution',
    'Supports cellular ATP resynthesis and power output during heavy sets',
    'Zero fillers, zero artificial colors, zero added sugar',
    'Lab tested for heavy metal purity and banned substances'
  ],
  '100% Pure Micronized Creatine Monohydrate.',
  100,
  ARRAY['Unflavoured'],
  ARRAY['250g (83 Servings)', '300g (100 Servings)'],
  95, true, true, false,
  ARRAY['wellcore', 'creatine', 'strength', 'mesh200'],
  ARRAY['increase-strength', 'build-muscle', 'boost-energy'],
  'Vegan',
  '[{"nutrient": "Creatine Monohydrate", "amountPerServing": "3 g"}, {"nutrient": "Calories", "amountPerServing": "0 kcal"}]'::jsonb,
  'Take 1 scoop (3g) with 200ml water or protein shake daily. Consume 3-4 liters of water throughout the day.',
  ARRAY['Lifters wanting gritty-free, 100% soluble creatine', 'Powerlifters, crossfitters, and sprinters', 'Anyone seeking evidence-based strength progression'],
  'Take 3g once daily with water, fruit juice, or post-workout protein shake.',
  'Supports muscular power, strength progression, and cellular hydration.'
),
(
  'on-fish-oil-omega-3',
  'on-fish-oil-omega-3',
  'Optimum Nutrition',
  'MuscleTech Platinum 100% Fish Oil',
  'Fish Oil',
  'Enteric Coated Softgels',
  899, 1399, 36,
  4.8, 1980,
  ARRAY['/products/on-omega-3-fish-oil.jpg'],
  'Optimum Nutrition Fish Oil softgels are enteric coated to withstand stomach acids and digest directly in the intestines, helping eliminate fishy burps. Supplies essential EPA and DHA omega-3 fatty acids.',
  ARRAY[
    '1,000mg Fish Oil providing 300mg total Omega-3s (EPA + DHA) per softgel',
    'Enteric coating designed to help prevent fishy aftertaste and reflux',
    'Supports joint comfort, cardiovascular wellness, and overall cellular recovery',
    'Molecularly purified to screen for heavy metals, PCBs, and dioxins'
  ],
  'Fish Oil, Gelatin, Glycerin, Enteric Coating, Mixed Tocopherols.',
  100,
  ARRAY['Softgels'],
  ARRAY['100 Softgels', '200 Softgels'],
  85, true, true, false,
  ARRAY['on', 'fish-oil', 'omega3', 'joint', 'wellness'],
  ARRAY['health-wellness', 'recovery'],
  'Non-Vegetarian',
  '[{"nutrient": "Total Fish Oil", "amountPerServing": "1000 mg"}, {"nutrient": "EPA (Eicosapentaenoic Acid)", "amountPerServing": "180 mg"}, {"nutrient": "DHA (Docosahexaenoic Acid)", "amountPerServing": "120 mg"}]'::jsonb,
  'Take 1 softgel with food and water 1 to 3 times daily.',
  ARRAY['Lifters subjecting joints and tendons to heavy compressive loading', 'Anyone not consuming fatty fish 2-3 times weekly', 'Individuals focused on cardiovascular and brain wellness'],
  'Take 1 softgel up to 3 times daily with whole food meals containing healthy fats.',
  'Supports joint comfort, cardiovascular health, and post-exercise recovery.'
),
(
  'muscleblaze-mb-vite-multivitamin',
  'muscleblaze-mb-vite-multivitamin',
  'MuscleBlaze',
  'MB-Vite Daily Multivitamin for Athletes',
  'Multivitamins',
  'Men’s Daily Athlete',
  599, 999, 40,
  4.7, 4290,
  ARRAY['/products/mb-vite.jpg'],
  'Formulated with 51 active ingredients and 6 specialized botanical blends including Amino Acid blend, Metabolism blend, and Digestive Enzymes to replenish micronutrients lost during strenuous training.',
  ARRAY[
    'Supplies 51 active ingredients including 100% RDA of essential vitamins',
    '6 specialized blends designed to support daily vitality, energy metabolism, and immunity',
    'Features Ashwagandha and Ginseng to support adaptive stress response',
    'Fortified with digestive enzymes for smooth nutrient bioavailability'
  ],
  'Vitamins A, C, D, E, K, B-Complex, Zinc, Magnesium, Botanical Extracts, Amino Acid Complex, Digestive Enzymes.',
  60,
  ARRAY['Tablets'],
  ARRAY['60 Tablets', '120 Tablets'],
  110, true, true, false,
  ARRAY['muscleblaze', 'multivitamin', 'mbvite', 'immunity', 'wellness'],
  ARRAY['health-wellness', 'recovery'],
  'Vegetarian',
  '[{"nutrient": "Vitamin C", "amountPerServing": "40 mg"}, {"nutrient": "Vitamin D3", "amountPerServing": "400 IU"}, {"nutrient": "Zinc", "amountPerServing": "12 mg"}, {"nutrient": "B-Complex", "amountPerServing": "100% RDA"}]'::jsonb,
  'Consume 1 tablet daily with breakfast or lunch.',
  ARRAY['Active lifters and endurance athletes with elevated micronutrient requirements', 'Anyone seeking an all-in-one daily vitality and immunity foundation'],
  'Consume 1 tablet daily with breakfast or your first meal.',
  'Supports everyday vitality, immune defense, and micronutrient balance.'
),
(
  'bpi-sports-best-bcaa',
  'bpi-sports-best-bcaa',
  'BPI Sports',
  'Best BCAA Oligopeptide-Enzymatic Technology',
  'BCAA & EAA',
  '2:1:1 BCAA',
  1699, 2699, 37,
  4.7, 1480,
  ARRAY['/products/bpi-bcaa.jpg'],
  'First intra-workout to bond BCAAs into oligopeptides for faster cellular transit. Combined with CLA and Agmatine Sulfate to support muscle preservation and hydration during grueling sessions.',
  ARRAY[
    '5g Oligopeptide-bonded BCAAs (2:1:1 Leucine, Isoleucine, Valine) to support intra-workout endurance',
    '1g CLA Matrix to support metabolic fat mobilization during training',
    'Helps support muscle preservation during fasted cardio or cutting bouts',
    'Crisp, refreshing taste with zero added sugar'
  ],
  'Glycyl-Alanyl-Lysine-L-Leucine, Glycyl-Alanyl-Lysine-L-Isoleucine, Glycyl-Alanyl-Lysine-L-Valine, CLA Matrix, Agmatine Sulfate, Citric Acid, Flavors.',
  30,
  ARRAY['Blue Raspberry', 'Fruit Punch', 'Watermelon Ice'],
  ARRAY['300g (30 Servings)'],
  50, true, true, false,
  ARRAY['bpi', 'bcaa', 'intra-workout', 'recovery', 'cla'],
  ARRAY['recovery', 'lose-fat'],
  'Vegetarian',
  '[{"nutrient": "BCAA Blend", "amountPerServing": "5000 mg"}, {"nutrient": "CLA Matrix", "amountPerServing": "1000 mg"}, {"nutrient": "Agmatine Sulfate", "amountPerServing": "250 mg"}]'::jsonb,
  'Mix 1 scoop with 240-350ml of cold water and sip during training.',
  ARRAY['Athletes training in a caloric deficit or fasted state', 'Lifters enduring long 90+ minute workouts needing amino hydration'],
  'Sip throughout your workout in 300-400ml of chilled water.',
  'Supports intra-workout hydration, endurance, and muscle preservation.'
),
(
  'dragon-pharma-black-viper',
  'dragon-pharma-black-viper',
  'Dragon Pharma',
  'Black Viper Hardcore Thermogenic Fat Burner',
  'Fat Burner',
  'Thermogenic Shredders',
  2499, 3899, 36,
  4.8, 760,
  ARRAY['/products/black-viper.jpg', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'],
  'Black Viper is a high-potency thermogenic formula designed to support caloric burn, alertness, and metabolic drive during cutting blocks.',
  ARRAY[
    'Formulated with 300mg Caffeine and botanical thermogenics to support metabolic rate',
    'Supports daytime alertness and workout drive during calorie-restricted phases',
    'Designed to help manage appetite and mid-day cravings'
  ],
  'Caffeine Anhydrous, White Willow Bark, Ephedra Viridis, L-Tyrosine, Green Tea Extract, Cayenne Pepper, Yohimbe Bark.',
  90,
  ARRAY['Capsules'],
  ARRAY['90 Capsules'],
  0, false, true, false,
  ARRAY['dragon-pharma', 'black-viper', 'fat-burner', 'thermogenic'],
  ARRAY['lose-fat', 'boost-energy'],
  'Vegetarian',
  '[{"nutrient": "Caffeine Anhydrous", "amountPerServing": "300 mg"}, {"nutrient": "Ephedra Viridis", "amountPerServing": "25 mg"}, {"nutrient": "Yohimbe Extract", "amountPerServing": "5 mg"}]'::jsonb,
  'Take 1 capsule with water in the morning with food. Do not exceed 1 capsule per day.',
  ARRAY['Experienced lifters in dedicated cutting and fat-loss phases', 'Individuals needing heightened metabolic and energy support'],
  'Take 1 capsule with food in the morning. Avoid taking in the late afternoon.',
  'Supports metabolic energy expenditure and focus during fat-loss dieting.'
),
(
  'avvatar-100-whey-protein',
  'avvatar-100-whey-protein',
  'Avvatar',
  '100% Pure Cow Milk Whey Protein',
  'Whey Protein',
  'Blended Whey',
  2699, 3799, 29,
  4.7, 1410,
  ARRAY['/products/avvatar-whey-protein.jpg'],
  'Made from fresh cow milk sourced directly from Parag farms within 24 hours of milking. Cold-processed microfiltered native whey delivers 27g protein and 6g naturally occurring BCAAs.',
  ARRAY[
    'Supplies 27g protein per 35g scoop to support muscle tissue repair',
    '6g naturally occurring BCAAs and 4.4g Glutamic acid',
    'Processed from fresh milk within 24 hours of collection',
    'Zero unnecessary fillers with complete farm-to-shaker traceability'
  ],
  'Whey Protein Blend (Concentrate, Isolate), Cocoa, Iodized Salt, Stabilizer (INS 415), Sweetener (INS 955).',
  57,
  ARRAY['Belgian Chocolate', 'Cafe Latte', 'Malai Kulfi'],
  ARRAY['1 kg (2.2 lbs)', '2 kg (4.4 lbs)'],
  61, true, true, false,
  ARRAY['avvatar', 'whey', 'cow-milk', 'fresh', 'india'],
  ARRAY['build-muscle', 'recovery', 'health-wellness'],
  'Vegetarian',
  '[{"nutrient": "Calories", "amountPerServing": "136 kcal"}, {"nutrient": "Protein", "amountPerServing": "27 g"}, {"nutrient": "Carbohydrates", "amountPerServing": "2.5 g"}, {"nutrient": "Fat", "amountPerServing": "1.9 g"}]'::jsonb,
  'Add 1 scoop to 180-200ml cold water or skimmed milk. Shake vigorously for 30 seconds.',
  ARRAY['Lifters who prioritize fresh, native Indian dairy sourcing', 'Athletes looking for higher protein per scoop (27g yield)'],
  'Immediately post-workout or as a nutritious breakfast protein boost.',
  'Supports muscle protein synthesis, strength recovery, and clean nutrition.'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  brand = EXCLUDED.brand,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  discount = EXCLUDED.discount,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  images = EXCLUDED.images,
  description = EXCLUDED.description,
  benefits = EXCLUDED.benefits,
  ingredients = EXCLUDED.ingredients,
  servings = EXCLUDED.servings,
  flavours = EXCLUDED.flavours,
  sizes = EXCLUDED.sizes,
  stock = EXCLUDED.stock,
  is_best_seller = EXCLUDED.is_best_seller,
  is_featured = EXCLUDED.is_featured,
  is_new = EXCLUDED.is_new,
  tags = EXCLUDED.tags,
  goals = EXCLUDED.goals,
  dietary = EXCLUDED.dietary,
  nutrition_facts = EXCLUDED.nutrition_facts,
  how_to_use = EXCLUDED.how_to_use,
  who_is_it_for = EXCLUDED.who_is_it_for,
  when_to_use = EXCLUDED.when_to_use,
  what_goal_does_it_support = EXCLUDED.what_goal_does_it_support;

-- ==============================================================================
-- HOW TO MAKE A USER AN ADMIN:
-- 1. Sign up on the website with your email (e.g. admin@workoutnutrition.com)
-- 2. Run this SQL query with your email:
--    UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email@example.com';
-- ==============================================================================
