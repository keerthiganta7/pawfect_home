import { useState } from "react";
import PetCard from "../components/PetCard";
import pets from "../data/pets";

function Pets() {
  const [search, setSearch] = useState("");
  const [species, setSpecies] = useState("All");
  const [gender, setGender] = useState("All");

  const filteredPets = pets.filter((pet) => {
    const matchesSearch =
      pet.name.toLowerCase().includes(search.toLowerCase()) ||
      pet.breed.toLowerCase().includes(search.toLowerCase()) ||
      pet.location.toLowerCase().includes(search.toLowerCase());

    const matchesSpecies =
      species === "All" || pet.species === species;

    const matchesGender =
      gender === "All" || pet.gender === gender;

    return matchesSearch && matchesSpecies && matchesGender;
  });

  return (
    <div className="pets-page">
      <section className="pets-hero">
        <div>
          <span className="section-label">FIND YOUR COMPANION</span>

          <h1>Find Your Perfect Pet</h1>

          <p>
            Explore loving dogs and cats looking for their forever homes.
            Search by name, breed or location.
          </p>
        </div>
      </section>

      <section className="pets-container">
        <div className="search-panel">
          <div className="search-box">
            <label>Search</label>

            <input
              type="text"
              placeholder="Search by name, breed or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-box">
            <label>Species</label>

            <select
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
            >
              <option value="All">All Pets</option>
              <option value="Dog">Dogs</option>
              <option value="Cat">Cats</option>
            </select>
          </div>

          <div className="filter-box">
            <label>Gender</label>

            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>

        <div className="results-header">
          <div>
            <h2>Available Pets</h2>
            <p>
              Showing <strong>{filteredPets.length}</strong> pets
            </p>
          </div>
        </div>

        {filteredPets.length > 0 ? (
          <div className="pet-grid">
            {filteredPets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <div>🐾</div>
            <h2>No pets found</h2>
            <p>
              Try changing your search or filters to find more pets.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Pets;