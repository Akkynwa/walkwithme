---
name: Serene Path
colors:
  surface: '#f7f9ff'
  surface-dim: '#d5dae2'
  surface-bright: '#f7f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4fc'
  surface-container: '#e9eef6'
  surface-container-high: '#e3e9f0'
  surface-container-highest: '#dde3eb'
  on-surface: '#161c22'
  on-surface-variant: '#434844'
  inverse-surface: '#2b3137'
  inverse-on-surface: '#ecf1f9'
  outline: '#737873'
  outline-variant: '#c3c8c2'
  surface-tint: '#506356'
  primary: '#4d6054'
  on-primary: '#ffffff'
  primary-container: '#66796c'
  on-primary-container: '#f6fff6'
  inverse-primary: '#b7ccbc'
  secondary: '#5e5e5b'
  on-secondary: '#ffffff'
  secondary-container: '#e1dfdb'
  on-secondary-container: '#63635f'
  tertiary: '#605b55'
  on-tertiary: '#ffffff'
  tertiary-container: '#79746d'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d2e8d8'
  primary-fixed-dim: '#b7ccbc'
  on-primary-fixed: '#0d1f15'
  on-primary-fixed-variant: '#384b3f'
  secondary-fixed: '#e4e2dd'
  secondary-fixed-dim: '#c8c6c2'
  on-secondary-fixed: '#1b1c19'
  on-secondary-fixed-variant: '#474744'
  tertiary-fixed: '#e9e1d9'
  tertiary-fixed-dim: '#ccc5be'
  on-tertiary-fixed: '#1e1b16'
  on-tertiary-fixed-variant: '#4a4640'
  background: '#f7f9ff'
  on-background: '#161c22'
  surface-variant: '#dde3eb'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md-mobile:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Playfair Display
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 32px
  body-md:
    fontFamily: Playfair Display
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 20px
---

## Brand & Style
The design system is centered on the concept of "Digital Sanctuary." It targets individuals seeking a moment of respite and spiritual alignment in a loud digital world. The emotional response must be one of immediate physiological decompression—lowering the heart rate through visual stillness.

The style is a hybrid of **Minimalism** and **Modern Corporate**, leaning heavily into high-quality whitespace and intentional "quiet zones." It avoids all unnecessary ornamentation, vibration, or high-velocity animations. The interface should feel like a high-end physical journal or a quiet stone garden: stable, permanent, and breathable.

## Colors
The palette is rooted in earth-derived tones to ground the user experience.
- **Primary (Sage Green):** Used for primary actions, progress indicators, and active states. It represents growth and tranquility.
- **Secondary (Warm Cream):** The foundational surface color. It is softer on the eyes than pure white, reducing blue-light strain during evening meditation.
- **Tertiary (Stone):** Used for secondary surfaces, borders, and subtle dividers.
- **Neutral (Slate):** The primary color for legibility. It provides high contrast against the cream background without the harshness of absolute black.

## Typography
This design system utilizes a sophisticated typographic pairing to distinguish between "Content" (Scripture/Reflection) and "Utility" (Navigation/Settings).

- **The Serif (Playfair Display):** Reserved for the heart of the app. It is used for all spiritual text, quotes, and primary headlines. The increased line height in `body-lg` is intentional to facilitate deep, slow reading.
- **The Sans (Plus Jakarta Sans):** Used for functional UI elements, labels, buttons, and metadata. It provides a clean, modern counterpoint that ensures the interface feels contemporary and accessible.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy on desktop to prevent text lines from becoming too long, which hinders meditative reading. On mobile, it uses a single-column fluid layout with generous margins.

- **Rhythm:** A strictly enforced 8px baseline grid ensures vertical harmony.
- **Whitespace:** Spacing is used as a functional element to separate ideas. Do not crowd components; if in doubt, increase padding to the next scale (e.g., move from `md` to `lg`).
- **Breakpoints:** 
  - Mobile: < 600px (1 column, 20px margins)
  - Tablet: 600px - 1024px (Centered column, 600px max reading width)
  - Desktop: > 1024px (Centered content area, 800px max reading width for spiritual text).

## Elevation & Depth
Depth is created through **Tonal Layers** and **Low-contrast outlines** rather than heavy shadows. This maintains a "flat" and humble aesthetic suitable for a spiritual context.

- **Level 0 (Base):** Secondary color (Warm Cream).
- **Level 1 (Cards/Surfaces):** Pure white or a slightly lighter tint of cream with a 1px Stone-colored border at 50% opacity.
- **Level 2 (Active/Floating):** Use an extremely soft, diffused ambient shadow (Blur: 20px, Opacity: 4%, Color: Slate) to indicate an element is interactive or temporarily elevated (like a prayer card).
- **Transitions:** Use slow, "fade-in" transitions (300ms - 500ms) to maintain the sense of calm. Avoid "pop" or "bounce" physics.

## Shapes
The shape language is "Softened Geometry." We use **Rounded (0.5rem)** as the standard to remove the "sharpness" and perceived clinical nature of square corners. 

- **Standard Containers:** 0.5rem (8px).
- **Large Cards/Images:** 1rem (16px).
- **Interactive Inputs:** 0.5rem (8px).
- **Icons:** Use a consistent 2px stroke weight with rounded caps and joins to match the UI's softness.

## Components
- **Buttons:** Primary buttons use the Sage Green background with white text. They should have ample internal padding (16px top/bottom, 32px left/right). Secondary buttons use a Slate border with no fill.
- **Cards:** Used for daily verses or meditation sessions. Cards should never have harsh borders. Use subtle Stone-colored dividers within cards to separate sections.
- **Input Fields:** Use a subtle background fill (Tertiary Stone at 20% opacity) rather than a full border. Focus states are indicated by a 1px Sage Green bottom border.
- **Progress Indicators:** Use thin, elegant lines for progress bars. Avoid chunky loaders; use a slow-pulsing Sage Green dot or a fading circle.
- **Lists:** List items are separated by generous vertical padding (24px) and a single-pixel Stone divider that does not span the full width of the container.
- **The "Breathe" Component:** A unique circular element used for guided breathing, using Sage Green with a soft outer glow that expands and contracts.