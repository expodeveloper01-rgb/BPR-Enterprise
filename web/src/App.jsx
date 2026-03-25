import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import Header from "@/components/header";
import AuthHeader from "@/components/auth-header";
import Footer from "@/components/footer";
import HomePage from "@/pages/Home";
import MenuPage from "@/pages/Menu";
import ProductDetailPage from "@/pages/Menu/ProductDetail";
import CartPage from "@/pages/Cart";
import OrdersPage from "@/pages/Orders";
import AboutPage from "@/pages/About";
import SignInPage from "@/pages/Auth/SignIn";
import SignUpPage from "@/pages/Auth/SignUp";
import ForgotPasswordPage from "@/pages/Auth/ForgotPassword";
import ResetPasswordPage from "@/pages/Auth/ResetPassword";
import NotFoundPage from "@/pages/NotFound";
import SellerDashboard from "@/pages/Seller";
import SellerProducts from "@/pages/Seller/Products";
import ProductForm from "@/pages/Seller/Products/ProductForm";
import SellerOrders from "@/pages/Seller/Orders";
import SellerUsers from "@/pages/Seller/Users";
import SellerCategories from "@/pages/Seller/Categories";
import SellerSizes from "@/pages/Seller/Sizes";
import SellerKitchens from "@/pages/Seller/Kitchens";
import SellerCuisines from "@/pages/Seller/Cuisines";
import CheckoutPage from "@/pages/Checkout";
import BeLaPaRiPage from "@/pages/BeLaPaRi";
import BeLaPaRiAbout from "@/pages/BeLaPaRi/About";
import BeLaPaRiContact from "@/pages/BeLaPaRi/Contact";
import BrowseStores from "@/pages/BeLaPaRi/BrowseStores";
import StoresDashboard from "@/pages/BeLaPaRi/Dashboard";
import { useStore } from "@/context/StoreContext";
import { BrandProvider } from "@/context/BrandContext";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const isSeller = (pathname) => pathname.startsWith("/seller");

const isAuthRoute = (pathname) => {
  return (
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password")
  );
};

function AppRoutes() {
  const { pathname } = useLocation();
  const seller = isSeller(pathname);
  const authRoute = isAuthRoute(pathname);

  if (seller) {
    return (
      <>
        <ScrollToTop />
        <Toaster position="top-center" />
        <Routes>
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/seller/products" element={<SellerProducts />} />
          <Route path="/seller/products/new" element={<ProductForm />} />
          <Route
            path="/seller/products/:productId/edit"
            element={<ProductForm />}
          />
          <Route path="/seller/orders" element={<SellerOrders />} />
          <Route path="/seller/categories" element={<SellerCategories />} />
          <Route path="/seller/sizes" element={<SellerSizes />} />
          <Route path="/seller/kitchens" element={<SellerKitchens />} />
          <Route path="/seller/cuisines" element={<SellerCuisines />} />
          <Route path="/seller/users" element={<SellerUsers />} />
        </Routes>
      </>
    );
  }

  return (
    <>
      <ScrollToTop />
      <Toaster position="top-center" />
      <div className="flex flex-col min-h-screen">
        {authRoute ? <AuthHeader /> : <Header />}
        <main
          className={`flex-1 flex flex-col ${authRoute ? "pt-16" : "pt-0"}`}
        >
          <Routes>
            <Route path="/" element={<BeLaPaRiPage />} />
            <Route path="/uncle-brew" element={<HomePage />} />
            <Route path="/uncle-brew/menu" element={<MenuPage />} />
            <Route
              path="/uncle-brew/menu/:productId"
              element={<ProductDetailPage />}
            />
            <Route path="/uncle-brew/cart" element={<CartPage />} />
            <Route path="/uncle-brew/checkout" element={<CheckoutPage />} />
            <Route path="/uncle-brew/orders" element={<OrdersPage />} />
            <Route path="/uncle-brew/about" element={<AboutPage />} />
            <Route path="/about" element={<BeLaPaRiAbout />} />
            <Route path="/contact" element={<BeLaPaRiContact />} />
            <Route path="/browse-stores" element={<BrowseStores />} />
            <Route path="/stores" element={<StoresDashboard />} />
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        {!authRoute && <Footer />}
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <BrandProvider>
        <AppRoutes />
      </BrandProvider>
    </BrowserRouter>
  );
}

export default App;
