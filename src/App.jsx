import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Pets from "./pages/Pets";
import PetDetails from "./pages/PetDetails";
import About from "./pages/About";
import Adopt from "./pages/Adopt";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import MyAccount from "./pages/MyAccount";


function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pets" element={<Pets />} />
        <Route path="/pets/:id" element={<PetDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/adopt/:id" element={<Adopt />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<MyAccount />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;