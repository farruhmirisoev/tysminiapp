# ECCLIVO Telegram Mini App

A Telegram Mini App for purchasing OSGO (Compulsory Motor Third Party Liability) insurance policies.

## 🚀 Features

- **5-Step Insurance Purchase Flow**
  - Step 1: Policy Parameters (vehicle type, period, territory)
  - Step 2: Vehicle Information (verification)
  - Step 3: Owner Information (verification)
  - Step 4: Driver Information (multiple drivers)
  - Step 5: Summary & Payment (Payme/Click/Uzum)

- **Real-time Premium Calculation**
- **Form Data Persistence** (session storage)
- **Telegram WebApp Integration** (haptic feedback, theme support)
- **Internationalization** (Russian & Uzbek with 250+ translations)
- **Mobile-First Responsive Design**
- **Dark Mode Support**
- **Form Validation**
- **Full API Integration** with existing backend

## 📋 Prerequisites

- Node.js 20.11+ (or compatible version)
- npm 10+
- Access to ECCLIVO backend API

## 🛠️ Installation

1. **Clone the repository** (if not already done)
   ```bash
   cd C:\My projects\miniapp_z\telegram-miniapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables** (optional)
   
   Create a `.env` file in the root directory:
   ```env
   NUXT_PUBLIC_API_BASE=https://api.ecclivo.uz
   NUXT_PUBLIC_TELEGRAM_BOT_TOKEN=your_bot_token_here
   ```

## 🚀 Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Development in Telegram

To test in Telegram WebView:
1. Create a Telegram bot via [@BotFather](https://t.me/BotFather)
2. Set up a Mini App with `/newapp` command
3. Point it to your local dev server (use ngrok for HTTPS)
4. Open the Mini App in Telegram

## 🏗️ Build

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 📁 Project Structure

```
telegram-miniapp/
├── assets/
│   ├── css/
│   │   └── main.css          # Tailwind + custom styles
│   └── scss/
│       └── _variables.scss   # SCSS variables
├── components/
│   ├── layout/
│   │   ├── AppHeader.vue     # Fixed header with progress
│   │   ├── AppFooter.vue     # Fixed footer with navigation
│   │   └── ProgressBar.vue   # Step indicator
│   ├── steps/
│   │   ├── Step1Params.vue   # Policy parameters
│   │   ├── Step2Vehicle.vue  # Vehicle information
│   │   ├── Step3Owner.vue    # Owner information
│   │   ├── Step4Drivers.vue  # Driver information
│   │   └── Step5Summary.vue  # Summary & payment
│   └── ui/
│       ├── CheckButton.vue   # Radio-style selector
│       ├── InputField.vue    # Text input component
│       └── LanguageSwitcher.vue # RU/UZ language toggle
├── locales/
│   ├── ru.json               # Russian translations
│   └── uz.json               # Uzbek translations
├── composables/
│   ├── useTelegramWebApp.ts  # Telegram SDK integration
│   ├── useApi.ts             # API service wrapper
│   └── useFormPersistence.ts # Session storage
├── pages/
│   └── index.vue             # Main app page
├── stores/
│   ├── meta.ts               # Metadata store
│   └── osgo.ts               # OSGO policy store
├── types/
│   ├── osgo.ts               # Type definitions
│   └── api.ts                # API types
├── utils/
│   ├── validation.ts         # Validation functions
│   ├── formatting.ts         # Formatting functions
│   └── constants.ts          # App constants
├── app.vue                   # Root component
├── nuxt.config.ts            # Nuxt configuration
├── tailwind.config.js        # Tailwind configuration
└── package.json
```

## 🔧 Technology Stack

- **Framework**: Nuxt 3 (Vue 3 + Vite)
- **State Management**: Pinia
- **Styling**: Tailwind CSS
- **Internationalization**: @nuxtjs/i18n
- **API Client**: Axios
- **Date Handling**: Day.js
- **Icons**: BoxIcons
- **Type Safety**: TypeScript

## 🎨 Design System

### Colors
- **Primary**: `#2481CC` (blue)
- **Success**: `#10B981` (green)
- **Error**: `#EF4444` (red)
- **Background**: `#FFFFFF` (white)
- **Text**: `#1F2937` (dark gray)

