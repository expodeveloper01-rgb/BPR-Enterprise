import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import HomePage from "@/pages/Home";
import MenuPage from "@/pages/Menu";
import ProductDetailPage from "@/pages/Menu/ProductDetail";
import CartPage from "@/pages/Cart";
import OrdersPage from "@/pages/Orders";
import AboutPage from "@/pages/About";
import SignInPage from "@/pages/Auth/SignIn";
import SignUpPage from "@/pages/Auth/SignUp";
import NotFoundPage from "@/pages/NotFound";
import SellerDashboard from "@/pages/Seller";
import SellerProducts from "@/pages/Seller/Products";
import ProductForm from "@/pages/Seller/Products/ProductForm";
import SellerOrders from "@/pages/Seller/Orders";
import SellerUsers from "@/pages/Seller/Users";
import CheckoutPage from "@/pages/Checkout";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const isSeller = (pathname) => pathname.startsWith("/seller");

function AppRoutes() {
  const { pathname } = useLocation();
  const seller = isSeller(pathname);

  return (
    <>
      <ScrollToTop />
      <Toaster position="top-center" />
      {seller ? (
        <Routes>
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/seller/products" element={<SellerProducts />} />
          <Route path="/seller/products/new" element={<ProductForm />} />
          <Route path="/seller/products/:productId/edit" element={<ProductForm />} />
          <Route path="/seller/orders" element={<SellerOrders />} />
          <Route path="/seller/users" element={<SellerUsers />} />
        </Routes>
      ) : (
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 flex flex-col pt-16">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/menu/:productId" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/sign-in/*" element={<SignInPage />} />
              <Route path="/sign-up/*" element={<SignUpPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
