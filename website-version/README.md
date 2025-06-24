# MY POCKET BUDDY - Website Version

A fun, accessible children's exercise website designed to help families stay active together. This static website version is optimized for web publishing and includes enhanced accessibility features, SEO optimization, and responsive design.

## Features

### 🎯 **Accessibility First**
- Screen reader optimized with proper ARIA labels
- High contrast support and colorblind-friendly design
- Keyboard navigation support
- Focus indicators for all interactive elements
- Skip-to-content links

### 🏃 **Exercise Categories**
- **Balance**: Tree poses, flamingo stands, tightrope walking
- **Coordination**: Cross crawls, jumping jacks, hopscotch
- **Strength**: Bear crawls, wall push-ups, superhero planks
- **Ball Skills**: Toss and catch, dribbling, target practice
- **Stretching**: Cat-cow stretches, butterfly pose, reaching exercises

### 📋 **Structured Programs**
- Morning Energizer (15 min)
- Balance Champions (12 min) 
- Super Strength (18 min)
- Ball Play Fun (20 min)
- Calm and Stretch (10 min)
- Coordination Challenge (16 min)

### 🌐 **Web-Optimized Features**
- Static site generation ready
- SEO optimized with meta tags and Open Graph
- Responsive design for all devices
- Fast loading with optimized assets
- Progressive web app capabilities

## Technology Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives
- **Routing**: Wouter for lightweight routing
- **State Management**: TanStack Query for data fetching
- **Build Tool**: Vite for fast development and builds

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd website-version
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory, ready for deployment to any static hosting service.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Card, etc.)
│   ├── header.tsx      # Main navigation header
│   ├── footer.tsx      # Site footer
│   └── theme-provider.tsx # Dark/light theme management
├── data/               # Static data
│   ├── exercises.ts    # Exercise database
│   └── programs.ts     # Program definitions
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and types
├── pages/              # Page components
│   ├── home.tsx        # Landing page
│   ├── exercises.tsx   # Exercise catalog
│   ├── programs.tsx    # Program listings
│   ├── about.tsx       # About page
│   ├── contact.tsx     # Contact form
│   └── not-found.tsx   # 404 page
├── App.tsx             # Main app component
└── main.tsx            # Application entry point
```

## Key Features

### Responsive Design
- Mobile-first approach
- Optimized for tablets and desktops
- Touch-friendly interface
- Fluid typography and spacing

### Accessibility
- WCAG 2.1 AA compliant
- Screen reader support
- Keyboard navigation
- High contrast mode support
- Reduced motion support

### SEO Optimization
- Semantic HTML structure
- Meta tags for all pages
- Open Graph tags for social sharing
- Structured data markup
- Optimized loading performance

### Family-Friendly Content
- Age-appropriate exercise descriptions
- Clear safety instructions
- Equipment-free activities
- Modifications for different abilities
- Positive, encouraging language

## Deployment

### Static Hosting
This website can be deployed to any static hosting service:

- **Netlify**: Connect your git repository for automatic deployments
- **Vercel**: Deploy with zero configuration
- **GitHub Pages**: Use GitHub Actions for automated builds
- **Firebase Hosting**: Deploy with Firebase CLI
- **AWS S3 + CloudFront**: For enterprise-level hosting

### Build Commands
```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Customization

### Adding New Exercises
1. Add exercise data to `src/data/exercises.ts`
2. Include proper categorization and metadata
3. Ensure accessibility descriptions are included

### Modifying Design
1. Update Tailwind configuration in `tailwind.config.ts`
2. Modify CSS variables in `src/index.css`
3. Update component styles as needed

### Adding New Pages
1. Create component in `src/pages/`
2. Add route to `src/App.tsx`
3. Update navigation in `src/components/header.tsx`

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

We welcome contributions to make MY POCKET BUDDY even better! Please ensure all new features:

1. Include proper accessibility attributes
2. Are tested across different devices
3. Follow the existing code style
4. Include appropriate documentation

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions, feedback, or support, please contact us at hello@mypocketbuddy.com or visit our contact page.

---

**Made with ❤️ for children everywhere**