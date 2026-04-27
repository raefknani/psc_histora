import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Psc from "./Psc";
import PropertyDetail from "./PropertyDetail";
import LearnMore from "./LearnMore";
import Contact from "./Contact";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Psc />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="/learn-more" element={<LearnMore />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
