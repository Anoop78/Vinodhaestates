# Vinodha Estates — Website

**Built by Anvexa Technology**

## Folder Structure

```
vinodha-estates/
├── index.html          ← Main website (all sections)
├── styles.css          ← All styles (single file, no duplication)
├── script.js           ← All JS (no backend, WhatsApp forms)
├── assets/             ← Put all your images & video here
│   ├── Angular blue logo design.png   ← Logo
│   ├── video1.mp4                     ← Hero background video
│   ├── primelocation1.png             ← Why Gwalior images (1–6)
│   ├── primelocation2.png
│   ├── primelocation3.png
│   ├── primelocation4.png
│   ├── primelocation5.png
│   ├── primelocation6.jpeg
│   ├── plot1.jpg                      ← Plot cards (1–8)
│   ├── plot2.jpg
│   ├── plot3.jpg
│   ├── plot4.jpg
│   ├── plot5.jpg
│   ├── plot6.jpg
│   ├── plot7.jpg
│   ├── plot8.jpg
│   ├── property1.jpg                  ← Gallery slides (1–4)
│   ├── property2.jpg
│   ├── property3.jpg
│   ├── property4.jpg
│   ├── aboutvinodha.png               ← Founder/About image
│   ├── ourchannalpatners.png          ← Channel partners image
│   ├── image1.png / image2.jpeg       ← Testimonial posters
│   ├── image4.png
│   ├── vinodhaestate_sample.mp4       ← Testimonial videos
│   ├── blog1.png / blog2.png / blog3.png
│   └── vinodha-icon.svg               ← Favicon
└── README.md
```

## Sections (in order)
1. Header / Navbar
2. Hero (video background)
3. Why Gwalior — Pillars + Trust Ribbon
4. Our Services (9 cards including Consultancy form)
5. Projects Gallery — 8 Plot Cards with WhatsApp enquiry
6. Gallery Slider with lightbox
7. Channel Partners + Partner Enquiry Form
8. About / Founder
9. Client Testimonials (3 cards)
10. CTA Banner
11. Contact Form → WhatsApp
12. Blog (3 cards, Coming Soon)
13. Stats (500+ Families, 120+ Deals, 50+ Cr)
14. Footer

## How to Run Locally
Just open `index.html` in any browser — no server needed.

```
Right-click index.html → Open with Chrome / Firefox
```

Or use VS Code Live Server extension.

## Deploy on Render / Hostinger / Vercel
Since this is a pure static site (HTML + CSS + JS):

### Render (Free Static Site)
1. Push this folder to a GitHub repo
2. Go to render.com → New → Static Site
3. Connect your repo, set Publish Directory to `/` (root)
4. Deploy — done!

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` inside this folder
3. Follow prompts

### Hostinger
1. Zip the entire `vinodha-estates` folder
2. Upload to `public_html` via File Manager
3. Done!

## Add Google Analytics
Uncomment the GA block in `index.html` and replace `G-XXXXXXXXXX` with your ID.

## Add Google Search Console
Uncomment and add your verification meta tag in `index.html`.

## WhatsApp Number
All forms send to: **+91 7974741166**
To change, search `917974741166` in `index.html` and `script.js`.

---
Made with ♥ by Anvexa Technology | anvexatechnology.com
