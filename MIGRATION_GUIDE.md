# Migrating teganbrace.com from Squarespace to GitHub Pages

Total work time: **about an hour**, spread across 1–2 days while DNS propagates.
Total cost going forward: **~$12/year** (just the domain renewal).
Squarespace today: ~$192–276/year. Annual savings: **$180+**.

---

## Quick overview

1. Export your images from Squarespace.
2. Create a GitHub repo and upload the site files.
3. Turn on GitHub Pages.
4. Point your domain at GitHub Pages.
5. Verify everything works.
6. Cancel your Squarespace subscription.

Steps 1–3 you can do in any order. Step 4 is where the live switchover happens — until then, teganbrace.com keeps showing your Squarespace site.

---

## Step 1 — Export your images from Squarespace

You want the **original full-resolution files**, not what's shown on the live site.

1. Log in to Squarespace.
2. Go to **Pages** in the left sidebar.
3. For each page (Sculpture/Installation, Drawings/Prints, Performance):
   - Click into the gallery.
   - Click each image, then click **Download** (or right-click → Save Image As) to get the original.
   - Save them into the matching folder on your computer: `images/sculpture/`, `images/drawings/`, or `images/performance/`.
4. Also grab a few favorite images for the homepage slideshow → save into `images/home/`.
5. Save a headshot for the about page as `images/about/portrait.jpg`.

**Faster method (if you have a lot of images):** Squarespace's image library is accessible via **Settings → Advanced → Import / Export Content** which produces a `.xml` file with image URLs. Or in **Design → Custom CSS → Manage Custom Files**, you can see all uploaded media. Right-click each one and save.

**If that's too tedious**, the cheaper-effort path is to right-click each image on your live Squarespace site and "Save Image As" — you'll get medium-resolution versions that are still fine for web display.

### Adding the images to the site

Once images are in the right folders, edit each gallery page (e.g. `sculpture-installation/index.html`), find the `IMAGES = [ ... ]` array near the bottom, and add filenames:

```js
const IMAGES = [
  "soft-trap.jpg",
  "supersensitive.jpg",
  { file: "perspiration-glitz.jpg", caption: "Perspiration Glitz, 2016" },
];
```

Same idea for the homepage `FEATURED` array in `index.html`.

---

## Step 2 — Create the GitHub repo

