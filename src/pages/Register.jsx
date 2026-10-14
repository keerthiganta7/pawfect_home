
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

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setMessage("");
  };

  const passwordIsValid = (password) =>
    password.length >= 8 &&
    /[A-Za-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

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

    if (!passwordIsValid(formData.password)) {
      setError(
        "Password must be at least 8 characters and include a letter, a number, and a special character."
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: formData.fullName.trim(),
            email: formData.email.trim(),
            phone: formData.phone,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Could not send the verification code.");
        return;
      }

      setOtpSent(true);
      setMessage(data.message || "Verification code sent to your email.");
    } catch {
      setError("Cannot connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit verification code.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email.trim(),
            otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Verification failed.");
        return;
      }

      navigate("/login", {
        state: { message: data.message },
      });
    } catch {
      setError("Cannot connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/resend-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Could not resend the code.");
        return;
      }

      setOtp("");
      setMessage(data.message || "A new verification code has been sent.");
    } catch {
      setError("Cannot connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
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

        <div className="auth-form-container">
          <div className="auth-form">
            <Link to="/" className="auth-logo">
              🐾 Pawfect Home
            </Link>

            <span className="section-label">
              {otpSent ? "EMAIL VERIFICATION" : "CREATE ACCOUNT"}
            </span>

            <h1>{otpSent ? "Verify your email" : "Join Pawfect Home"}</h1>

            <p className="auth-description">
              {otpSent
                ? `Enter the 6-digit code sent to ${formData.email.trim()}.`
                : "Create your account and begin your adoption journey."}
            </p>

            {error && <div className="form-error">{error}</div>}

            {message && (
              <div className="form-success" role="status">
                {message}
              </div>
            )}

            {!otpSent ? (
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
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => {
                      const digits = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);

                      setFormData((previous) => ({
                        ...previous,
                        phone: digits,
                      }));

                      setError("");
                    }}
                    placeholder="Enter 10-digit mobile number"
                    inputMode="numeric"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password *</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <small>
                    At least 8 characters, including a letter, a number and a
                    special character.
                  </small>
                </div>

                <div className="form-group">
                  <label>Confirm Password *</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowConfirmPassword((value) => !value)
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="terms-box">
                  <input type="checkbox" id="terms" required />
                  <label htmlFor="terms">
                    I agree to the Pawfect Home terms and responsible adoption
                    guidelines.
                  </label>
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? "Sending code..." : "Continue to Email Verification"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP}>
                <div className="form-group">
                  <label>Email Verification Code *</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                      setError("");
                    }}
                    placeholder="Enter 6-digit code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    pattern="[0-9]{6}"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify Email & Create Account"}
                </button>

                <button
                  type="button"
                  className="submit-btn"
                  onClick={handleResendOTP}
                  disabled={loading}
                  style={{ marginTop: "12px" }}
                >
                  Resend Verification Code
                </button>

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp("");
                    setError("");
                    setMessage("");
                  }}
                  disabled={loading}
                  style={{ marginTop: "12px" }}
                >
                  Back to registration
                </button>
              </form>
            )}

            <p className="auth-switch">
              Already have an account?{" "}
              <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
