# Telegram Mini App - ECCLIVO Insurance Purchase
## Project Plan & Implementation Roadmap

---

## 📋 Project Overview

**Goal**: Create a Telegram Mini App that replicates ECCLIVO insurance policy purchase functionality from the existing website.

**Tech Stack**:
- **Framework**: Nuxt 3 (Vue 3 + Vite)
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Telegram Integration**: Telegram WebApp SDK
- **API**: Existing backend services (reuse from website)

---

## 🎯 Core Requirements Summary

### User Flow (5 Steps):
1. **Policy Parameters** - Vehicle type, period, driver restrictions, territory
2. **Vehicle Information** - Gov number, tech passport, verification
3. **Owner Information** - Passport details, verification
4. **Driver Information** - Add/verify multiple drivers
5. **Summary & Payment** - Review, contact info, payment (Payme/Click/Uzum)

### Key Features:
- ✅ Fixed header with logo, title, progress bar
- ✅ Fixed footer with Previous/Next navigation
- ✅ Form validation and error handling
- ✅ Data persistence (session storage)
- ✅ Localization (Russian/Uzbek)
- ✅ Responsive mobile-first design
- ✅ Telegram theme integration

---

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────┐
│         Telegram Mini App (Nuxt 3)          │
├─────────────────────────────────────────────┤
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │   Fixed Header                         │ │
│  │   - Logo                               │ │
│  │   - Product Title                      │ │
│  │   - Progress Bar (5 steps)            │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │   Main Content Area                    │ │
│  │   - Step 1: Policy Parameters          │ │
│  │   - Step 2: Vehicle Information        │ │
│  │   - Step 3: Owner Information          │ │
│  │   - Step 4: Driver Information         │ │
│  │   - Step 5: Summary & Payment          │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │   Fixed Footer                         │ │
│  │   [Previous]         [Next]            │ │
│  └───────────────────────────────────────┘ │
│                                             │
└─────────────────────────────────────────────┘
                    ↓
          ┌─────────────────┐
          │  API Services   │
          ├─────────────────┤
          │ OsgoService     │
          │ PartyService    │
          │ BillingService  │
          └─────────────────┘
                    ↓
          ┌─────────────────┐
          │  Backend DB     │
          │  - Vehicles     │
          │  - Individuals  │
          │  - Drivers      │
          │  - Payments     │
          └─────────────────┘
