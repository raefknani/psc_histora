import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import Loader from "./components/Loader";
import { supabase } from "./utils/supabase";

// Lazy-loaded pages
const Psc = lazy(() => import("./Psc"));
const PropertyDetail = lazy(() => import("./PropertyDetail"));
const LearnMore = lazy(() => import("./LearnMore"));
const Contact = lazy(() => import("./Contact"));
const FindUs = lazy(() => import("./FindUs"));

// Premium loading fallback in foreground

function App() {
  useEffect(() => {
    const trackVisit = async () => {
      if (!supabase) return;

      try {
        // Log the visit. We only log once per session/mount.
        const { error } = await supabase
          .from('visits')
          .insert([
            { 
              path: window.location.pathname,
              user_agent: navigator.userAgent 
            }
          ]);
        
        if (error) console.error('Error tracking visit:', error);
      } catch (err) {
        console.error('Failed to track visit:', err);
      }
    };

    trackVisit();
  }, []);

  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Psc />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/find" element={<FindUs />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;