import { FaBicycle, FaTableTennis } from "react-icons/fa";
import { GiShuttlecock } from "react-icons/gi";

export const HobbiesSection: React.FC = () => {
  return (
    <section className="section">
      <div className="glass-card">
        <h2 className="section-title">Hobbies</h2>
        <div className="hobbies-container">
          <a
            href="https://www.strava.com/athletes/hnrobert"
            target="_blank"
            rel="noopener noreferrer"
            className="hobby-item"
          >
            <FaBicycle className="hobby-icon" style={{ color: "#f97316" }} />
            <span className="hobby-label">Cycling</span>
          </a>
          <div className="hobby-item">
            <GiShuttlecock
              className="hobby-icon"
              style={{ color: "#22c55e" }}
            />
            <span className="hobby-label">Badminton</span>
          </div>
          <div className="hobby-item">
            <FaTableTennis
              className="hobby-icon"
              style={{ color: "#3b82f6" }}
            />
            <span className="hobby-label">Table Tennis</span>
          </div>
        </div>
      </div>
    </section>
  );
};
