import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import pets from "../data/pets";

function Adopt() {
  const { id } = useParams();

  const pet = pets.find((item) => item.id === Number(id));

  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    housing: "",
    experience: "",
    reason: "",
    message: "",
  });

  if (!pet) {
    return (
      <div className="not-found">
        <h1>Pet Not Found 🐾</h1>

        <p>
          We couldn't find the pet you are trying to adopt.
        </p>

        <Link to="/pets" className="primary-btn">
          Browse Pets
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/adoptions`, 
      {
        method: "POST",
        headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("pawfectToken")}`,
},
        body: JSON.stringify({
          petId: pet.id,
          petName: pet.name,
          shelter: pet.shelter,
          ...formData,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to submit application"
      );
    }

    console.log("Application saved:", data);

    setSubmitted(true);
  } catch (error) {
    console.error("Application submission error:", error);

    alert(
      "Sorry, your application could not be submitted. Please try again."
    );
  }
};

  if (submitted) {
    return (
      <div className="application-success">
        <div className="success-card">
          <div className="success-icon">❤️</div>

          <h1>Application Submitted!</h1>

          <p>
            Thank you, {formData.fullName || "for your interest"}.
          </p>

          <p>
            Your adoption application for <strong>{pet.name}</strong>{" "}
            has been received.
          </p>

          <p>
            The shelter will review your application and contact you
            using the details you provided.
          </p>

          <Link to="/pets" className="primary-btn">
            Continue Browsing Pets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="adopt-page">
      <div className="adopt-container">

        {/* Page Header */}
        <div className="adopt-header">
          <Link to={`/pets/${pet.id}`} className="back-link">
            ← Back to {pet.name}'s profile
          </Link>

          <span className="section-label">
            ADOPTION APPLICATION
          </span>

          <h1>Give {pet.name} a Forever Home</h1>

          <p>
            Tell us a little about yourself and the home you can
            provide for your new companion.
          </p>
        </div>

        <div className="adopt-layout">

          {/* Pet Summary */}
          <aside className="adopt-pet-card">
            <img src={pet.image} alt={pet.name} />

            <div className="adopt-pet-content">
              <span className="section-label">
                YOU ARE APPLYING FOR
              </span>

              <h2>{pet.name}</h2>

              <p>{pet.breed}</p>

              <div className="pet-info">
                <span>🎂 {pet.age}</span>
                <span>📍 {pet.location}</span>
              </div>

              <hr />

              <h3>Adoption Requirements</h3>

              <ul>
  {(Array.isArray(pet.adoptionRequirements)
    ? pet.adoptionRequirements
    : [pet.adoptionRequirements]
  ).map((requirement, index) => (
    <li key={index}>
      ✓ {requirement}
    </li>
  ))}
</ul>
            </div>
          </aside>

          {/* Application Form */}
          <form
            className="adoption-form"
            onSubmit={handleSubmit}
          >
            <div className="form-section">
              <h2>About You</h2>

              <p>
                Please provide accurate information so the shelter
                can contact you.
              </p>

              <div className="form-row">
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
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number *</label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>City *</label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Your city"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Your Home</h2>

              <div className="form-group">
                <label>What type of home do you live in? *</label>

                <select
                  name="housing"
                  value={formData.housing}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select your housing type
                  </option>

                  <option value="Apartment">
                    Apartment
                  </option>

                  <option value="Independent House">
                    Independent House
                  </option>

                  <option value="Villa">
                    Villa
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  Have you owned or cared for pets before? *
                </label>

                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Tell us about your previous pet experience..."
                  rows="4"
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h2>About the Adoption</h2>

              <div className="form-group">
                <label>
                  Why would you like to adopt {pet.name}? *
                </label>

                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Tell us why you think you are a good match..."
                  rows="5"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Anything else we should know?
                </label>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Additional information..."
                  rows="4"
                />
              </div>
            </div>

            <div className="form-notice">
              <span>🔒</span>

              <p>
                Your information will be used only for processing
                this adoption application.
              </p>
            </div>

            <button type="submit" className="submit-btn">
              Submit Adoption Application ❤️
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Adopt;