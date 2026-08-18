import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { supabase } from "./lib/supabase";

import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Experiences from "./pages/Experiences";
import Moments from "./pages/Moments";

// =====================================
// PROTECTED ADMIN ROUTE
// =====================================

function ProtectedAdmin() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    let mounted = true;

    // Check current Supabase session
    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error(
            "❌ Admin session error:",
            error
          );

          if (mounted) {
            setSession(null);
          }

          return;
        }

        if (mounted) {
          setSession(session);
        }
      } catch (error) {
        console.error(
          "❌ Authentication error:",
          error
        );

        if (mounted) {
          setSession(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkSession();

    // Listen for login/logout/session changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) {
          setSession(session);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#080808",
          color: "#ffffff",
          fontFamily:
            "Arial, sans-serif",
          fontSize: "16px",
        }}
      >
        Checking admin access...
      </div>
    );
  }

  // =====================================
  // NOT LOGGED IN
  // =====================================

  if (!session) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  // =====================================
  // AUTHENTICATED ADMIN
  // =====================================

  return <AdminDashboard />;
}

// =====================================
// APP
// =====================================

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =================================
            MAIN WEBSITE
        ================================= */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* =================================
            EXPERIENCES
        ================================= */}

        <Route
          path="/experiences"
          element={<Experiences />}
        />

        {/* =================================
            MOMENTS
        ================================= */}

        <Route
          path="/moments"
          element={<Moments />}
        />

        {/* =================================
            ADMIN LOGIN
        ================================= */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* =================================
            PROTECTED ADMIN DASHBOARD
        ================================= */}

        <Route
          path="/admin"
          element={<ProtectedAdmin />}
        />

        {/* =================================
            UNKNOWN ROUTE
        ================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;