### Layout
- **Header Height**: 60px (fixed)
- **Footer Height**: 70px (fixed)
- **Max Width**: 768px (centered)

### Components
- **Touch-friendly buttons**: 44px minimum height
- **Rounded corners**: 8-12px border radius
- **Smooth transitions**: 200ms duration

## 🔌 API Integration

The app integrates with the following backend services:

### OsgoService
- `getOsgoDataVersion()` - Check metadata version
- `getOsgoData()` - Fetch metadata
- `getVehicle()` - Verify vehicle
- `getDriver()` - Verify driver
- `createOsgoApplication()` - Create policy
- `updateOsgoApplication()` - Update policy
- `getFundPolicy()` - Get fund data

### PartyService
- `getIndividualByPassport()` - Verify individual

### BillingService
- Payment methods for Payme, Click, Uzum

## 🔐 Authentication

### Development Mode
For development, use temporary credentials:
- **Username**: `998935286407`
- **Password**: `Abc123!@#`

### Production Mode
Uses Telegram `initData` for secure authentication.

## 📱 Telegram WebApp Features

- **Theme Integration**: Adapts to Telegram light/dark theme
- **Haptic Feedback**: Provides tactile feedback on actions
- **Back Button**: Native Telegram back button support
- **Main Button**: Context-aware action button
- **Auto-expand**: Expands to full viewport height

## 🧪 Testing

### Manual Testing Checklist
- [ ] All 5 steps navigate correctly
- [ ] Form data persists between steps
- [ ] Language switching works (RU ↔ UZ)
- [ ] Translations display correctly
- [ ] Vehicle verification works
- [ ] Owner verification works
- [ ] Driver verification works
- [ ] Premium calculation is accurate
- [ ] Payment buttons work
- [ ] Responsive on mobile
- [ ] Works in Telegram WebView

### Test Data
Use the following test data for development:

**Vehicle:**
- Gov Number: `01 123 ABC`
- Tech Passport: `AA 1234567`

**Individual:**
- Passport: `AA 1234567`
- Birth Date: `1990-01-01`

## 🐛 Troubleshooting

### npm install fails
If you encounter engine warnings or errors:
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Telegram WebApp SDK not found
Make sure the Telegram script is loaded before your app:
```html
<script src="https://telegram.org/js/telegram-web-app.js"></script>
```

### API requests fail
Check your `.env` file and ensure the API base URL is correct:
```env
NUXT_PUBLIC_API_BASE=https://api.ecclivo.uz
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NUXT_PUBLIC_API_BASE` | Backend API URL | `https://api.ecclivo.uz` |
| `NUXT_PUBLIC_TELEGRAM_BOT_TOKEN` | Telegram bot token | - |

## 🚢 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect to Vercel
3. Configure environment variables
4. Deploy

### Netlify
1. Build command: `npm run build`
2. Publish directory: `.output/public`
3. Configure environment variables

### Manual Deployment
```bash
npm run build
# Upload .output/ directory to your server
```

## 📚 Documentation

- [Nuxt 3 Docs](https://nuxt.com)
- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
- [Tailwind CSS](https://tailwindcss.com)
- [Pinia](https://pinia.vuejs.org)

## 🤝 Contributing

1. Follow the existing code style
2. Use TypeScript for type safety
3. Write descriptive commit messages
4. Test your changes thoroughly

## 📄 License

Proprietary - ECCLIVO Insurance

## 🆘 Support

For issues or questions:
- Check `SPEC.md` for requirements
- Check `PROGRESS.md` for implementation status
- Check `ARCHITECTURE.txt` for system architecture

## ✅ Current Status

**Progress**: 90% Complete

- ✅ Core infrastructure
- ✅ Type definitions
- ✅ Utilities & validation
- ✅ Composables (Telegram, API, persistence)
- ✅ State management (Pinia stores)
- ✅ UI components (10+ components)
- ✅ All 5 step components
- ✅ Full API integration
- ✅ Localization (Russian & Uzbek)
- ⏳ End-to-end testing
- ⏳ Payment gateway testing
- ⏳ Production deployment

---

Built with ❤️ for ECCLIVO Insurance