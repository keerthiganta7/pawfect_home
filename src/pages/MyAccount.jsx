
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function MyAccount() {
  const navigate = useNavigate();
  const token = localStorage.getItem("pawfectToken");

  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const loadAccount = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [profileResponse, applicationsResponse] =
          await Promise.all([
            fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
              headers,
            }),
            fetch(`${import.meta.env.VITE_API_URL}/api/adoptions/my`, {
              headers,
            }),
          ]);

        const profileData = await profileResponse.json();
        const applicationsData = await applicationsResponse.json();

        if (
          profileResponse.status === 401 ||
          applicationsResponse.status === 401
        ) {
          localStorage.removeItem("pawfectToken");
          localStorage.removeItem("pawfectUser");
          navigate("/login");
          return;
        }

        if (!profileResponse.ok) {
          throw new Error(
            profileData.message || "Unable to load your profile."
          );
        }

        if (!applicationsResponse.ok) {
          throw new Error(
            applicationsData.message ||
              "Unable to load adoption history."
          );
        }

        setUser({
          fullName: profileData.user.fullName || "",
          email: profileData.user.email || "",
          phone: profileData.user.phone || "",
          address: profileData.user.address || "",
          city: profileData.user.city || "",
          state: profileData.user.state || "",
          postalCode: profileData.user.postalCode || "",
        });

        setApplications(applicationsData.applications || []);
      } catch (err) {
        setError(err.message || "Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    loadAccount();
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullName: user.fullName,
            phone: user.phone,
            address: user.address,
            city: user.city,
            state: user.state,
            postalCode: user.postalCode,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update profile.");
      }

      setUser({
        fullName: data.user.fullName || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
        address: data.user.address || "",
        city: data.user.city || "",
        state: data.user.state || "",
        postalCode: data.user.postalCode || "",
      });

      localStorage.setItem(
        "pawfectUser",
        JSON.stringify({
          id: data.user._id,
          fullName: data.user.fullName,
          email: data.user.email,
          phone: data.user.phone,
        })
      );

      setMessage("Your profile has been updated successfully.");
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("pawfectToken");
    localStorage.removeItem("pawfectUser");
    navigate("/login");
  };

  if (loading) {
    return <div className="account-page">Loading your account...</div>;
  }

  return (
    <main className="account-page">
      <div className="account-container">
        <div className="account-header">
          <div>
            <span className="section-label">YOUR PAWFECT HOME</span>
            <h1>My Account</h1>
            <p>Manage your profile and track your adoption journey.</p>
          </div>

          <button
            type="button"
            className="submit-btn"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>

        {error && <div className="form-error">{error}</div>}
        {message && <p role="status">{message}</p>}

        <section className="account-section">
          <h2>Personal Information</h2>

          <form onSubmit={handleSave} className="account-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                name="fullName"
                value={user.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={user.email}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                name="phone"
                value={user.phone}
                onChange={handleChange}
                pattern="[0-9]{10}"
                maxLength={10}
                required
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                name="address"
                value={user.address}
                onChange={handleChange}
                placeholder="House number, street"
              />
            </div>

            <div className="form-group">
              <label>City</label>
              <input
                name="city"
                value={user.city}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>State</label>
              <input
                name="state"
                value={user.state}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Postal Code</label>
              <input
                name="postalCode"
                value={user.postalCode}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </section>

        <section className="account-section">
          <h2>My Adoption History</h2>

          {applications.length === 0 ? (
            <div className="account-empty">
              <p>You haven't submitted any adoption applications yet.</p>
              <Link to="/pets" className="submit-btn">
                Explore Pets
              </Link>
            </div>
          ) : (
            <div className="application-list">
              {applications.map((application) => (
                <article
                  className="application-card"
                  key={application._id}
                >
                  <h3>{application.petName}</h3>
                  <p>
                    <strong>Shelter:</strong>{" "}
                    {application.shelter || "Not specified"}
                  </p>
                  <p>
                    <strong>Submitted:</strong>{" "}
                    {application.submittedAt
                      ? new Date(
                          application.submittedAt
                        ).toLocaleDateString()
                      : "Date unavailable"}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {application.status || "Pending"}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default MyAccount;
