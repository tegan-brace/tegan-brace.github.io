# teganbrace.com

Personal portfolio site for Tegan Brace. Plain HTML/CSS/JS — no build step.

## Structure

```
.
├── index.html                       # Home (hero slideshow)
├── sculpture-installation/index.html
├── drawingsprints/index.html
├── performance/index.html
├── about/index.html
├── 404.html
├── CNAME                            # GitHub Pages custom domain
├── .nojekyll                        # Skip Jekyll processing
├── css/style.css
├── js/gallery.js                    # Slideshow + lightbox + menu
└── images/
    ├── home/
    ├── sculpture/
    ├── drawings/
    ├── performance/
    └── about/
```

## Adding images

Each gallery page has an `IMAGES` array near the bottom. Add filenames there.

**Simple — just a filename:**

```js
const IMAGES = [
  "soft-trap.jpg",
  "supersensitive.jpg",
];
```

**With captions:**

```js
const IMAGES = [
  { file: "soft-trap.jpg",      caption: "Soft Trap, 2017" },
  { file: "supersensitive.jpg", caption: "Supersensitive, 2018" },
];
```

Drop the matching image files into the right `/images/...` folder.

## Homepage slideshow

Edit the `FEATURED` array in `index.html`:

```js
const FEATURED = [
  { src: "/images/home/featured-1.jpg", alt: "Description" },
  { src: "/images/home/featured-2.jpg", alt: "Description" },
];
```

## Previewing locally

The site is plain static files. To preview:

```bash
# Python (already installed on Mac)
python3 -m http.server 8000

# then open http://localhost:8000
```

Or just double-click `index.html` to open in a browser (some links will need a server to resolve correctly).

## Editing the bio

Open `about/index.html` and edit the text inside `<div class="about-text">`.

## Image optimization tip

Before uploading large images, resize them to ~2000px on the long edge and use JPEG quality 80–85. Tools: [Squoosh](https://squoosh.app/) (drag-and-drop, browser-based), or `sips` on Mac:

```bash
# Resize all JPGs in a folder to max 2000px and save as quality 82
mkdir -p resized
for f in *.jpg; do
  sips -Z 2000 -s formatOptions 82 "$f" --out "resized/$f"
done
```

This keeps the site fast.
