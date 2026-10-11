import { Link } from "react-router-dom";
import PetCard from "../components/PetCard";
import pets from "../data/pets";

function Home() {
  const featuredPets = pets.slice(0, 6);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-badge">🐾 Every pet deserves a loving home</span>

            <h1>
              Find Your New
              <span> Best Friend</span>
            </h1>

            <p>
              Pawfect Home helps you discover loving pets looking for their
              forever families. Browse, learn their stories and start your
              adoption journey.
            </p>

            <div className="hero-buttons">
              <Link to="/pets" className="primary-btn">
                Find a Pet 🐶
              </Link>

              <Link to="/about" className="secondary-btn">
                Learn More
              </Link>
            </div>
          </div>

          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=1000&q=80"
              alt="Happy dog"
            />

            <div className="hero-floating-card">
              <span className="floating-icon">❤️</span>
              <div>
                <strong>20+ Pets</strong>
                <small>Looking for homes</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="stats-section">
        <div className="stat">
          <strong>20+</strong>
          <span>Pets Listed</span>
        </div>

        <div className="stat">
          <strong>10+</strong>
          <span>Trusted Shelters</span>
        </div>

        <div className="stat">
          <strong>100+</strong>
          <span>Happy Adoptions</span>
        </div>

        <div className="stat">
          <strong>24/7</strong>
          <span>Pet Profiles</span>
        </div>
      </section>

      {/* Featured Pets */}
      <section className="section">
        <div className="section-heading">
          <div>
            <span className="section-label">MEET YOUR MATCH</span>
            <h2>Pets Looking for You</h2>
            <p>
              Every pet has a unique personality and a story waiting for its
              next chapter.
            </p>
          </div>

          <Link to="/pets" className="view-all">
            View All Pets →
          </Link>
        </div>

        <div className="pet-grid">
          {featuredPets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      </section>

      {/* How Adoption Works */}
      <section className="how-section">
        <div className="section-heading centered">
          <span className="section-label">SIMPLE & CARING</span>
          <h2>How Adoption Works</h2>
          <p>
            Finding your perfect companion doesn't have to be complicated.
          </p>
        </div>

        <div className="steps">
          <div className="step">
            <div className="step-icon">🔎</div>
            <span>01</span>
            <h3>Find a Pet</h3>
            <p>
              Browse detailed profiles and discover pets that match your
              lifestyle.
            </p>
          </div>

          <div className="step">
            <div className="step-icon">❤️</div>
            <span>02</span>
            <h3>Learn Their Story</h3>
            <p>
              Explore health records, personality, temperament and adoption
              requirements.
            </p>
          </div>

          <div className="step">
            <div className="step-icon">📝</div>
            <span>03</span>
            <h3>Apply to Adopt</h3>
            <p>
              Complete an adoption application and tell us about your home.
            </p>
          </div>

          <div className="step">
            <div className="step-icon">🏠</div>
            <span>04</span>
            <h3>Welcome Home</h3>
            <p>
              Meet your new companion and begin your journey together.
            </p>
          </div>
        </div>
      </section>

      {/* Why Pawfect Home */}
      <section className="why-section">
        <div className="why-image">
          <img
            src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=900&q=80"
            alt="Person spending time with a dog"
          />
        </div>

        <div className="why-content">
          <span className="section-label">WHY PAWFECT HOME?</span>

          <h2>
            Adoption is more than
            <span> finding a pet.</span>
          </h2>

          <p>
            It's about creating a lifelong connection between people and
            animals. We bring important information together so adopters can
            make informed and responsible decisions.
          </p>

          <div className="feature-list">
            <div>
              <span>✓</span>
              <p>
                <strong>Detailed Pet Profiles</strong>
                <br />
                Know the pet's personality, health and needs.
              </p>
            </div>

            <div>
              <span>✓</span>
              <p>
                <strong>Verified Information</strong>
                <br />
                Keep important vaccination and health details organized.
              </p>
            </div>

            <div>
              <span>✓</span>
              <p>
                <strong>Responsible Adoption</strong>
                <br />
                Applications help shelters find suitable families.
              </p>
            </div>
          </div>

          <Link to="/about" className="primary-btn">
            Discover Pawfect Home
          </Link>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div>
          <span>READY TO CHANGE A LIFE?</span>
          <h2>Your perfect companion may be waiting.</h2>
          <p>
            Start exploring pets and take the first step toward giving one a
            forever home.
          </p>

          <Link to="/pets" className="cta-btn">
            Explore Available Pets →
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;