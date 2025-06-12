import { Navigate, Route, Routes } from "react-router-dom";
import { Landing } from "../components/screens/Landing/Landing";
import { Catalog } from "../components/screens/Catalog/Catalog";
import { ProductDetails } from "../components/screens/ProductDetails/ProductDetails";
import { LoginRegister } from "../components/screens/LoginRegister/LoginRegister";
import { Login } from "../components/screens/Login/Login";
import { Register } from "../components/screens/Register/Register";
import { ShoppingCart } from "../components/screens/ShoppingCart/ShoppingCart";
import { TermsAndConditions } from "../components/screens/TermsAndConditions/TermsAndConditions";
import { PrivacyPolicies } from "../components/screens/PrivacyPolicies/PrivacyPolicies";
import ProductSizeTest from "../components/screens/prueba";
import { ScrollToTop } from "../components/ScrollToTop";
import { ContinueShopping } from "../components/screens/ContinueShopping/ContinueShopping";
import { PurchaseOrder } from "../components/screens/PurchaseOrder/PurchaseOrder";
import { UserCount } from "../components/screens/UserCount/UserCount";
import { PaymentInstructions } from "../components/screens/PaymentInstructions/PaymentInstructions";
import { AdminProducts } from "../pages/admin/AdminProducts";
import { ProtectedRoute } from "../components/ProtectedRoute";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/pruebas" element={<ProductSizeTest />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin={true}>
            <ScrollToTop>
              <AdminProducts />
            </ScrollToTop>
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment-instructions/:orderId"
        element={
          <ProtectedRoute>
            <ScrollToTop>
              <PaymentInstructions />
            </ScrollToTop>
          </ProtectedRoute>
        }
      />
      <Route
        path="/userCount"
        element={
          <ProtectedRoute>
            <ScrollToTop>
              <UserCount />
            </ScrollToTop>
          </ProtectedRoute>
        }
      />
      <Route
        path="/purchaseOrder"
        element={
          <ProtectedRoute>
            <ScrollToTop>
              <PurchaseOrder />
            </ScrollToTop>
          </ProtectedRoute>
        }
      />
      <Route
        path="/continueShopping"
        element={
          <ScrollToTop>
            <ContinueShopping />
          </ScrollToTop>
        }
      />
      <Route
        path="/privacypolicies"
        element={
          <ScrollToTop>
            <PrivacyPolicies />
          </ScrollToTop>
        }
      />
      <Route
        path="/termsandconditions"
        element={
          <ScrollToTop>
            <TermsAndConditions />
          </ScrollToTop>
        }
      />
      <Route
        path="/shoppingCart"
        element={
          <ScrollToTop>
            <ShoppingCart />
          </ScrollToTop>
        }
      />
      <Route
        path="/login"
        element={
          <ScrollToTop>
            <Login />
          </ScrollToTop>
        }
      />
      <Route
        path="/register"
        element={
          <ScrollToTop>
            <Register />
          </ScrollToTop>
        }
      />
      <Route
        path="/loginRegister"
        element={
          <ScrollToTop>
            <LoginRegister />
          </ScrollToTop>
        }
      />
      <Route path="/productDetail" element={<ProductDetails />} />
      <Route
        path="/catalog"
        element={
          <ScrollToTop>
            <Catalog />
          </ScrollToTop>
        }
      />
      <Route
        path="/landing"
        element={
          <ScrollToTop>
            <Landing />
          </ScrollToTop>
        }
      />
      <Route path="*" element={<Navigate to="/landing" replace />} />
    </Routes>
  );
};
