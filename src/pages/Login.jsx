import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setError("");
  };

  
const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!formData.email.trim() || !formData.password) {
    setError("Please enter your email and password.");
    return;
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email.trim(),
        password: formData.password,
      }),
    });

    const data = await response.json();

    
if (!response.ok) {
  setError(data.message || "Login failed. Please try again.");
  return;
}

localStorage.setItem("pawfectToken", data.token);
localStorage.setItem("pawfectUser", JSON.stringify(data.user));

navigate("/pets", {
  state: { user: data.user, message: data.message },
});

  } catch (error) {
    setError(
      "Cannot connect to the server. Please make sure the backend is running."
    );
  }
};

  return (
    <div className="auth-page">
      <div className="auth-container">

        <div className="auth-image">
          <img
            src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=80"
            alt="Dogs together"
          />

          <div className="auth-image-content">
            <span>🐾 PAWFECT HOME</span>

            <h2>
              Every pet deserves
              <br />
              a loving home.
            </h2>

            <p>
              Find your companion, discover their story and
              begin your adoption journey.
            </p>
          </div>
        </div>

        <div className="auth-form-container">
          <div className="auth-form">

            <Link to="/" className="auth-logo">
              🐾 Pawfect Home
            </Link>

            <span className="section-label">
              WELCOME BACK
            </span>

            <h1>Sign in to Pawfect Home</h1>

            <p className="auth-description">
              Log in to manage your applications and connect
              with shelters.
            </p>

            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label>Email Address</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <div className="password-label">
                  <label>Password</label>

                  <button
                    type="button"
                    className="forgot-btn"
                  >
                    Forgot password?
                  </button>
                </div>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                className="submit-btn"
              >
                Sign In
              </button>
            </form>

            <div className="auth-divider">
              <span>OR</span>
            </div>

            <p className="auth-switch">
              Don't have an account?{" "}
              <Link to="/register">
                Create an account
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;