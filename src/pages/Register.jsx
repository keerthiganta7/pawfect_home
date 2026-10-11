import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
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

  if (
    !formData.fullName.trim() ||
    !formData.email.trim() ||
    !formData.phone ||
    !formData.password ||
    !formData.confirmPassword
  ) {
    setError("Please fill in all required fields.");
    return;
  }

  if (!/^[0-9]{10}$/.test(formData.phone)) {
    setError("Phone number must contain exactly 10 digits.");
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  if (formData.password.length < 6) {
    setError("Password must contain at least 6 characters.");
    return;
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone,
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Registration failed. Please try again.");
      return;
    }

    navigate("/login", {
      state: { message: data.message },
    });
  } catch (error) {
    setError("Cannot connect to the server. Please make sure the backend is running.");
  }
};

  return (
    <div className="auth-page">
      <div className="auth-container">

        {/* Image Side */}
        <div className="auth-image register-image">
          <img
            src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1000&q=80"
            alt="Happy dog"
          />

          <div className="auth-image-content">
            <span>🐾 JOIN PAWFECT HOME</span>

            <h2>
              Start your journey
              <br />
              toward a new friend.
            </h2>

            <p>
              Create an account to save your favorite pets,
              apply for adoption and stay connected with shelters.
            </p>
          </div>
        </div>

        {/* Form Side */}
        <div className="auth-form-container">
          <div className="auth-form">

            <Link to="/" className="auth-logo">
              🐾 Pawfect Home
            </Link>

            <span className="section-label">
              CREATE ACCOUNT
            </span>

            <h1>Join Pawfect Home</h1>

            <p className="auth-description">
              Create your account and begin your adoption journey.
            </p>

            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label>Full Name *</label>

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>

                <input
  type="tel"
  name="phone"
  value={formData.phone}
  onChange={(e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);

    setFormData({
      ...formData,
      phone: digits,
    });

    setError("");
  }}
  placeholder="Enter 10-digit mobile number"
  inputMode="numeric"
  maxLength={10}
  pattern="[0-9]{10}"
  title="Enter exactly 10 digits"
  required
/>

              </div>

              <div className="form-group">
                <label>Password *</label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirm Password *</label>

                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <div className="terms-box">
                <input
                  type="checkbox"
                  id="terms"
                  required
                />

                <label htmlFor="terms">
                  I agree to the Pawfect Home terms and
                  responsible adoption guidelines.
                </label>
              </div>

              <button
                type="submit"
                className="submit-btn"
              >
                Create My Account 🐾
              </button>
            </form>

            <p className="auth-switch">
              Already have an account?{" "}
              <Link to="/login">
                Sign in
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;