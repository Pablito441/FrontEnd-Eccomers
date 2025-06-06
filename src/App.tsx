import { Footer } from "./components/ui/Footer/Footer";
import { Navbar } from "./components/ui/Navbar/Navbar";
import { AppRouter } from "./routes/AppRoutes";

function App() {
  return (
    <div className="containerApp">
      <Navbar />
      <AppRouter />
      <Footer />
    </div>
  );
}

export default App;
