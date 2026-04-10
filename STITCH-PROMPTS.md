Create a stunning, image-rich, conversion-focused institutional website for Artemis Consulting, a premium Brazilian consulting firm specializing in direct imports from China. The site must feel inviting, trustworthy, and visually impressive — like a world-class consulting firm.

🎨 SYSTEM DESIGN
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

🏗️ COMPONENT ARCHITECTURE
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

📐 FULL WEBSITE SPECIFICATION
NAVBAR

Fixed top, starts transparent over hero
On scroll > 80px: background becomes #0A1628 with smooth transition
Left: "ARTEMIS" logo text with gold dot accent + small arrow icon (↗)
Right: navigation links — Sobre, Serviços, Como Funciona, FAQ, Contato
CTA button: gold border, gold text, hover fills gold
Mobile: hamburger menu with slide-down drawer


SECTION 1 — HERO

Full viewport height (100vh)
Background: container port image with dark overlay rgba(10,22,40,0.72)
Centered content:

Small gold label above headline: ▸ CONSULTORIA DE IMPORTAÇÃO PREMIUM
Main headline (56px bold white): "Importe da China com Segurança e Resultados Reais"
Subheadline (20px muted): "Conectamos empreendedores brasileiros aos melhores fornecedores chineses — com auditoria presencial, negociação direta e acompanhamento completo."
Two buttons side by side:

Primary: gold bg, navy text — "Falar com Especialista"
Secondary: white border, white text — "Conhecer os Serviços"




Bottom: animated scroll indicator (bouncing arrow down)


SECTION 2 — STATS BAR

Thin full-width band, navy background with gold accents
3 animated count-up stats:

+200 Importações Realizadas
+50 Fornecedores Auditados
+8 anos de Experiência


Numbers animate from 0 on scroll into view (Intersection Observer)


SECTION 3 — SOBRE NÓS

Two-column layout (50/50):

Left: image of business meeting/handshake with subtle gold border frame effect
Right: text block

Gold label: SOBRE A ARTEMIS
Headline: "Seu parceiro estratégico no mercado global"
Body text: company description from the brief
Small trust badges row: ✓ Auditoria Presencial ✓ Sem Intermediários ✓ Suporte 24/7






SECTION 4 — POR QUE A CHINA?

Section title centered: "A maior potência exportadora do mundo"
3 cards, each with:

Full background image (factory / logistics / tech)
Dark gradient overlay
White icon + title + 2-line description
Hover: slight scale-up + brighter overlay


Cards: Tecnologia e Inovação, Logística Global, Preços Competitivos


SECTION 5 — SERVIÇOS

