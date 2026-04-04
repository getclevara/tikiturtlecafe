-- Tiki Turtle Cafe Food Waste Tracker
-- Run this in your Supabase SQL Editor

-- Preset items (your kitchen inventory)
CREATE TABLE preset_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  default_unit TEXT DEFAULT 'lbs',
  estimated_unit_cost DECIMAL(10,2) DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Waste log entries
CREATE TABLE waste_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  item_name TEXT NOT NULL,
  preset_item_id UUID REFERENCES preset_items(id),
  waste_type TEXT NOT NULL CHECK (waste_type IN ('raw_unused', 'prep_waste', 'cooked_unsold', 'expired', 'damaged')),
  quantity DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'lbs',
  estimated_cost DECIMAL(10,2) DEFAULT 0,
  reason TEXT,
  notes TEXT,
  logged_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast weekly queries
CREATE INDEX idx_waste_entries_date ON waste_entries(entry_date DESC);

-- Enable Row Level Security
ALTER TABLE preset_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE waste_entries ENABLE ROW LEVEL SECURITY;

-- Policies (allow access with anon key - app uses PIN protection)
CREATE POLICY "Allow read preset_items" ON preset_items
  FOR SELECT USING (true);

CREATE POLICY "Allow all on waste_entries" ON waste_entries
  FOR ALL USING (true) WITH CHECK (true);


-- =====================================================
-- TIKI TURTLE KITCHEN INVENTORY
-- =====================================================

-- 1. RAW PROTEINS (what you buy/store raw)
INSERT INTO preset_items (name, category, sort_order, default_unit, estimated_unit_cost) VALUES
  ('Pork Shoulder', 'raw_protein', 1, 'lbs', 4.00),
  ('Boneless Chicken', 'raw_protein', 2, 'lbs', 4.50),
  ('Ground Beef', 'raw_protein', 3, 'lbs', 6.00),
  ('Chuck Roast', 'raw_protein', 4, 'lbs', 7.00),
  ('Bacon', 'raw_protein', 5, 'lbs', 7.00),
  ('Hot Dog', 'raw_protein', 6, 'each', 0.75),
  ('Spam', 'raw_protein', 7, 'cans', 3.50);

-- 2. COOKED PROTEINS (prepped and ready)
INSERT INTO preset_items (name, category, sort_order, default_unit, estimated_unit_cost) VALUES
  ('Pulled Pork (Kalua)', 'cooked_protein', 1, 'lbs', 9.00),
  ('Roast Pork', 'cooked_protein', 2, 'lbs', 9.00),
  ('Shoyu Chicken', 'cooked_protein', 3, 'lbs', 8.00),
  ('Hurricane Chicken', 'cooked_protein', 4, 'lbs', 8.00),
  ('Chicken Mac Nut Pesto', 'cooked_protein', 5, 'lbs', 10.00),
  ('Chicken Bacon Ranch', 'cooked_protein', 6, 'lbs', 10.00),
  ('Mahi Katsu', 'cooked_protein', 7, 'portions', 5.00),
  ('Sweet and Sour Pork', 'cooked_protein', 8, 'lbs', 9.00),
  ('Beef Taco Meat', 'cooked_protein', 9, 'lbs', 8.00),
  ('Chicken Taco Meat', 'cooked_protein', 10, 'lbs', 7.00),
  ('Carnitas Taco Meat', 'cooked_protein', 11, 'lbs', 9.00);

-- 3. PRODUCE
INSERT INTO preset_items (name, category, sort_order, default_unit, estimated_unit_cost) VALUES
  ('Lettuce', 'produce', 1, 'heads', 2.50),
  ('Tomato', 'produce', 2, 'lbs', 3.00),
  ('Sprouts', 'produce', 3, 'lbs', 6.00),
  ('Cabbage (Red)', 'produce', 4, 'heads', 2.00),
  ('Cabbage (Green)', 'produce', 5, 'heads', 2.00),
  ('Carrots', 'produce', 6, 'lbs', 1.75),
  ('Cucumber', 'produce', 7, 'lbs', 2.00),
  ('Bell Pepper (Yellow)', 'produce', 8, 'each', 1.50),
  ('Bell Pepper (Red)', 'produce', 9, 'each', 1.50),
  ('Bell Pepper (Green)', 'produce', 10, 'each', 1.00),
  ('Pineapple', 'produce', 11, 'each', 5.00);

-- 4. PREPARED SIDES
INSERT INTO preset_items (name, category, sort_order, default_unit, estimated_unit_cost) VALUES
  ('White Rice', 'prepared_side', 1, 'lbs', 1.00),
  ('Spanish Rice', 'prepared_side', 2, 'lbs', 1.50),
  ('Beans', 'prepared_side', 3, 'lbs', 1.25),
  ('Mac Salad', 'prepared_side', 4, 'lbs', 3.00),
  ('Pasta Salad', 'prepared_side', 5, 'lbs', 3.50),
  ('Cole Slaw', 'prepared_side', 6, 'lbs', 2.50),
  ('Spam Musubi', 'prepared_side', 7, 'each', 2.50);

-- 5. DOLE WHIP MIXES
INSERT INTO preset_items (name, category, sort_order, default_unit, estimated_unit_cost) VALUES
  ('Dole Mix - Pineapple', 'dole_mix', 1, 'lbs', 8.00),
  ('Dole Mix - Vanilla', 'dole_mix', 2, 'lbs', 8.00),
  ('Dole Mix - Watermelon', 'dole_mix', 3, 'lbs', 8.00),
  ('Dole Mix - Cherry', 'dole_mix', 4, 'lbs', 8.00),
  ('Dole Mix - Melona', 'dole_mix', 5, 'lbs', 8.00),
  ('Dole Mix - Peach', 'dole_mix', 6, 'lbs', 8.00),
  ('Dole Mix - Mango', 'dole_mix', 7, 'lbs', 8.00);

-- 6. BREADS
INSERT INTO preset_items (name, category, sort_order, default_unit, estimated_unit_cost) VALUES
  ('White Bread', 'bread', 1, 'loaves', 4.00),
  ('Wheat Bread', 'bread', 2, 'loaves', 4.50),
  ('Sweet Bread', 'bread', 3, 'loaves', 5.00),
  ('Sourdough Bread', 'bread', 4, 'loaves', 5.50);

-- 7. CONDIMENTS & SAUCES
INSERT INTO preset_items (name, category, sort_order, default_unit, estimated_unit_cost) VALUES
  ('Pesto', 'condiment', 1, 'cups', 3.00),
  ('Ranch Dressing', 'condiment', 2, 'cups', 1.00),
  ('Onion Dressing', 'condiment', 3, 'cups', 1.00),
  ('Mayo', 'condiment', 4, 'lbs', 4.00),
  ('Salsa', 'condiment', 5, 'cups', 1.50),
  ('Sundried Tomatoes', 'condiment', 6, 'lbs', 12.00),
  ('Orange Juice', 'condiment', 7, 'gallons', 6.00);

-- 8. OTHER (for write-ins)
INSERT INTO preset_items (name, category, sort_order, default_unit, estimated_unit_cost) VALUES
  ('Other (see notes)', 'other', 99, 'each', 0.00);
