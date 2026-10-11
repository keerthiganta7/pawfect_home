import { Link, useParams } from "react-router-dom";
import pets from "../data/pets";

function PetDetails() {
  const { id } = useParams();

  const pet = pets.find((item) => item.id === Number(id));

  if (!pet) {
    return (
      <div className="not-found">
        <h1>🐾</h1>
        <h2>Pet Not Found</h2>
        <p>Sorry, we couldn't find this pet.</p>

        <Link to="/pets" className="primary-btn">
          Back to Pets
        </Link>
      </div>
    );
  }

  return (
    <div className="pet-details-page">

      <div className="pet-details">

        {/* PET IMAGE */}
        <div>
          <img
            src={pet.image}
            alt={`${pet.name} - ${pet.breed}`}
            className="pet-details-image"
          />
        </div>

        {/* PET INFORMATION */}
        <div className="pet-details-content">

          <span className="section-label">
            {pet.adoptionStatus}
          </span>

          <h1>{pet.name}</h1>

          <h3>{pet.breed}</h3>

          <p>{pet.story}</p>

          <h2>🐾 Basic Information</h2>

          <div className="pet-detail-list">

            <div className="pet-detail-item">
              <strong>Species</strong>
              {pet.species}
            </div>

            <div className="pet-detail-item">
              <strong>Breed</strong>
              {pet.breed}
            </div>

            <div className="pet-detail-item">
              <strong>Age</strong>
              {pet.age}
            </div>

            <div className="pet-detail-item">
              <strong>Gender</strong>
              {pet.gender}
            </div>

            <div className="pet-detail-item">
              <strong>Location</strong>
              {pet.location}
            </div>

            <div className="pet-detail-item">
              <strong>Energy Level</strong>
              {pet.energyLevel}
            </div>

          </div>

          <h2>❤️ Health Information</h2>

          <div className="pet-detail-list">

            <div className="pet-detail-item">
              <strong>Health</strong>
              {pet.health}
            </div>

            <div className="pet-detail-item">
              <strong>Vaccinated</strong>
              {pet.vaccinated ? "Yes" : "No"}
            </div>

            <div className="pet-detail-item">
              <strong>Sterilized</strong>
              {pet.sterilized ? "Yes" : "No"}
            </div>

            <div className="pet-detail-item">
              <strong>Microchipped</strong>
              {pet.microchipped ? "Yes" : "No"}
            </div>

            <div className="pet-detail-item">
              <strong>Medical History</strong>
              {pet.medicalHistory}
            </div>

            <div className="pet-detail-item">
              <strong>Special Needs</strong>
              {pet.specialNeeds}
            </div>

          </div>

          <h2>🐶 Personality & Compatibility</h2>

          <div className="pet-detail-list">

            <div className="pet-detail-item">
              <strong>Temperament</strong>
              {pet.temperament}
            </div>

            <div className="pet-detail-item">
              <strong>Good With Children</strong>
              {pet.goodWithChildren}
            </div>

            <div className="pet-detail-item">
              <strong>Good With Other Pets</strong>
              {pet.goodWithPets}
            </div>

            <div className="pet-detail-item">
              <strong>Training</strong>
              {pet.training}
            </div>

            <div className="pet-detail-item">
              <strong>Diet</strong>
              {pet.diet}
            </div>

          </div>

          <h2>🏠 Adoption Information</h2>

          <div className="pet-detail-list">

            <div className="pet-detail-item">
              <strong>Shelter</strong>
              {pet.shelter}
            </div>

            <div className="pet-detail-item">
              <strong>Adoption Fee</strong>
              ₹{pet.adoptionFee}
            </div>

            <div className="pet-detail-item">
              <strong>Requirements</strong>
              {pet.adoptionRequirements}
            </div>

          </div>

          <div style={{ marginTop: "30px" }}>

            <Link
              to={`/adopt/${pet.id}`}
              className="primary-btn"
            >
              Apply to Adopt {pet.name}
            </Link>

            <Link
              to="/pets"
              style={{
                marginLeft: "15px",
                fontWeight: "600",
                color: "#4b7f52"
              }}
            >
              ← Back to Pets
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default PetDetails;