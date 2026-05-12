import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy-loaded pages
const Psc = lazy(() => import("./Psc"));
const PropertyDetail = lazy(() => import("./PropertyDetail"));
const LearnMore = lazy(() => import("./LearnMore"));
const Contact = lazy(() => import("./Contact"));

// Premium loading fallback in foreground

function App() {
  return (
    <Router>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Psc />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;