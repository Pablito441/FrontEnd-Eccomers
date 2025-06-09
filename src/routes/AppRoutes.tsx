import { Navigate, Route, Routes } from "react-router-dom";
import { Landing } from "../components/screens/Landing/Landing";
import { Catalog } from "../components/screens/Catalog/Catalog";
import { ProductDetails } from "../components/screens/ProductDetails/ProductDetails";
import { LoginRegister } from "../components/screens/LoginRegister/LoginRegister";
import { ShoppingCart } from "../components/screens/ShoppingCart/ShoppingCart";
import { TermsAndConditions } from "../components/screens/TermsAndConditions/TermsAndConditions";
import { PrivacyPolicies } from "../components/screens/PrivacyPolicies/PrivacyPolicies";
import ProductSizeTest from "../components/screens/prueba";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/pruebas" element={<ProductSizeTest />} />
      {/* /pruebas es solo para probar las tablas con id compuestos */}
      <Route path="/privacypolicies" element={<PrivacyPolicies />} />
      <Route path="/termsandconditions" element={<TermsAndConditions />} />
      <Route path="/shoppingCart" element={<ShoppingCart />} />
      <Route path="/loginRegister" element={<LoginRegister />} />
      <Route path="/productDetail" element={<ProductDetails />} />
      <Route path="/catalog" element={<Catalog />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="*" element={<Navigate to="/landing" replace />} />
    </Routes>
  );
};
