import { Link } from "react-router-dom";

function About() {
  return (
    <div className="about-page">

      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="section-label">
            ABOUT PAWFECT HOME
          </span>

          <h1>
            Helping pets find
            <span> their forever homes.</span>
          </h1>

          <p>
            Pawfect Home is a pet adoption platform designed to
            make the adoption journey simpler, more transparent
            and more meaningful for both people and animals.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="about-mission">
        <div className="about-image">
          <img
            src="https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?auto=format&fit=crop&w=1000&q=80"
            alt="Person caring for a dog"
          />
        </div>

        <div className="about-content">
          <span className="section-label">
            OUR MISSION
          </span>

          <h2>
            More than adoption.
            <span> It's a connection.</span>
          </h2>

          <p>
            Finding a pet should be about more than simply choosing
            a photo. Every animal has a personality, history,
            health needs and a unique story.
          </p>

          <p>
            Pawfect Home brings this information together so
            potential adopters can make informed decisions and
            shelters can connect their animals with suitable
            families.
          </p>

          <Link to="/pets" className="primary-btn">
            Meet Our Pets →
          </Link>
        </div>
      </section>

      {/* Values */}
      <section className="values-section">
        <div className="section-heading centered">
          <span className="section-label">
            WHAT WE BELIEVE IN
          </span>

          <h2>Built Around Responsible Adoption</h2>

          <p>
            Every part of Pawfect Home is designed with pets and
            their future families in mind.
          </p>
        </div>

        <div className="values-grid">

          <div className="value-card">
            <div className="value-icon">❤️</div>

            <h3>Pets Come First</h3>

            <p>
              We believe every pet deserves safety, care,
              respect and a loving forever home.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon">🔍</div>

            <h3>Transparency</h3>

            <p>
              Detailed profiles help adopters understand a pet's
              health, personality and individual needs.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon">🤝</div>

            <h3>Better Matches</h3>

            <p>
              Adoption applications help shelters find families
              whose lifestyle is suitable for each pet.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon">🏠</div>

            <h3>Forever Homes</h3>

            <p>
              Our goal is not just an adoption, but a lasting
              relationship between pets and their families.
            </p>
          </div>

        </div>
      </section>

      {/* Platform Features */}
      <section className="platform-section">
        <div className="platform-content">

          <span className="section-label">
            THE PAWFECT HOME PLATFORM
          </span>

          <h2>
            Everything you need for a
            <span> responsible adoption.</span>
          </h2>

          <div className="platform-list">

            <div className="platform-item">
              <span>01</span>

              <div>
                <h3>Discover Pets</h3>

                <p>
                  Browse pets using search and filters to find
                  companions that match your lifestyle.
                </p>
              </div>
            </div>

            <div className="platform-item">
              <span>02</span>

              <div>
                <h3>Understand Their Needs</h3>

                <p>
                  View detailed information about personality,
                  health, training, diet and special needs.
                </p>
              </div>
            </div>

            <div className="platform-item">
              <span>03</span>

              <div>
                <h3>Apply to Adopt</h3>

                <p>
                  Submit an adoption application and provide
                  information about your home and experience.
                </p>
              </div>
            </div>

            <div className="platform-item">
              <span>04</span>

              <div>
                <h3>Connect With Shelters</h3>

                <p>
                  Stay connected with shelters throughout the
                  adoption process.
                </p>
              </div>
            </div>

          </div>
        </div>

        <div className="platform-image">
          <img
            src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=80"
            alt="Dogs enjoying time together"
          />
        </div>
      </section>

      {/* Stats */}
      <section className="about-stats">

        <div>
          <strong>20+</strong>
          <span>Pets Listed</span>
        </div>

        <div>
          <strong>10+</strong>
          <span>Partner Shelters</span>
        </div>

        <div>
          <strong>100+</strong>
          <span>Successful Adoptions</span>
        </div>

        <div>
          <strong>1</strong>
          <span>Shared Mission</span>
        </div>

      </section>

      {/* CTA */}
      <section className="about-cta">
        <span>READY TO MAKE A DIFFERENCE?</span>

        <h2>
          Someone special may be waiting for you.
        </h2>

        <p>
          Explore our available pets and discover your next
          best friend.
        </p>

        <Link to="/pets" className="cta-btn">
          Find Your Companion 🐾
        </Link>
      </section>
      {/* Pawfect Home Footer */}
      <footer className="pawfect-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <h2>Pawfect Home</h2>
            <p>
              Every animal deserves safety, care, and a place
              to call home. Help us make responsible adoption
              possible for every pet.
            </p>
          </div>

          <div className="footer-links">
            <h3>Explore</h3>
            <Link to="/">Home</Link>
            <Link to="/pets">Meet Our Pets</Link>
            <Link to="/about">About Us</Link>
          </div>

          <div className="footer-contact">
            <h3>Contact Us</h3>
            <p>
              <strong>Email</strong>
              <br />
              pawfecthome247@gmail.com
            </p>
            <p>
              <strong>Address</strong>
              <br />
              Vaddeswaram, Guntur, Andhra Pradesh, 522502.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Pawfect Home. All rights reserved.</p>
          <p>Find a friend. Give a home.</p>
        </div>
      </footer>

    </div>
  );
}

export default About;