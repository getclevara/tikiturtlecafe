-- ═══════════════════════════════════════════════════════════
-- TIKI TURTLE CAFE — Tour Bus Pre-Orders
-- Run this ONCE in the Supabase SQL Editor (same project as Kitchen Ops).
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS tour_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_date DATE NOT NULL,           -- the Tuesday this order is for
  rider_name   TEXT NOT NULL,
  items        JSONB DEFAULT '[]',      -- [{name, price, qty}, ...]
  subtotal     NUMERIC(8,2) DEFAULT 0,
  get_tax      NUMERIC(8,2) DEFAULT 0,
  total        NUMERIC(8,2) DEFAULT 0,
  is_driver    BOOLEAN DEFAULT false,  -- driver's meal is comped ($0) but still made
  notes        TEXT DEFAULT '',
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- Safe to re-run if the table already existed before is_driver was added:
ALTER TABLE tour_orders ADD COLUMN IF NOT EXISTS is_driver BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS tour_orders_service_date_idx ON tour_orders (service_date);

-- RLS: anon access (the summary page is gated by the same staff PIN at the app level)
ALTER TABLE tour_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_tour_orders" ON tour_orders FOR ALL USING (true) WITH CHECK (true);
