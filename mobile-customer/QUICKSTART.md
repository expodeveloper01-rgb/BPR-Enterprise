# Getting Started - Customer Mobile App Android

## Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
cd mobile-customer
npm install
```

### 2. Configure Environment

Create `.env.local` (or rename `.env.example`):

```env
# For Android Emulator - connects to localhost:5000 on your machine
EXPO_PUBLIC_API_URL=http://192.168.1.1:5000

# For Physical Device - replace with your machine's local IP
# Find IP: ipconfig (Windows) or ifconfig (Mac/Linux)
# EXPO_PUBLIC_API_URL=http://192.168.x.x:5000
```

### 3. Ensure Backend is Running

```bash
# In another terminal, from backend directory
npm run dev
```

### 4. Start Android

```bash
# Install Expo CLI first if not already installed
npm install -g expo-cli

# Start the app
npm run android

# Or use:
expo start --android
```

### 5. First Run

- Allow necessary permissions when prompted
- You'll be taken to Login screen
- Register an account or login with existing credentials

## File Structure

```
mobile-customer/
├── app/
│   ├── _layout.jsx         # Root navigation setup
│   └── index.jsx           # App entry point
├── src/
│   ├── config/
│   │   └── api.js          # API endpoints & config
│   ├── services/           # API calls
│   │   ├── api.js
│   │   ├── auth.service.js
│   │   ├── products.service.js
│   │   └── cart-order.service.js
│   ├── stores/             # State management (Zustand)
│   │   ├── authStore.js
│   │   ├── cartStore.js
│   │   └── productStore.js
│   ├── screens/            # Screen components
│   │   ├── LoginScreen.jsx
│   │   ├── RegisterScreen.jsx
│   │   ├── HomeScreen.jsx
│   │   ├── ProductDetailScreen.jsx
│   │   ├── CartScreen.jsx
│   │   ├── OrdersScreen.jsx
│   │   └── ProfileScreen.jsx
│   ├── navigation/
│   │   └── RootNavigator.jsx   # Navigation setup
│   ├── hooks/
│   │   └── useAsyncStorage.js
│   └── utils/
├── package.json
├── app.json
└── SETUP.md                # Full documentation
```

## Main Features Implemented

### ✅ Authentication

- Login & Registration screens
- Auto token management with AsyncStorage
- Auto logout on 401 unauthorized

### ✅ Home Screen

- Browse products by category
- Search functionality
- Category filtering
- Add to cart quick access
- Cart item counter badge

### ✅ Product Details

- Full product information
- Size selection
- Quantity picker
- Add to cart

### ✅ Shopping Cart

- View all items
- Edit quantities
- Remove items
- Total price calculation
- Proceed to checkout button

### ✅ Orders

- View order history
- Real-time status tracking
- Order details
- Order cancellation (if allowed)

### ✅ Profile

- User information display
- Edit profile link
- Orders history access
- Payment methods section
- Settings
- Logout

## Backend Integration Points

The app uses these backend API endpoints:

**Authentication:**

- POST `/api/v1/auth/login`
- POST `/api/v1/auth/register`
- POST `/api/v1/auth/logout`

**Products:**

- GET `/api/v1/products`
- GET `/api/v1/categories`
- GET `/api/v1/kitchens`

**Cart:**

- GET `/api/v1/cart`
- POST `/api/v1/cart/add`
- PUT `/api/v1/cart/{id}`
- DELETE `/api/v1/cart/{id}`

**Orders:**

- GET `/api/v1/orders`
- GET `/api/v1/orders/{id}`
- POST `/api/v1/orders`

## Troubleshooting

### Can't connect to backend on Android Emulator?

- Use `192.168.1.1` in `.env.local` (NOT localhost)
- Check backend is running: `http://localhost:5000/health`
- Clear cache: `expo start --clear`

### App crashes on startup?

- Run `npm install` again
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check console for errors

### Login doesn't work?

- Verify backend is running
- Check API URL in `.env.local`
- Verify backend has the auth endpoint
- Check network in Android Studio / Logcat

## Next Steps

1. **Install dependencies:** `npm install`
2. **Set environment:** Create `.env.local` with your backend URL
3. **Start backend:** `npm run dev` in backend folder
4. **Run app:** `npm run android`
5. **Test:** Register/Login and browse products

For full documentation, see [SETUP.md](./SETUP.md)

## Adding New Features

### Add a new API endpoint:

1. Add to `src/config/api.js` ENDPOINTS
2. Create service method in `src/services/`
3. Use in stores or components

### Add a new screen:

1. Create `src/screens/YourScreen.jsx`
2. Import in `src/navigation/RootNavigator.jsx`
3. Add to navigation stack

### Store data globally:

Use Zustand hooks in any component:

```jsx
import { useAuthStore } from "../stores/authStore";

export default function MyScreen() {
  const { user, login } = useAuthStore();
  // Use state...
}
```

## Important Notes

- ✅ Backend is NOT modified - uses existing API
- ✅ No backend changes needed
- ✅ All features are customer-facing
- ✅ Ready for Android build
- ✅ Uses React Native Community standards
- ✅ All dependencies are latest stable versions

## Commands Reference

```bash
# Install dependencies
npm install

# Start development (choose platform)
npm start
npm run android        # Android Emulator
npm run iOS           # iOS Simulator
npm run web           # Web browser

# Build for production
expo build:android    # Creates APK/AAB

# Clear cache and restart
expo start --clear
```

---

**Ready to start?** Run `npm install` and then `npm run android`! 🚀
