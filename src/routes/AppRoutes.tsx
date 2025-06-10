import { Navigate, Route, Routes } from "react-router-dom";
import { Landing } from "../components/screens/Landing/Landing";
import { Catalog } from "../components/screens/Catalog/Catalog";
import { ProductDetails } from "../components/screens/ProductDetails/ProductDetails";
import { LoginRegister } from "../components/screens/LoginRegister/LoginRegister";
import { ShoppingCart } from "../components/screens/ShoppingCart/ShoppingCart";
import { TermsAndConditions } from "../components/screens/TermsAndConditions/TermsAndConditions";
import { PrivacyPolicies } from "../components/screens/PrivacyPolicies/PrivacyPolicies";
import ProductSizeTest from "../components/screens/prueba";
import { ScrollToTop } from "../components/ScrollToTop";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/pruebas" element={<ProductSizeTest />} />
      {/* /pruebas es solo para probar las tablas con id compuestos */}
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
