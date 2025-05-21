import React, { useState, useEffect } from "react";
import { Link, useNavigate, Routes, Route, useLocation } from "react-router-dom";
import MagicLoginPage from "./MagicLoginPage";
import { useAuth } from "./AuthContext";
import ShellRunWeek from "./ShellRunWeek";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, login } = useAuth();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    const emailParam = query.get("email");

    if (token && emailParam) {
      fetch("/api/verify-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, email: emailParam }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Invalid or expired login link.");
          }
          return res.json();
        })
        .then(() => {
          login(emailParam);
          navigate("/");
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  }, [location, login, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/send-magic-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error("Failed to send magic link. Please try again.");
      }

      setMessageSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <div className="min-h-screen flex items-center justify-center bg-blue-300 px-4 sm:px-6">
            <Card className="w-full max-w-md shadow-xl bg-white">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-center mb-6 text-blue-800">Log In</h2>
                {user ? (
                  <div className="mb-4 text-center">
                    <p className="text-green-700">Logged in as {user.email}</p>
                    <Button onClick={logout} className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white">
                      Log Out
                    </Button>
                  </div>
                ) : messageSent ? (
                  <p className="text-center text-green-700">
                    A login link has been sent to your email. It will expire in 15 minutes.
                  </p>
                ) : (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-800">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mt-1 p-2 border border-gray-300 rounded"
                        required
                      />
                    </div>
                    {error && <p className="text-red-600 text-sm">{error}</p>}
                    <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700" disabled={loading}>
                      {loading ? "Sending..." : "Send Magic Link"}
                    </Button>
                  </form>
                )}
                {!user && (
                  <div className="text-center mt-4">
                    <Link to="/signup" className="text-blue-800 hover:underline">
                      Don't have an account? Sign up
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        }
      />
      <Route path="/magic-login" element={<MagicLoginPage />} />
      <Route
        path="/dashboard"
        element={
          <div className="min-h-screen bg-blue-100 p-4 sm:p-6">
            <h1 className="text-2xl font-bold text-center text-blue-800 mb-6">Shell Run Scheduling</h1>
            <React.Suspense fallback={<div className="text-center text-blue-800">Loading weeks...</div>}>
              <ShellRunWeek enableVolunteerEditing={true} currentUser={user} />
            </React.Suspense>
          </div>
        }
      />
    </Routes>
  );
}
