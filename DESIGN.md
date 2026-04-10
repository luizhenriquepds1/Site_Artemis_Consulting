Design Tokens:
Primary Color:     #0A1628  (Deep Navy)
Secondary Color:   #C9A84C  (Gold/Amber)
Accent Light:      #E8F0FE  (Soft Blue-White)
Background:        #FFFFFF  (White)
Surface:           #F7F8FC  (Off-White)
Text Primary:      #0A1628  (Navy)
Text Secondary:    #5C6B8A  (Muted Blue-Gray)
Text Light:        #FFFFFF  (White)

Font Family:       'Inter', sans-serif (import from Google Fonts)
Font Weights:      400 (body), 500 (subheadings), 700 (headings)
Font Sizes:        12px / 14px / 16px / 20px / 28px / 40px / 56px

Border Radius:     4px (buttons), 12px (cards), 0px (sections)
Spacing Scale:     8px / 16px / 24px / 32px / 48px / 64px / 96px

Shadows:           card: 0 4px 24px rgba(10,22,40,0.08)
                   hover: 0 8px 40px rgba(10,22,40,0.15)

Transitions:       all 0.3s ease


Image Strategy — Use Unsplash URLs:
Hero:         https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1600  (container port aerial)
China Factory:https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800  (modern factory)
Handshake:    https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800  (business handshake)
Logistics:    https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800  (logistics/warehouse)
Meeting:      https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800    (consulting meeting)
City China:   https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=800  (Shanghai skyline)


COMPONENT ARCHITECTURE
<App>
  ├── <Navbar>          fixed, transparent → navy on scroll
  ├── <HeroSection>     full-screen, image bg, animated headline
  ├── <StatsBar>        3 key numbers (animated count-up)
  ├── <AboutSection>    split layout: text + image
  ├── <WhyChina>        3 cards with background images
  ├── <ServicesSection> 5 cards grid with icons + hover effect
  ├── <HowItWorks>      horizontal timeline, 5 steps
  ├── <Differentials>   dark navy section, 3 columns
  ├── <Testimonials>    carousel/slider, 3 depoimentos
  ├── <FAQ>             accordion, 6 perguntas
  ├── <CTASection>      full-width, gold gradient, strong CTA
  └── <Footer>          4 columns, dark navy bg