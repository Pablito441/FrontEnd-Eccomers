import { Footer } from "./components/ui/Footer/Footer";
import { Navbar } from "./components/ui/Navbar/Navbar";
import { AppRouter } from "./routes/AppRoutes";
import "./App.css";
function App() {
  return (
    <div className="containerApp">
      <div className="content">
        <Navbar />
        <AppRouter />
        <Footer />
      </div>
    </div>
  );
}

export default App;
