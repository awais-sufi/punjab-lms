import { CtaBand } from "./components/CtaBand";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { LmsProvider } from "./context/LmsContext";
import { AppRoutes } from "./routes/AppRoutes";
import { ToastContainer } from "./ToastSystem";
import "./App.css";

function App() {
  return (
    <LmsProvider>
      <main className="site-shell">
        <Header />
        <AppRoutes />
        <CtaBand />
        <Footer />
        <ToastContainer />
      </main>
    </LmsProvider>
  );
}

export default App;
