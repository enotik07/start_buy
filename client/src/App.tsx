import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import { Navbar } from "./layout/Navbar";
import { Footer } from "./layout/Footer";
import { LoginPage } from "./pages/LoginPage";
import { LoginForm } from "./components/auth/LoginForm";
import { RegisterForm } from "./components/auth/RegisterForm";
import AdminCategories from "./pages/AdminCategories";
import AdminProducts from "./pages/AdminProducts";
import AdminDashboard from "./pages/AdminDashboard";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CategoryPage from "./pages/CategoryPage";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import { useAppSelector } from "./store";

function App() {
  const { isLogged, isAdmin } = useAppSelector((state) => state.authReducer);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box minHeight={"100vh"} width={"100%"} bgcolor={"background.default"}>
          <Navbar />
          <Routes>
            {!isLogged && (
              <Route path="/" element={<LoginPage />}>
                <Route path="login" element={<LoginForm />} />
                <Route path="register" element={<RegisterForm />} />
              </Route>
            )}
            {isAdmin ? (
              <>
                <Route path="categories" element={<AdminCategories />} />
                <Route path="products" element={<AdminProducts />} />
                <Route index element={<AdminDashboard />} />
              </>
            ) : (
              <>
                <Route index element={<HomePage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/category/:id" element={<CategoryPage />} />
              </>
            )}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Footer />
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
