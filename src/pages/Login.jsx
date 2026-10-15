
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetStep, setResetStep] = useState(0);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const email = formData.email.trim().toLowerCase();
  const apiURL = import.meta.env.VITE_API_URL;

  const passwordIsValid = (password) =>
    password.length >= 8 &&
    /[A-Za-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiURL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
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
    } catch {
      setError("Cannot connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Enter your email address first.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiURL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Could not process the request.");
        return;
      }

      setResetStep(1);
      setMessage(data.message);
    } catch {
      setError("Cannot connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyResetOTP = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit verification code.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiURL}/api/auth/verify-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Code verification failed.");
        return;
      }

      setResetStep(2);
      setMessage(data.message);
    } catch {
      setError("Cannot connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!passwordIsValid(newPassword)) {
      setError(
        "Password must be at least 8 characters and include a letter, a number, and a special character."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiURL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Password reset failed.");
        return;
      }

      setResetStep(0);
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setFormData((previous) => ({ ...previous, password: "" }));
      setMessage(data.message || "Password reset successfully. Please log in.");
    } catch {
      setError("Cannot connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendResetOTP = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${apiURL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Could not resend the code.");
        return;
      }

      setOtp("");
      setMessage(data.message);
    } catch {
      setError("Cannot connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const returnToLogin = () => {
    setResetStep(0);
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setMessage("");
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
              {resetStep === 0 ? "WELCOME BACK" : "ACCOUNT RECOVERY"}
            </span>

            <h1>
              {resetStep === 0
                ? "Sign in to Pawfect Home"
                : resetStep === 1
                ? "Verify your email"
                : "Create a new password"}
            </h1>

            <p className="auth-description">
              {resetStep === 0
                ? "Log in to manage your applications and connect with shelters."
                : resetStep === 1
                ? `Enter the 6-digit reset code sent to ${email}.`
                : "Choose a strong password for your account."}
            </p>

            {error && <div className="form-error">{error}</div>}

            {message && (
              <div className="form-success" role="status">
                {message}
              </div>
            )}

            {resetStep === 0 && (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="form-group">
                  <div className="password-label">
                    <label>Password</label>
                    <button
                      type="button"
                      className="forgot-btn"
                      onClick={handleForgotPassword}
                      disabled={loading}
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
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
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>
            )}

            {resetStep === 1 && (
              <form onSubmit={handleVerifyResetOTP}>
                <div className="form-group">
                  <label>Reset Code *</label>
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
                    required
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Verifying..." : "Verify Code"}
                </button>

                <button
                  type="button"
                  className="password-toggle"
                  onClick={handleResendResetOTP}
                  disabled={loading}
                  style={{ marginTop: "12px" }}
                >
                  Resend Code
                </button>

                <button
                  type="button"
                  className="password-toggle"
                  onClick={returnToLogin}
                  style={{ marginTop: "12px" }}
                >
                  Back to Login
                </button>
              </form>
            )}

            {resetStep === 2 && (
              <form onSubmit={handleResetPassword}>
                <div className="form-group">
                  <label>New Password *</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setError("");
                      }}
                      placeholder="Enter a new password"
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowNewPassword((value) => !value)}
                    >
                      {showNewPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <small>
                    At least 8 characters, including a letter, a number and a
                    special character.
                  </small>
                </div>

                <div className="form-group">
                  <label>Confirm New Password *</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError("");
                      }}
                      placeholder="Confirm your new password"
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowConfirmPassword((value) => !value)
                      }
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}

            {resetStep !== 0 && (
              <p className="auth-switch">
                Remembered your password?{" "}
                <button
                  type="button"
                  className="forgot-btn"
                  onClick={returnToLogin}
                >
                  Back to login
                </button>
              </p>
            )}

            {resetStep === 0 && (
              <>
                <div className="auth-divider">
                  <span>OR</span>
                </div>

                <p className="auth-switch">
                  Don't have an account?{" "}
                  <Link to="/register">Create an account</Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
