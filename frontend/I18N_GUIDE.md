# Internationalization (i18n) Guide

## Overview

Your CLINORA application now supports three languages:
- 🇬🇧 **English** (en)
- 🇮🇳 **മലയാളം** (ml) - Malayalam
- 🇮🇳 **हिन्दी** (hi) - Hindi

## Architecture

### File Structure

```
frontend/
├── src/
│   ├── locales/
│   │   ├── en.json       # English translations
│   │   ├── ml.json       # Malayalam translations
│   │   └── hi.json       # Hindi translations
│   ├── context/
│   │   └── LanguageContext.jsx   # Language state management
│   └── components/
│       └── LanguageDropdown.jsx  # Language selector UI
```

### Components

1. **LanguageContext** (`src/context/LanguageContext.jsx`)
   - Manages language state across the application
   - Provides translation function `t(key)`
   - Persists language preference to localStorage
   - Exports `useLanguage()` hook

2. **LanguageDropdown** (`src/components/LanguageDropdown.jsx`)
   - Visual language selector with flags
   - Displays current language
   - Dropdown menu for switching languages
   - Integrated in the Navbar

3. **Translation Files** (`src/locales/*.json`)
   - Organized by feature area (common, landing, patient, doctor, admin, etc.)
   - Hierarchical key structure using dot notation

## Usage

### Using Translations in Components

```jsx
import { useLanguage } from '../context/LanguageContext';

function MyComponent() {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('common.clinora')}</h1>
      <p>{t('landing.heroDescription')}</p>
    </div>
  );
}
```

### Translation Key Structure

The translation keys follow a hierarchical pattern:

```
category.subcategory.key
```

Examples:
- `common.signIn` → "Sign In" / "साइन इन करें" / "സൈൻ ഇൻ"
- `patient.dashboard` → "Dashboard" / "डैशबोर्ड" / "ഡാഷ്‌ബോർഡ്"
- `landing.heroTitle` → Hero section title

### Available Translation Categories

- **common**: Shared UI elements (buttons, labels, actions)
- **roles**: User role names and statuses
- **landing**: Landing page content
- **patient**: Patient portal navigation and features
- **doctor**: Doctor portal navigation and features
- **admin**: Admin portal navigation and features
- **footer**: Footer content

## Adding New Translations

### Step 1: Add to English (en.json)

```json
{
  "myFeature": {
    "title": "My Feature Title",
    "description": "Feature description here"
  }
}
```

### Step 2: Add Malayalam Translation (ml.json)

```json
{
  "myFeature": {
    "title": "എന്റെ ഫീച്ചർ ശീർഷകം",
    "description": "ഇവിടെ ഫീച്ചർ വിവരണം"
  }
}
```

### Step 3: Add Hindi Translation (hi.json)

```json
{
  "myFeature": {
    "title": "मेरा फीचर शीर्षक",
    "description": "यहां फीचर विवरण"
  }
}
```

### Step 4: Use in Component

```jsx
<h2>{t('myFeature.title')}</h2>
<p>{t('myFeature.description')}</p>
```

## Language Persistence

The selected language is automatically saved to `localStorage` with the key `clinora_language`. When users return to the site, their language preference is restored.

## Current Implementation Status

### Completed ✓
- Language context and provider
- Language dropdown component
- Translation files for all three languages
- Navbar translations
- Landing page translations
- Footer translations
- Common UI elements

### To Be Translated
To fully internationalize the entire application, you'll need to:

1. **Authentication Pages**
   - Login page
   - Register page
   - Password reset flows

2. **Patient Portal**
   - Dashboard
   - Clinical Case Form
   - My Cases
   - Book Appointment
   - My Appointments

3. **Doctor Portal**
   - Appointments Queue
   - Availability Settings
   - Profile Management

4. **Admin Portal**
   - Analytics Dashboard
   - Doctor Approvals
   - Specialization Manager
   - User Management
   - Issue Reports

5. **Modals & Forms**
   - Case Modal
   - Payment Modal
   - Report Issue Modal
   - Toast notifications

## Example: Adding Translations to a New Page

```jsx
// Before
export default function MyPage() {
  return (
    <div>
      <h1>Welcome to My Page</h1>
      <button>Click Here</button>
    </div>
  );
}

// After
import { useLanguage } from '../context/LanguageContext';

export default function MyPage() {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('myPage.welcome')}</h1>
      <button>{t('myPage.clickHere')}</button>
    </div>
  );
}
```

Then add to translation files:

```json
// en.json
{
  "myPage": {
    "welcome": "Welcome to My Page",
    "clickHere": "Click Here"
  }
}

// ml.json
{
  "myPage": {
    "welcome": "എന്റെ പേജിലേക്ക് സ്വാഗതം",
    "clickHere": "ഇവിടെ ക്ലിക്ക് ചെയ്യുക"
  }
}

// hi.json
{
  "myPage": {
    "welcome": "मेरे पेज पर आपका स्वागत है",
    "clickHere": "यहां क्लिक करें"
  }
}
```

## Testing

1. **Run the dev server:**
   ```bash
   npm run dev
   ```

2. **Click the language dropdown** in the navbar (shows globe icon 🌐)

3. **Select a language** from the dropdown

4. **Verify:**
   - UI updates immediately
   - Language preference persists on page reload
   - All translated elements display correctly

## Tips

1. **Keep keys descriptive:** Use clear, hierarchical keys like `patient.bookSpecialist` instead of generic keys like `button1`

2. **Consistent structure:** Maintain the same key structure across all language files

3. **Fallback behavior:** If a translation key is missing, the key itself is displayed

4. **Right-to-left languages:** If adding RTL languages (Arabic, Urdu), you'll need additional CSS handling

5. **Dynamic content:** For content with variables, consider using template literals:
   ```javascript
   const message = `${t('welcome.greeting')}, ${userName}!`;
   ```

## Support

For translation assistance or to add more languages, update the language files in `src/locales/` and add the language configuration to `LanguageContext.jsx`.
