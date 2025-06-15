import { FaBicycle, FaTableTennis } from "react-icons/fa";
import { GiShuttlecock } from "react-icons/gi";

export const HobbiesSection: React.FC = () => {
  return (
    <section className="mb-20">
      <div className="glass-card p-10">
        <h2 className="section-title">Hobbies</h2>
        <div className="hobbies-container">
          <a
            href="https://www.strava.com/athletes/hnrobert"
            target="_blank"
            rel="noopener noreferrer"
            className="hobby-item"
          >
            <FaBicycle className="hobby-icon" style={{ color: "#f97316" }} />
            <span className="font-medium">Cycling</span>
          </a>
          <div className="hobby-item">
            <GiShuttlecock
              className="hobby-icon"
              style={{ color: "#22c55e" }}
            />
            <span className="font-medium">Badminton</span>
          </div>
          <div className="hobby-item">
            <FaTableTennis
              className="hobby-icon"
              style={{ color: "#3b82f6" }}
            />
            <span className="font-medium">Table Tennis</span>
          </div>
        </div>
      </div>
    </section>
  );
};
