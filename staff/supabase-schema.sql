-- ═══════════════════════════════════════════════════════════
-- TIKI TURTLE CAFE — Kitchen Ops Schema
-- Run this in Supabase SQL Editor to set up all tables
-- ═══════════════════════════════════════════════════════════

-- Master order items (seeded from MASTER_ITEMS)
CREATE TABLE IF NOT EXISTS kitchen_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  unit TEXT DEFAULT 'EA',
  pack_size TEXT DEFAULT '',
  category TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true
);

-- Weekly orders (shared — everyone edits the same week's row)
CREATE TABLE IF NOT EXISTS kitchen_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  week_of DATE NOT NULL UNIQUE,
  special_week TEXT DEFAULT 'week2',
  quantities JSONB DEFAULT '{}',
  custom_items JSONB DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Sales weeks (uploaded from Clover CSVs)
CREATE TABLE IF NOT EXISTS kitchen_sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  week_label TEXT NOT NULL UNIQUE,
  date_range TEXT,
  gross INTEGER DEFAULT 0,
  net INTEGER DEFAULT 0,
  items JSONB DEFAULT '[]',
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: anon access (PIN handles app-level auth)
ALTER TABLE kitchen_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE kitchen_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE kitchen_sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_kitchen_items" ON kitchen_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_kitchen_orders" ON kitchen_orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_kitchen_sales" ON kitchen_sales FOR ALL USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════
-- SEED: Master Items (~90 items)
-- ═══════════════════════════════════════════════════════════

INSERT INTO kitchen_items (name, unit, pack_size, category, sort_order) VALUES
  -- PRODUCE
  ('Cabbage, Green (head)', 'LB', '', 'Produce', 1),
  ('Cabbage, Red', 'EA', '', 'Produce', 2),
  ('Carrots, Jumbo 5#', 'BG', '', 'Produce', 3),
  ('Cucumber', 'LB', '', 'Produce', 4),
  ('Tomatoes, Loose', 'CS', '25# case', 'Produce', 5),
  ('Onion, Red', 'LB', '', 'Produce', 6),
  ('Onion, Yellow', 'BG', '25# bag', 'Produce', 7),
  ('Sprouts, Clover', 'BG', '2.5# bag', 'Produce', 8),
  ('Bell Pepper, Green', 'LB', '', 'Produce', 9),
  ('Bell Pepper, Yellow', 'LB', '', 'Produce', 10),
  ('Bell Pepper, Red', 'LB', '', 'Produce', 11),
  ('Peeled Garlic', 'BG', '', 'Produce', 12),
  ('Fresh Apples', 'BG', '', 'Produce', 13),
  ('Bananas', 'BG', '', 'Produce', 14),
  ('Pineapple', 'EA', '', 'Produce', 15),
  ('Celery', 'EA', '', 'Produce', 16),
  ('Lettuce, Green Leaf', 'EA', '', 'Produce', 17),
  ('Lemons', 'EA', '', 'Produce', 18),
  ('Limes', 'EA', '', 'Produce', 19),
  ('Cilantro', 'BN', '', 'Produce', 20),
  ('Jalapeño', 'LB', '', 'Produce', 21),
  -- MEAT / PROTEIN
  ('Boneless Shoulder Pork', 'CS', '~60# case', 'Meat', 1),
  ('Chicken Thighs (bone-in tray)', 'CS', '~55 LB', 'Meat', 2),
  ('BNLS/SKNLS Chicken Thighs', 'CS', '4/10 LB', 'Meat', 3),
  ('Applewood Bacon', 'CS', '1/15 LB', 'Meat', 4),
  ('Ground Beef', 'LB', '', 'Meat', 5),
  ('Hot Dogs', 'EA', '', 'Meat', 6),
  ('Spam', 'EA', '', 'Meat', 7),
  ('Canned Chicken', 'CS', '', 'Meat', 8),
  ('Ham (deli)', 'LB', '', 'Meat', 9),
  ('Turkey (deli)', 'LB', '', 'Meat', 10),
  -- SEAFOOD
  ('Chunk Light Tuna Pouch', 'CS', '6/43 OZ', 'Seafood', 1),
  ('Albacore Tuna', 'EA', '', 'Seafood', 2),
  ('Mahi Portion 2-4oz', 'CS', '1/10#', 'Seafood', 3),
  -- BREAD / WRAPS
  ('Japan White Bread', 'EA', '', 'Bread', 1),
  ('Japan Wheat Bread', 'EA', '', 'Bread', 2),
  ('Spinach Herb Wraps', 'CS', '6/12 CT', 'Bread', 3),
  ('Sourdough Bread', 'EA', '', 'Bread', 4),
  ('Sweet Bread', 'EA', '', 'Bread', 5),
  ('Hot Dog Buns', 'CS', '', 'Bread', 6),
  -- DAIRY / COLD
  ('Swiss Cheese (sliced)', 'EA', '', 'Dairy', 1),
  ('Mayonnaise', 'EA', '', 'Dairy', 2),
  ('Almond Milk (unsweetened)', 'CS', '', 'Dairy', 3),
  ('Buttermilk', 'EA', '', 'Dairy', 4),
  ('Sour Cream', 'EA', '', 'Dairy', 5),
  -- CONDIMENTS / SAUCES
  ('Basil Pesto (Kirkland)', 'EA', '', 'Condiments', 1),
  ('Italian Dressing', 'EA', '', 'Condiments', 2),
  ('Dijon Mustard', 'EA', '', 'Condiments', 3),
  ('Apple Cider Vinegar', 'EA', '', 'Condiments', 4),
  ('Soy Sauce', 'EA', '', 'Condiments', 5),
  ('Honey', 'EA', '', 'Condiments', 6),
  ('Artichoke Hearts', 'EA', '', 'Condiments', 7),
  ('Sundried Tomatoes', 'EA', '', 'Condiments', 8),
  ('Condiment Picnic Pack', 'EA', '', 'Condiments', 9),
  -- DRY GOODS
  ('Canned Pinto Beans', 'EA', '', 'Dry Goods', 1),
  ('Pecan Halves', 'EA', '', 'Dry Goods', 2),
  ('Mac Nuts', 'EA', '', 'Dry Goods', 3),
  ('Sushi Rice', 'LB', '', 'Dry Goods', 4),
  ('Nori Sheets', 'PK', '', 'Dry Goods', 5),
  ('Rotini Pasta', 'EA', '', 'Dry Goods', 6),
  ('Sourdough Croutons', 'EA', '', 'Dry Goods', 7),
  ('Olives, Sliced', 'EA', '', 'Dry Goods', 8),
  -- FROZEN
  ('Mango, Frozen', 'BG', '', 'Frozen', 1),
  ('Pineapple, Frozen', 'BG', '', 'Frozen', 2),
  ('Strawberries, Frozen', 'BG', '', 'Frozen', 3),
  -- SNACKS / CHIPS
  ('Variety Pack Chips 54ct', 'EA', '', 'Snacks', 1),
  ('Hawaiian Brand Chips (box)', 'EA', '', 'Snacks', 2),
  -- BEVERAGES
  ('Orange Juice, Gallon', 'EA', '', 'Beverages', 1),
  ('Mango Nectar', 'EA', '', 'Beverages', 2),
  -- DOLE / SOFT SERVE
  ('PINEAPPLE Dole Soft Serve', 'CS', '4/4.4#', 'Dole', 1),
  ('VANILLA Frostline', 'CS', '6/6#', 'Dole', 2),
  ('STRAWBERRY Dole', 'CS', '4/4.4#', 'Dole', 3),
  ('MANGO Dole', 'CS', '4/4.5#', 'Dole', 4),
  ('CHOCOLATE Frostline', 'CS', '6/6#', 'Dole', 5),
  ('WATERMELON Dole', 'CS', '4/4#', 'Dole', 6),
  ('ORANGE Dole', 'CS', '4/4#', 'Dole', 7),
  ('PEACH Dole', 'CS', '4/4#', 'Dole', 8),
  ('CHERRY Dole', 'CS', '4/4#', 'Dole', 9),
  ('Honeydew Powder', 'CS', '10/2.2#', 'Dole', 10),
  -- CONTAINERS
  ('8" White 3-Comp Container', 'CS', '150/CS', 'Containers', 1),
  ('8x8" Clear Container', 'CS', '2/125', 'Containers', 2),
  ('9x6" White Hoagie Container', 'CS', '4/50', 'Containers', 3),
  ('5x5" Clear Container', 'CS', '4/125', 'Containers', 4),
  -- CUPS / CONES
  ('6" Waffle Cone', 'CS', '12/18', 'Cups/Cones', 1),
  ('9oz Cup', 'CS', '20/50', 'Cups/Cones', 2),
  ('Dome Lid 9oz', 'CS', '', 'Cups/Cones', 3),
  ('16oz Cup', 'CS', '20/50', 'Cups/Cones', 4),
  ('Flat Lid 12-24oz', 'CS', '', 'Cups/Cones', 5),
  ('2oz Portion Cup', 'CS', '', 'Cups/Cones', 6),
  ('Portion Cup Lid', 'CS', '', 'Cups/Cones', 7),
  ('Cup Jacket Kraft', 'CS', '40/2', 'Cups/Cones', 8),
  -- PAPER / UTENSILS / SUPPLIES
  ('7" White Forks', 'CS', '10/100', 'Supplies', 1),
  ('6" White Spoons', 'CS', '10/100', 'Supplies', 2),
  ('3.5" Wooden Spoon 100pk', 'EA', '', 'Supplies', 3),
  ('Napkins 2-PLY Interfold', 'CS', '24/250', 'Supplies', 4),
  ('Food Tray 1/4#', 'CS', '4/250', 'Supplies', 5),
  ('Gloves Nitrile BLK XL', 'CS', '1000ct', 'Supplies', 6),
  ('Gloves Nitrile BLK LG', 'CS', '1000ct', 'Supplies', 7),
  ('Gloves Medium', 'CS', '', 'Supplies', 8),
  ('Plastic Wrap', 'EA', '', 'Supplies', 9),
  ('Aluminum Foil', 'EA', '', 'Supplies', 10)
ON CONFLICT (name) DO NOTHING;

-- Saved order templates (e.g. "Week 1 Standard", "Week 2 Standard")
CREATE TABLE IF NOT EXISTS kitchen_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  special_week TEXT DEFAULT 'week1',
  quantities JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE kitchen_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_kitchen_templates" ON kitchen_templates FOR ALL USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════
-- SEED: Initial Sales Data (11 weeks)
-- ═══════════════════════════════════════════════════════════

INSERT INTO kitchen_sales (week_label, gross, net, items) VALUES
  ('Jan 05', 3929, 3727, '[]'),
  ('Jan 12', 4054, 3848, '[]'),
  ('Jan 26', 4626, 4396, '[]'),
  ('Feb 02', 4771, 4571, '[]'),
  ('Feb 09', 4576, 4364, '[]'),
  ('Feb 16', 3232, 3075, '[]'),
  ('Mar 02', 4528, 4318, '[]'),
  ('Mar 09', 5733, 5454, '[]'),
  ('Mar 16', 4950, 4709, '[]'),
  ('Mar 23', 3685, 3494, '[]'),
  ('Apr 05', 4296, 4095, '[]')
ON CONFLICT (week_label) DO NOTHING;
