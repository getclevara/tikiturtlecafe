# Tiki Turtle Cafe Website

## Files Included
- `index.html` - The complete website
- `tiki-logo.png` - Tiki Turtle Cafe logo
- `arc-logo.png` - The Arc of Hilo logo

## Deploying to GitHub + Vercel

### Step 1: Create GitHub Repository
1. Go to github.com and sign in
2. Click the "+" button in the top right, select "New repository"
3. Name it something like `tiki-turtle-cafe` or `tikiturtlehi`
4. Keep it Public
5. Click "Create repository"

### Step 2: Upload Files
1. On your new repo page, click "uploading an existing file"
2. Drag all 3 files (index.html, tiki-logo.png, arc-logo.png) into the upload area
3. Click "Commit changes"

### Step 3: Connect to Vercel
1. Go to vercel.com and sign in with your GitHub account
2. Click "Add New Project"
3. Find and select your tiki-turtle-cafe repository
4. Click "Deploy"
5. Wait about 1 minute for deployment
6. Your site is live! Vercel will give you a URL like `tiki-turtle-cafe.vercel.app`

### Step 4: Connect Custom Domain (tikiturtlehi.com)
1. In Vercel, go to your project settings
2. Click "Domains"
3. Add `tikiturtlehi.com` and `www.tikiturtlehi.com`
4. Follow Vercel's instructions to update your domain's DNS settings

---

## How to Update Weekly Specials

### Quick Method (Edit on GitHub)
1. Go to your GitHub repository
2. Click on `index.html`
3. Click the pencil icon to edit
4. Find this section (search for "This Week's Special"):

```html
<div class="menu-item" style="background: linear-gradient(135deg, #fff9e6 0%, #fff 100%); border: 2px solid #ff9f43;">
    <div class="menu-item-header"><h3>🌟 This Week's Special</h3><span class="price">Ask Us!</span></div>
    <p>Our weekly special changes every week! Ask our team what delicious creation Chef Angelina has prepared this week.</p>
</div>
```

5. Change the text to your new special, for example:
```html
<div class="menu-item" style="background: linear-gradient(135deg, #fff9e6 0%, #fff 100%); border: 2px solid #ff9f43;">
    <div class="menu-item-header"><h3>🌟 Kalua Pork Plate</h3><span class="price">$13.00</span></div>
    <p>Slow-roasted kalua pork with rice and macaroni salad. Available this week only!</p>
</div>
```

6. Click "Commit changes"
7. Vercel will automatically update your live site in about 1 minute!

---

## How to Update Team Member Stories

Find the `teamData` section in the JavaScript (near the bottom of index.html). Each team member has:
- `initials` - Shows in the avatar circle
- `name` - Full name
- `role` - Their role/title
- `story` - Their story (use `<p>` tags for paragraphs)

---

## How to Update Prices

Search for the item name in index.html and change the price in the `<span class="price">` tag.

---

## Need Help?

Contact your web developer or reach out to The Arc of Hilo tech support.
