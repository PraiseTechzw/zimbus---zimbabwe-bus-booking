# Inter Africa Design System

This document outlines the brand and visual identity of the Inter Africa platform.

## 🎨 Creative Direction

Inter Africa is built with a **Premium, Modern, and Trusted** aesthetic. We focus on:
- **Clarity**: High contrast typography and simple UI paths.
- **Modernity**: Using Glass-morphism, subtle gradients, and rounded corners.
- **Engagement**: Bringing the UI to life with micro-animations and parallax.

## 📝 Typography

- **Primary Font**: `Outfit` (sans-serif)
- **Scale**:
  - `4xl` (36px): Hero headings.
  - `2xl` (24px): Section titles.
  - `lg` (18px): Card headers.
  - `sm` (14px): Body copy.
  - `xs/10px`: Metadata, labels, and tracking-widest text.

Font weights used are primarily `font-black` (900) for headers and `font-bold` (700) or `font-medium` (500) for body text.

---

## 🎨 Color Palette

We use a high-energy orange paired with professional grays.

- **Primary**: `orange-600` (#ea580c) - Primary CTA and Branding.
- **Secondary**: `orange-50` / `orange-100` - Background highlights and accents.
- **Neutral**: `gray-900` (#111827) - Primary text and dark sections.
- **Supportive**: `gray-400` / `gray-500` - Metadata and secondary text.
- **Accent**: `green-600` (#16a34a) - Confirmations and successes.
- **Alert**: `red-600` (#dc2626) - Cancellations and warnings.

---

## ✨ Design Components

### 1. Glass-morphism (`.glass-morphism`)
A cornerstone of our UI, using:
- `bg-white/70`
- `backdrop-blur-xl`
- `border-white/50`
- `shadow-2xl shadow-orange-950/5`

### 2. Rounded Corners
- `rounded-[2rem]` / `rounded-[3rem]`: Main sections and modals.
- `rounded-2xl`: Cards and inputs.
- `rounded-xl`: Buttons and smaller elements.

### 3. Gradients (`.custom-gradient`)
A linear gradient from `orange-500` to `orange-600` is used for primary buttons and high-impact branding.

---

## 🎬 Interactions & Motion

Animations are managed with `motion/react`.

- **Page Transitions**: Views slide from the right (`x: 20 -> 0`) with a fade-in effect.
- **Hover States**:
  - Cards scale up subtly (`scale: 1.02`) and increase shadow depth.
  - Icons and accents shift color to `orange-500`.
- **Parallax**: The Hero image uses a slow scale and position shift (`0.98 -> 1.02`) to create a sense of life on initial load.
