# Desert Rose Gin Landing Page - Design Guidelines

## Design Approach
**Preserve Existing Implementation**: This project has a complete, sophisticated design already coded. The guidelines below document the existing design system to maintain consistency when integrating product images and assets.

## Typography System

**Font Families** (via Google Fonts CDN):
- **Primary/Luxury**: 'Cinzel' (serif) - Used for headlines, logo elements
- **Body/Elegant**: 'Playfair Display' (serif) - Primary body text, descriptions
- **Technical/HUD**: 'Space Mono' (monospace) - Batch numbers, technical details, small labels

**Type Hierarchy**:
- Hero headlines: 5xl to 7xl, font-lux (Cinzel)
- Section titles: 4xl to 6xl, font-lux
- Product names: 5xl to 7xl, font-lux
- Body text: sm to base, Playfair Display, font-light
- Technical labels: xs, font-hud, uppercase, tracking-widest

## Color Palette

**CSS Custom Properties**:
- `--color-sand-light`: #F9F5F0 (lightest backgrounds)
- `--color-sand`: #E8DCCA (warm backgrounds)
- `--color-gold`: #917D37 (primary accent)
- `--color-copper`: #CD7E31 (secondary accent)
- `--color-charcoal`: #050606 (dark backgrounds, text)

**Scene-Specific Backgrounds**:
- Hero: #F5EFE6 (warm sand)
- Classic Product: #E8DCCA (sand)
- Limited Edition Product: #050606 (charcoal - dark mode)
- Cocktails: #F5EFE6
- Journey: #050606 (dark)

## Layout System

**Spacing Philosophy**: Tailwind utilities - generous spacing for luxury feel
- Container padding: px-6
- Section vertical spacing: py-12 to py-24
- Component gaps: gap-4 to gap-8

**Responsive Grid**:
- Mobile: Single column, stacked layouts
- Desktop: 3-column layouts for product scenes (Info 1/3 | Bottle 1/3 | Details 1/3)
- Cocktail cards: grid-cols-1 md:grid-cols-3

## Core Components

### Custom Bottle SVG
- Procedural SVG with gradient fills
- Glass glow filter effects
- Dynamic color prop for product variants
- Integrated label area with "DR" monogram
- Floating animation (6s cycle, -15px vertical movement)

### Scene Transitions
**Scroll-Based Navigation** (no traditional menu):
- Hero Scene: Scale-up sun/logo effect (1 to 150x), text parallax
- Product Scenes: Vertical slide transitions (100% to 0%)
- Cocktail Scene: Circular reveal (circInOut easing)
- All transitions: 1-1.5s duration, cinematic easing curves

### Sand Particle System
- Canvas-based particle animation
- 100-400 particles (responsive to viewport)
- Copper (#CD7E31) and sand (#E8DCCA) colored particles
- Triggered on specific interactions
- Performance optimized for mobile

### Texture & Atmosphere
- **Noise overlay**: Fixed position, 5% opacity, fractal noise SVG
- **Background patterns**: Transparent textures (cubes pattern), 10% opacity
- **Gradient overlays**: Atmospheric lighting for dark scenes
- **Geometric accents**: Skewed sand dune shapes for depth

## Interactive Elements

**Buttons**:
- CTA style: px-8 py-4, uppercase, tracking-widest
- Dark theme: bg-copper (#CD7E31), text-white
- Light theme: bg-charcoal (#050606), text-sand-light
- Icon integration: ArrowRight with translate-x-1 on hover
- Scale effect: hover:scale-105

**Product Details HUD**:
- Border-left accent (2px, gold/copper)
- Grid layout for botanicals (grid-cols-2)
- Dot indicators (1x1px rounded, accent color)
- Uppercase labels with extreme tracking

## Animation Specifications

**Framer Motion Variants**:
- Initial states: opacity: 0, x/y offsets
- Delays: Staggered 0.2-0.8s for sequential reveals
- Spring animations: type: "spring" for bottle entrance
- Infinite loops: Floating animations (6s easeInOut)

**Scroll Progress Transforms**:
- Scale: [1, 150] for hero sun
- Y-position: [0, -500] for exit effects
- Opacity fades: [1, 1, 0] with mid-point holds

## Images

**Hero Section**:
- Central graphic: Circular gradient sun/logo (gold to copper gradient)
- No photographic hero image - abstract geometric approach

**Product Bottles**:
- User will provide: High-resolution product photography
- User will provide: PNG animation sequences for bottle reveals
- Placeholder: Custom SVG bottle component (already implemented)

**Logo**:
- User will provide: Official Desert Rose logo files
- Current placeholder: "DR" monogram in circles and typography

**Cocktail Cards**:
- User will provide: Cocktail photography (3 serves)
- Aspect ratio: 3:4 vertical cards

**Journey Section**:
- User will provide: Desert/botanical imagery
- Atmospheric photography of ingredients and landscape

## Accessibility & Performance

- Reduced particle count on mobile (100 vs 400)
- Smooth scroll disabled, custom scroll implementation
- Antialiased fonts (-webkit-font-smoothing)
- Semantic HTML structure maintained
- High contrast maintained in both light and dark modes

## Critical Constraints

- **No navigation menu** - scroll-based progression only
- **No footer links** - minimal contact information only
- **Single page experience** - all content on one continuous scroll
- **Preserve existing animations** - do not modify Framer Motion configurations
- **Maintain luxury aesthetic** - every detail contributes to premium positioning