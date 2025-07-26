import { configService } from "../data/config";

export const HobbiesSection: React.FC = () => {
  const hobbies = configService.getHobbies();

  return (
    <section className="section">
      <div className="glass-card">
        <h2 className="section-title">Hobbies</h2>
        <div className="hobbies-container">
          {hobbies.map((hobby, index) => (
            <div key={index} className="hobby-item">
              <span className="hobby-emoji">{hobby.split(" ")[0]}</span>
              <span className="hobby-label">
                {hobby.split(" ").slice(1).join(" ")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
