# Customer Mobile App - React Native Expo

A cross-platform mobile application for Uncle Brew food delivery service, built with React Native using Expo.

## Features

### Authentication

- Login with email and password
- User registration with phone number
- Password reset functionality
- Email verification

### Home/Products

- Browse food items with categories and cuisines
- Search functionality
- Product details with images and descriptions
- Size and customization options
- Real-time inventory availability

### Cart Management

- Add/remove items from cart
- Update quantities
- Clear cart
- Persistent cart storage
- Real-time cart sync with backend

### Orders

- View order history
- Track order status in real-time
- View estimated delivery times
- Cancel orders
- Order details and breakdown

### Profile

- View user information
- Edit profile
- Manage delivery addresses
- Payment method management
- Preferences and settings

## Tech Stack

- **React Native & Expo** - Cross-platform mobile app framework
- **React Navigation** - Navigation and routing
- **Zustand** - State management
- **Axios** - HTTP client
- **AsyncStorage** - Local data persistence
- **Expo Vector Icons** - Icons library

## Project Structure

```
mobile-customer/
├── app/                      # Expo Router entry points
│   ├── _layout.jsx          # Root layout with navigation setup
│   └── index.jsx            # Splash / entry screen
├── src/
│   ├── config/              # Configuration files
│   │   └── api.js           # API endpoints and config
│   ├── services/            # API service layer
│   │   ├── api.js           # Axios instance and interceptors
│   │   ├── auth.service.js  # Auth API calls
│   │   ├── products.service.js
│   │   └── cart-order.service.js
│   ├── stores/              # Zustand stores (state management)
│   │   ├── authStore.js
│   │   ├── cartStore.js
│   │   └── productStore.js
│   ├── screens/             # Screen components
│   │   ├── LoginScreen.jsx
│   │   ├── RegisterScreen.jsx
│   │   ├── HomeScreen.jsx
│   │   ├── ProductDetailScreen.jsx
│   │   ├── CartScreen.jsx
│   │   ├── OrdersScreen.jsx
│   │   └── ProfileScreen.jsx
│   ├── navigation/          # Navigation setup
│   │   └── RootNavigator.jsx
│   ├── hooks/               # Custom hooks
│   │   └── useAsyncStorage.js
│   └── utils/               # Utility functions
├── assets/                  # Images and static assets
├── package.json
├── app.json                 # Expo configuration
├── .env.example             # Environment variables template
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher) and npm/yarn
- Expo CLI: `npm install -g expo-cli`
- Android SDK (for Android development)
- Android Emulator or physical device with Expo Go app

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env.local
   ```

3. **Update `.env.local` with your backend URL:**

   ```
   # For Android Emulator (connects to localhost:5000 on host machine)
   EXPO_PUBLIC_API_URL=http://192.168.1.1:5000

   # For physical device on same network (replace with your machine's local IP)
   # EXPO_PUBLIC_API_URL=http://192.168.x.x:5000
   ```

### Running the App

#### Development with Expo Go

**Android Emulator:**

```bash
npm run android
# Then scan QR code with Expo Go app or follow instructions
```

**Physical Android Device:**

```bash
npm run android
# 1. Install Expo Go from Google Play Store
# 2. Scan the QR code displayed in terminal
```

**Web (for testing):**

```bash
npm run web
```

#### Production Build

**Build APK:**

```bash
eas build --platform android
```

**Install EAS CLI:**

```bash
npm install -g eas-cli
eas login
```

## Backend Integration

The app connects to the Uncle Brew backend API. Make sure the backend is running on:

- Development: `http://localhost:5000`
- Production: Your deployed backend URL

### API Configuration

API endpoints are defined in `src/config/api.js`. The base URL can be configured via the `.env.local` file.

### Authentication Flow

1. User logs in or registers
2. Token is stored in AsyncStorage
3. Token is automatically attached to all API requests
4. If token expired, user is logged out automatically

## Features Implementation

### Adding New Screens

1. Create a new component in `src/screens/`
2. Add it to the navigation in `src/navigation/RootNavigator.jsx`
3. Use store hooks for state management

Example:

```jsx
import { useAuthStore } from "../stores/authStore";

export default function NewScreen() {
  const { user, logout } = useAuthStore();
  // ... component code
}
```

### Making API Calls

Use the predefined services in `src/services/`:

```jsx
import { productService } from "../services/products.service";

const products = await productService.getProducts();
```

### State Management with Zustand

```jsx
import { useAuthStore } from "../stores/authStore";

export default function MyComponent() {
  const { user, login, isLoading } = useAuthStore();

  const handleLogin = async (email, password) => {
    await login(email, password);
  };
}
```

## Common Tasks

### Handle Loading States

Use the `isLoading` flag from stores:

```jsx
{
  isLoading ? <ActivityIndicator /> : <Content />;
}
```

### Error Handling

Errors are caught and stored in stores:

```jsx
const { error, clearError } = useAuthStore();
```

### Network Configuration

**For Android Emulator:**

- Use `192.168.1.1` to refer to localhost on the host machine
- Make sure backend is running and accessible

**For Physical Device:**

- Both device and machine must be on the same network
- Use machine's local IP address (e.g., `192.168.x.x`)
- Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)

## API Endpoints Used

### Auth

- POST `/api/v1/auth/login`
- POST `/api/v1/auth/register`
- POST `/api/v1/auth/logout`
- POST `/api/v1/auth/verify-email`
- POST `/api/v1/auth/reset-password`

### Products

- GET `/api/v1/products`
- GET `/api/v1/products/:id`
- GET `/api/v1/categories`
- GET `/api/v1/kitchens`

### Cart

- GET `/api/v1/cart`
- POST `/api/v1/cart/add`
- PUT `/api/v1/cart/:id`
- DELETE `/api/v1/cart/:id`
- POST `/api/v1/cart/clear`

### Orders

- GET `/api/v1/orders`
- GET `/api/v1/orders/:id`
- POST `/api/v1/orders`
- POST `/api/v1/orders/:id/cancel`

## Troubleshooting

### Connection Issues

**"Cannot reach backend server"**

- Check if backend is running on the correct port
- Verify the URL in `.env.local`
- For emulator, use `192.168.1.1` instead of `localhost`
- Clear app cache and restart

### Build Issues

**"Module not found"**

- Run `npm install` again
- Clear Metro cache: `expo start --clear`

**"Token not working"**

- Check AsyncStorage is working
- Verify backend token endpoint
- Check token expiration in backend

## Development Notes

- App uses Zustand for global state (auth, cart, products)
- All API calls have automatic token attachment
- Errors from API are caught and displayed to users
- Cart state persists across sessions
- App initializes auth state on startup

## Future Enhancements

- [ ] Push notifications for order updates
- [ ] Real-time order tracking with maps integration
- [ ] Saved addresses and quick checkout
- [ ] Order ratings and reviews
- [ ] Favorite items and kitchens
- [ ] Promotional codes and discounts
- [ ] Multiple payment methods (Stripe, GCash, etc.)
- [ ] Offline mode support

## Contributing

When adding new features:

1. Create services for API calls
2. Create/update stores for state management
3. Create screens or components
4. Update navigation if needed
5. Test on Android emulator and physical device

## Support

For issues or questions, contact: support@unclebrew.com

## License

Proprietary - Uncle Brew Cebu