1. Go to [github.com/new](https://github.com/new) (you're already logged in).
2. **Repository name:** `teganbrace.github.io` (this exact format makes setup easiest — GitHub treats it as your "user site" and serves it at the root).
   - Alternatively, you can use any name like `portfolio` — works the same, just slightly different URL pattern.
3. **Visibility:** Public. (GitHub Pages requires public repos on the free plan.)
4. **Don't** check "Add a README" — your local folder already has one.
5. Click **Create repository**.

### Upload the site files

GitHub gives you a few ways to do this. Easiest if you've never used Git:

**Option A — Web upload (no command line):**

1. On your new empty repo page, click **uploading an existing file** in the quick-setup section.
2. Drag the **contents** of the `teganbrace-site/` folder onto the page (everything inside it, not the folder itself).
3. Scroll down, write a commit message like "Initial site," click **Commit changes**.

**Option B — Command line (if you're comfortable):**

```bash
cd path/to/teganbrace-site
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/teganbrace.github.io.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## Step 3 — Turn on GitHub Pages

1. In your repo, click **Settings** (top nav, far right).
2. In the left sidebar, click **Pages**.
3. Under **Build and deployment → Source**, select **Deploy from a branch**.
4. Under **Branch**, pick `main` and `/ (root)`. Click **Save**.
5. Wait 30–60 seconds. Refresh the page.

You should see a green banner: "Your site is live at `https://YOUR_USERNAME.github.io/`"

**Click it and verify the site loads.** This is the temporary URL — your custom domain comes next.

If something looks broken (no images, etc.), that's expected if you haven't added images yet. The structure should still work.

---

## Step 4 — Point teganbrace.com at GitHub Pages

This is the part with the most variables. You have two paths:

### Path A (recommended) — Transfer the domain off Squarespace

Cheaper long-term. teganbrace.com costs ~$20+/year at Squarespace; ~$10–12/year elsewhere.

**Best registrar for cost: Cloudflare Registrar** (at-cost pricing, no markup, free WHOIS privacy, but only supports certain TLDs — `.com` is supported).
**Best registrar for simplicity: Porkbun** ($10–12/year, very straightforward dashboard).

**Domain transfer process:**

1. Log in to Squarespace → **Settings → Domains → teganbrace.com**.
2. Find **Domain Lock** and turn it **off** (unlock the domain).
3. Find **Transfer Authorization Code** (sometimes called EPP code or auth code) and copy it.
4. Go to your new registrar (Cloudflare or Porkbun) → start a domain transfer for teganbrace.com → paste the auth code.
5. Pay for one year (this also extends your domain by a year).
6. Approve any confirmation emails from both Squarespace and the new registrar.
7. Wait 5–7 days for the transfer to complete.

**During the transfer**, your site keeps working — DNS doesn't change until you change it manually after.

After the transfer completes, set up the DNS records as described in **DNS setup** below.

### Path B — Keep the domain at Squarespace, just stop paying for the site

Easier short-term, slightly worse long-term (you still pay Squarespace for the domain).

1. Log in to Squarespace → **Settings → Domains → teganbrace.com**.
2. Find **DNS Settings** (sometimes under **Advanced**).
3. **Remove all existing A and CNAME records** for the apex (`@`) and `www`.
4. Add the records from **DNS setup** below.

You can do this immediately — no transfer wait time. Then once everything works, cancel the **website plan** but keep the **domain registration** (those are separate billings).

---

### DNS setup (for either path)

These are the records you need to add at whichever registrar holds teganbrace.com:

**Apex domain (`@` or blank) — A records:**

| Type | Name | Value           | TTL  |
|------|------|-----------------|------|
| A    | @    | 185.199.108.153 | Auto |
| A    | @    | 185.199.109.153 | Auto |
| A    | @    | 185.199.110.153 | Auto |
| A    | @    | 185.199.111.153 | Auto |

**Apex — AAAA records (IPv6):**

| Type | Name | Value                       | TTL  |
|------|------|-----------------------------|------|
| AAAA | @    | 2606:50c0:8000::153         | Auto |
| AAAA | @    | 2606:50c0:8001::153         | Auto |
| AAAA | @    | 2606:50c0:8002::153         | Auto |
| AAAA | @    | 2606:50c0:8003::153         | Auto |

**www subdomain — CNAME:**

| Type  | Name | Value                       | TTL  |
|-------|------|-----------------------------|------|
| CNAME | www  | YOUR_USERNAME.github.io     | Auto |

Replace `YOUR_USERNAME` with your actual GitHub username (e.g. `teganbrace.github.io`).

**Remove any other A/CNAME records** for `@` and `www` — old Squarespace records will conflict.

### Tell GitHub about the custom domain

Once DNS is configured:

1. Back in your repo: **Settings → Pages**.
2. Under **Custom domain**, type `teganbrace.com` and click **Save**.
3. GitHub will verify DNS (can take a few minutes to a few hours).
4. Once verified, check the **Enforce HTTPS** box. This gives you free SSL.

DNS propagation takes anywhere from 5 minutes to 48 hours, but usually under an hour.

---

## Step 5 — Verify

After DNS propagates:

1. Open an **incognito/private** browser window (avoids cached DNS).
2. Visit `https://teganbrace.com` — should show your new site.
3. Visit `https://www.teganbrace.com` — should redirect to the apex.
4. Check each page: home, sculpture, drawings/prints, performance, about.
5. Try the lightbox: click any gallery image, navigate with arrow keys, close with Escape.
6. Check on mobile.

**Common gotchas:**
- *Site loads but no HTTPS:* Wait 15–30 more minutes; GitHub's SSL provisioning takes time after DNS verifies. Then re-check "Enforce HTTPS."
- *404 on subpages:* Make sure each gallery page is inside its own folder (`sculpture-installation/index.html`, not `sculpture-installation.html`). Re-upload if needed.
- *Old Squarespace site still showing:* Your DNS hasn't propagated yet, or your browser is cached. Try incognito, or `dig teganbrace.com` from a terminal to confirm the new IPs.

---

## Step 6 — Cancel Squarespace

Only after you've confirmed the new site is fully working at teganbrace.com:

1. Squarespace → **Settings → Billing & Account → Billing**.
2. Cancel the **website subscription**.
3. (If you transferred the domain) confirm the domain no longer shows as billed.
4. (If you kept the domain at Squarespace) keep that line item; cancel only the site plan.

Save any content you might want later before canceling — Squarespace gives you a grace period but won't keep data forever.

---

## Ongoing — How updates work

To change anything later:

**For tiny changes (text, swap an image filename):**
1. Go to the file on github.com.
2. Click the pencil icon (top right of the file view).
3. Edit, scroll down, **Commit changes**.
4. Site updates in about a minute.

**For new images:**
1. Click into the right `/images/...` folder on github.com.
2. **Add file → Upload files**. Drag in your images. Commit.
3. Open the gallery page, click pencil, add the filenames to the `IMAGES` array. Commit.
4. Done.

**For bigger changes:** clone the repo to your computer, use a text editor, push changes back.

---

## Cost summary

| Item                    | Before (Squarespace) | After (GitHub Pages) |
|-------------------------|----------------------|-----------------------|
| Website hosting         | $16–23/mo            | Free                  |
| Domain renewal          | $20–25/yr            | ~$10–12/yr            |
| SSL certificate         | Included             | Free                  |
| **Total annual**        | **~$192–276/yr**     | **~$10–12/yr**        |

---

## When you want to do more later

A few things you have access to now that you didn't before:

- **Version history:** every change is tracked. Roll back a bad edit instantly.
- **Branches:** try a redesign on a branch without affecting the live site.
- **Jekyll:** GitHub Pages can auto-generate pages from Markdown if you ever want a news/exhibitions/blog section. Just delete the `.nojekyll` file and start writing `.md` files. (Don't do this until you want it — `.nojekyll` keeps the build simple right now.)
- **GitHub Actions:** automate image resizing on upload, etc.
- **Custom 404 page:** already included as `404.html`. Edit it if you want.
- **Analytics:** install [Plausible](https://plausible.io) or [GoatCounter](https://goatcounter.com) — both are privacy-respecting and have free tiers. Add a one-line `<script>` tag to each HTML file.

Any of these I can walk you through later.
