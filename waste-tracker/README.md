# Tiki Turtle Cafe - Food Waste Tracker

Simple admin tool to track kitchen waste weekly.

## Setup Instructions

### 1. Supabase Database Setup

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy/paste the entire contents of `supabase-schema.sql`
5. Click **Run** (or press Cmd+Enter)

This creates:
- `preset_items` table (your kitchen inventory)
- `waste_entries` table (logged waste)
- Row-level security policies
- Pre-populated kitchen items

### 2. Configure the App

1. Open `waste-tracker.html` in a text editor
2. Find these lines near the top of the `<script>` section:

```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
const ACCESS_PIN = '9901';  // Staff PIN to access
```

3. Replace with your actual values from:
   - Supabase Dashboard > Settings > API
   - Copy "Project URL" → paste as SUPABASE_URL
   - Copy "anon public" key → paste as SUPABASE_ANON_KEY
4. Change the PIN if you want a different code

### 3. Deploy

**Option A: Add to your existing site**
- Upload `waste-tracker.html` to your hosting
- Access at `tikiturtlehi.com/admin/waste-tracker.html` (or similar)

**Option B: Deploy to Vercel (standalone)**
1. Create a folder with just `index.html` (rename waste-tracker.html)
2. Run `vercel` in that folder
3. Get a URL like `tiki-waste.vercel.app`

## How It Works

### Logging Waste
1. Staff enters PIN (9901) to access
2. Tap a preset item (or type custom)
3. Enter quantity, waste type, optional reason/notes
4. Submit

### Reviewing & Exporting
1. Click "This Week" tab
2. See all entries + estimated cost summary
3. Navigate to previous weeks
4. Click "Export CSV" for Excel-compatible report

## Customizing Presets

To add/edit kitchen items:

1. Go to Supabase > Table Editor > `preset_items`
2. Add rows or edit existing ones
3. Fields:
   - `name`: Item name
   - `category`: protein, produce, dairy, dry_goods, prepared, other
   - `default_unit`: lbs, portions, each, etc.
   - `estimated_unit_cost`: Cost per unit (for loss calculations)
   - `active`: true/false (false = hidden from list)

## Estimated Costs

The app auto-calculates estimated waste cost:
- `quantity × estimated_unit_cost` from preset items
- Custom items show $0 (no cost data)

This gives you a rough weekly/monthly waste dollar figure.

## Weekly Reports

The "Export CSV" button downloads a spreadsheet with:
- Date, Item, Type, Quantity, Unit, Est. Cost, Reason, Notes, Logged By

Open in Excel or Google Sheets for analysis.