```

---

## 🗂️ File Structure

```
miniapp_z/
├── nuxt-app/                    # Nuxt 3 application
│   ├── pages/
│   │   └── index.vue           # Main app page with stepper
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppHeader.vue   # Fixed header with logo & progress
│   │   │   └── AppFooter.vue   # Fixed footer with navigation
│   │   ├── steps/
│   │   │   ├── Step1Params.vue       # Policy parameters
│   │   │   ├── Step2Vehicle.vue      # Vehicle information
│   │   │   ├── Step3Owner.vue        # Owner information
│   │   │   ├── Step4Drivers.vue      # Driver information
│   │   │   └── Step5Summary.vue      # Summary & payment
│   │   └── ui/
│   │       ├── CheckButton.vue       # Radio button style selector
│   │       ├── InputField.vue        # Reusable input
│   │       └── ProgressBar.vue       # Step indicator
│   ├── composables/
│   │   ├── useTelegramWebApp.ts    # Telegram SDK integration
│   │   ├── useApi.ts               # API service wrapper
│   │   └── useFormPersistence.ts   # Session storage handling
│   ├── stores/
│   │   ├── osgo.ts                 # OSGO policy store
│   │   └── meta.ts                 # Metadata (car types, periods, etc)
│   ├── types/
│   │   ├── osgo.ts                 # Type definitions
│   │   └── api.ts                  # API response types
│   ├── utils/
│   │   ├── validation.ts           # Form validation rules
│   │   └── formatting.ts           # Price, date formatting
│   ├── assets/
│   │   └── css/
│   │       └── main.css            # Tailwind + custom styles
│   ├── public/
│   │   └── logo.png                # Company logo
│   └── nuxt.config.ts              # Nuxt configuration
├── website/                        # Existing Vue website (reference)
└── SPEC.md                         # Technical specification
```

---

## 🔄 Implementation Phases

### **Phase 1: Project Setup** ✅
- [x] Review existing website codebase
- [x] Analyze API endpoints and data models
- [x] Create project plan and architecture diagram
- [ ] Initialize Nuxt 3 project
- [ ] Install dependencies (Pinia, Tailwind, etc.)
- [ ] Configure Telegram WebApp SDK

### **Phase 2: Layout & Navigation** 
- [ ] Create fixed header component
- [ ] Create fixed footer component
- [ ] Implement step-based navigation system
- [ ] Create progress bar component
- [ ] Add theme support (Telegram light/dark)

### **Phase 3: Step Components**
**Step 1 - Policy Parameters:**
- [ ] Vehicle type selector (checkboxes)
- [ ] Insurance period selector
- [ ] Driver limitation toggle
- [ ] Incident frequency selector (conditional)
- [ ] Usage territory dropdown
- [ ] Real-time premium calculation display

**Step 2 - Vehicle Information:**
- [ ] Government number input
- [ ] Tech passport series/number inputs
- [ ] Vehicle verification API integration
- [ ] Display retrieved vehicle data

**Step 3 - Owner Information:**
- [ ] Passport series/number inputs
- [ ] Birth date input
- [ ] Owner verification API integration
- [ ] "Owner is applicant" checkbox
- [ ] Conditional applicant form

**Step 4 - Driver Information:**
- [ ] Add driver button
- [ ] Driver form component (repeatable)
- [ ] "Owner is driver" / "Applicant is driver" shortcuts
- [ ] Driver verification API integration
- [ ] Remove driver functionality

**Step 5 - Summary & Payment:**
- [ ] Policy summary display
- [ ] Contact phone input
- [ ] Policy start date selector
- [ ] Premium amount display
- [ ] Payment gateway integration (Payme/Click/Uzum)
- [ ] Fund data display (after payment)

### **Phase 4: State Management & API Integration**
- [ ] Setup Pinia stores for OSGO and metadata
- [ ] Implement API service wrapper
- [ ] Integrate OsgoService methods:
  - `getOsgoDataVersion()`
  - `getOsgoData()`
  - `getVehicle()`
  - `createOsgoApplication()`
  - `updateOsgoApplication()`
  - `getFundPolicy()`
- [ ] Integrate PartyService:
  - `getIndividualByPassport()`
- [ ] Integrate BillingService for payments

### **Phase 5: Data Persistence & Validation**
- [ ] Implement session storage for form data
- [ ] Add form validation rules
- [ ] Real-time field validation
- [ ] Error handling and user feedback
- [ ] Clear data on successful completion

### **Phase 6: Localization**
- [ ] Setup i18n with Russian and Uzbek
- [ ] Extract translation keys from website
- [ ] Implement language switcher
- [ ] Test all UI text in both languages

### **Phase 7: Telegram Integration**
- [ ] Initialize Telegram WebApp SDK
- [ ] Access user data via initData
- [ ] Apply Telegram theme colors
- [ ] Test in Telegram environment
- [ ] Handle back button behavior

### **Phase 8: Testing & Optimization**
- [ ] Cross-browser testing
- [ ] Mobile responsiveness testing
- [ ] API error handling testing
- [ ] Performance optimization
- [ ] Bundle size optimization

---

## 🔑 Key API Endpoints (from website reference)

### OsgoService:
- `getOsgoDataVersion()` - Check metadata version
- `getOsgoData()` - Fetch metadata (car types, periods, etc.)
- `getVehicle(govNumber, series, number)` - Verify vehicle
- `createOsgoApplication(data)` - Create new policy
- `updateOsgoApplication(data)` - Update existing policy
- `getFundPolicy(id)` - Get policy fund data
- `getDriver(passport, birthDate)` - Verify driver

### PartyService:
- `getIndividualByPassport(series, number, birthDate)` - Verify owner/applicant

### BillingService:
- Payment methods for Payme, Click, Uzum

---

## 📊 Data Models (from website)

### Osgo (Main Policy Object):
```typescript
{
  id?: string
  status: BaseContractStatus
  vehicle: Vehicle
  party: Individual              // Applicant
  beneficiary: Individual         // Owner
  applicantIsOwner: boolean
  drivers: Driver[]
  driversLimited: boolean
  incidentCoeff?: number
  period: Period
  periodType: OsgoPeriodType
  drivedArea: DrivedArea
  contractStartDate: string
  contractEndDate: string
  premium: number
  discountType: any
  entriesJournalKt?: EntriesJournal[]
}
```

### Vehicle:
```typescript
{
  govNumber: string
  techPassportSeries: string
  techPassportNumber: string
  carType: CarType
  model?: string
  year?: number
  engineNumber?: string
}
```

### Individual (Owner/Applicant):
```typescript
{
  id?: string
  passportSeries: string
  passportNumber: string
  birthDate: string
  name?: string
  address?: string
  phone?: string
  pinfl?: string
}
```

### Driver:
```typescript
{
  passportSeries: string
  passportNumber: string
  birthDate: string
  name?: string
  licenseNumber?: string
  incidentFrequency?: IncidentFrequency
}
```

---

## 🎨 UI/UX Design Guidelines

### Layout:
- **Header**: 60px fixed height, white background, subtle shadow
- **Content**: Scrollable area between header and footer
- **Footer**: 70px fixed height, white background, top border
- **Spacing**: Consistent 16px/24px padding
- **Max Width**: 768px centered on desktop

### Colors (Theme 1 - Minimalist):
- **Primary**: #2481CC (blue)
- **Background**: #FFFFFF (white)
- **Text**: #1F2937 (dark gray)
- **Border**: #E5E7EB (light gray)
- **Success**: #10B981 (green)
- **Error**: #EF4444 (red)

### Typography:
- **Font**: Inter or system font stack
- **Headers**: 24px/20px/18px bold
- **Body**: 16px regular
- **Small**: 14px regular

### Components:
- **Buttons**: Rounded corners (8px), 44px height (touch-friendly)
- **Inputs**: Rounded corners (6px), 48px height, clear focus states
- **Cards**: Rounded corners (12px), subtle shadow
- **Checkboxes**: Large touch targets (48x48px)

### Animations:
- **Transitions**: 200ms ease-in-out
- **Page Changes**: Fade effect
- **Button Hover**: Subtle scale (1.02)
- **Progress Bar**: Smooth width transition

---

## 🔒 Security Considerations

1. **Telegram Authentication**: Validate `initData` on backend
2. **API Security**: Use token-based auth (reference website login)
3. **Data Sanitization**: Validate all inputs before API calls
4. **CSRF Protection**: Implement for payment transactions
5. **Secure Storage**: Never store sensitive data in localStorage
6. **HTTPS**: Ensure all API calls use HTTPS

---

## 📱 Telegram WebApp Integration

### SDK Setup:
```javascript
<script src="https://telegram.org/js/telegram-web-app.js"></script>
```

### Key Methods:
- `window.Telegram.WebApp.initData` - User authentication data
- `window.Telegram.WebApp.themeParams` - Theme colors
- `window.Telegram.WebApp.BackButton` - Native back button
- `window.Telegram.WebApp.MainButton` - Native action button
- `window.Telegram.WebApp.ready()` - Signal app is loaded

---

## 🧪 Testing Checklist

- [ ] All 5 steps navigate correctly
- [ ] Form data persists between steps
- [ ] API calls handle errors gracefully
- [ ] Vehicle verification works
- [ ] Owner/applicant verification works
- [ ] Driver verification works
- [ ] Premium calculation is accurate
- [ ] Payment integration works
- [ ] Responsive on mobile devices
- [ ] Works in Telegram WebView
- [ ] Both languages display correctly
- [ ] Theme switching works
- [ ] Session storage clears on completion

---

## 📝 Notes & Reminders

### From SPEC.md:
1. **Auth**: No login page needed - use Telegram auth
2. **Temp Login** (if needed): 998935286407 / Abc123!@#
3. **UI Structure**: Fixed header + scrollable content + fixed footer
4. **Progress Bar**: Show all 5 steps in header
5. **Reference**: Use `/ecclivo` route from website folder
6. **API Base**: Reuse existing backend services
7. **Theme**: Follow Telegram design guidelines

### Development Tips:
- Start with layout/navigation first
- Build step by step (don't jump ahead)
- Test each component before moving on
- Keep components small and focused
- Reuse website logic where possible
- Mobile-first responsive design
- Prioritize performance (lightweight bundle)

---

## 🚀 Deployment

### Build Command:
```bash
npm run build
```

### Hosting Options:
- Vercel (recommended for Nuxt)
- Netlify
- Custom server with nginx

### Environment Variables:
```
VITE_API_BASE_URL=https://api.example.com
VITE_TELEGRAM_BOT_TOKEN=your_bot_token
```

---

## 📚 Resources

- [Telegram Mini Apps Documentation](https://core.telegram.org/bots/webapps)
- [Nuxt 3 Documentation](https://nuxt.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Pinia Documentation](https://pinia.vuejs.org)
- Existing website: `miniapp_z/website/` folder

---

**Last Updated**: Initial Creation
**Status**: Phase 1 - Planning Complete ✅