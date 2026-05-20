import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import Loader from "./components/Loader";
import CookieConsent from "./components/CookieConsent";
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
      // Respect user's cookie consent
      const consent = localStorage.getItem("cookieConsent");
      if (consent !== "true") return;

      // Prevent duplicate tracking in the same session
      if (sessionStorage.getItem("visitTracked") === "true") return;

      if (!supabase) return;

      try {
        const { error } = await supabase
          .from('visits')
          .insert([
            { 
              path: window.location.pathname,
              user_agent: navigator.userAgent 
            }
          ]);
        
        if (error) {
          console.error('Error tracking visit:', error);
        } else {
          sessionStorage.setItem("visitTracked", "true");
        }
      } catch (err) {
        console.error('Failed to track visit:', err);
      }
    };

    trackVisit();

    // Listen for real-time consent updates
    window.addEventListener("consentGiven", trackVisit);
    
    return () => window.removeEventListener("consentGiven", trackVisit);
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
      <CookieConsent />
    </Router>
  );
}

export default App;