Light off-white background (#F7F8FC)
Section label + headline centered
5 service cards in responsive grid (3 + 2 centered):

Gold icon (SVG inline)
Bold title
Short description (2 lines)
Hover: card lifts (shadow deepens), thin gold top border appears


Services:

🔍 Pesquisa de Fornecedores
✅ Auditoria de Qualidade
🤝 Negociação Comercial
🚢 Logística Internacional
💬 Suporte Contínuo




SECTION 6 — COMO FUNCIONA

White background
Centered headline: "Do produto à sua porta em 5 etapas"
Horizontal step timeline (on desktop), vertical on mobile:

Step circles with gold numbers connected by dashed line
Below each: step title + 1-line description


Steps: Briefing → Pesquisa → Auditoria → Embarque → Entrega


SECTION 7 — DIFERENCIAIS

Full-width navy background section
Gold label + white headline: "Por que a Artemis é diferente?"
3-column layout, each with:

Gold icon
White bold title
Light gray description text


Differentials: Transparência Total, Auditoria Presencial, Expertise Internacional
Background: subtle pattern or Shanghai skyline image at low opacity


SECTION 8 — DEPOIMENTOS ⭐

Off-white background
Section headline: "O que nossos clientes dizem"
Auto-sliding carousel (3s interval, manual dots navigation):

Card 1:

"A Artemis transformou minha operação. Consegui fornecedores confiáveis na primeira tentativa e minha margem aumentou 40%."
— Carlos Mendes, Empresário, São Paulo

Card 2:

"Tentei importar sozinho antes e tive prejuízo. Com a Artemis, tive segurança em cada etapa. Recomendo sem hesitar."
— Fernanda Rocha, E-commerce, Belo Horizonte

Card 3:

"O nível de profissionalismo é surpreendente. Eles visitaram a fábrica, auditaram tudo e entregaram exatamente o que prometeram."
— Ricardo Alves, Importador, Rio de Janeiro


Each card: white bg, gold star rating (5 stars), quote, avatar initials circle, name + city
Dots pagination below carousel


SECTION 9 — FAQ (ACCORDION)

White background
Centered headline: "Perguntas Frequentes"
6 accordion items, click to expand, smooth animation:


Quais produtos posso importar da China?
→ Trabalhamos com uma ampla gama: eletrônicos, vestuário, utilidades domésticas, máquinas, cosméticos e muito mais. Fazemos uma análise de viabilidade para cada produto.
Qual o valor mínimo para começar uma importação?
→ Nossos serviços são adaptados para diferentes volumes. Atendemos tanto iniciantes quanto empresas consolidadas, com planos personalizados.
Como vocês garantem a qualidade dos produtos?
→ Realizamos auditorias presenciais nas fábricas, verificamos certificações, testamos amostras e acompanhamos a produção antes do embarque.
Quanto tempo leva o processo de importação?
→ O prazo médio é de 30 a 60 dias, dependendo do produto, fábrica e modal de transporte escolhido (marítimo ou aéreo).
Preciso ter CNPJ para importar?
→ Sim, é necessário um CNPJ habilitado para importação. Podemos orientar sobre os requisitos e processos junto à Receita Federal.
Vocês cuidam do desembaraço aduaneiro no Brasil?
→ Sim. Coordenamos todo o processo logístico, incluindo documentação, desembaraço e entrega no endereço do cliente.


Accordion: gold arrow rotates 180° on open, smooth max-height transition


SECTION 10 — CTA FINAL

Full-width, gold gradient background (#C9A84C → #A8832A)
Navy headline: "Pronto para crescer com inteligência?"
Navy subtext: "Fale com um especialista da Artemis e descubra como a importação direta pode transformar seu negócio."
Large navy button: "Quero Importar com a Artemis →"


FOOTER

Navy background (#0A1628)
4 columns:

Col 1: Logo + tagline + short description
Col 2: Links — Sobre, Serviços, Como Funciona, FAQ
Col 3: Contato — Email, WhatsApp, LinkedIn
Col 4: "Importação segura e lucrativa para empreendedores brasileiros" + gold CTA button


Bottom bar: copyright + "Feito com excelência no Brasil"
All text white/gray, gold hover on links


⚙️ TECHNICAL REQUIREMENTS

Framework: Vanilla HTML + CSS + JS
Fonts: Import Inter from Google Fonts
Images: Load from Unsplash URLs provided above
Animations:

Count-up stats on scroll (Intersection Observer API)
Fade-in sections on scroll
Smooth accordion transitions
Auto-sliding testimonials carousel
Navbar transparency transition


Responsive: Mobile-first, breakpoints at 768px and 1200px
Language: 100% Brazilian Portuguese
Performance: Lazy-load images, minimal dependencies


Seletor de Idiomas: Opções para Português (PT), Inglês (EN), Chinês (CN) e Espanhol (ES).
Design Adaptativo: O seletor acompanha a lógica de contraste da navbar, mudando de cor conforme o fundo para garantir legibilidade.
Interatividade: O dropdown possui uma transição suave, mantendo a experiência moderna que implementamos.

Revelação Gradual: As seções agora surgem suavemente com um efeito de "fade-in-up" conforme você navega pela página.
Estatísticas Vivas: Os números de importações, fornecedores e experiência agora contam progressivamente quando aparecem na tela.
Interatividade Refinada: Melhorei os efeitos de hover nos cards e botões, além de garantir que a expansão do FAQ e a transição da navbar sejam suaves e elegantes.
O site agora passa uma sensação muito mais moderna e profissional. 