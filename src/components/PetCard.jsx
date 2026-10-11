import { Link } from "react-router-dom";

function PetCard({ pet }) {
  return (
    <div className="pet-card">
      <img src={pet.image} alt={pet.name} />

      <div className="pet-card-content">
        <div className="pet-card-header">
          <h3>{pet.name}</h3>

          <button className="favorite-btn" title="Add to favorites">
            ♡
          </button>
        </div>

        <p className="breed">{pet.breed}</p>

        <div className="pet-info">
          <span>🎂 {pet.age}</span>
          <span>📍 {pet.location}</span>
        </div>

        <p className="health">✓ {pet.health}</p>

        <Link to={`/pets/${pet.id}`} className="view-btn">
          View Details
        </Link>
      </div>
    </div>
  );
}

export default PetCard;