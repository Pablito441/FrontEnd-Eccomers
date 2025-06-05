import { Navigate, Route, Routes } from "react-router-dom";
import { Landing } from "../components/screens/Landing/Landing";
import { Catalog } from "../components/screens/Catalog/Catalog";
import { ProductDetails } from "../components/screens/ProductDetails/ProductDetails";
import { LoginRegister } from "../components/screens/LoginRegister/LoginRegister";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/loginRegister" element={<LoginRegister />} />
      <Route path="/productDetail" element={<ProductDetails />} />
      <Route path="/catalog" element={<Catalog />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="*" element={<Navigate to="/landing" replace />} />
    </Routes>
  );
};
