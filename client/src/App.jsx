import { BrowserRouter } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main style={{ padding: "6vw", minHeight: "50vh" }}>
        <h1>VINYL.</h1>
        <p>The pages will go here.</p>
      </main>
      <Footer />
    </BrowserRouter>
  );
}