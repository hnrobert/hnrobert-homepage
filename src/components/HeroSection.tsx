export const HeroSection: React.FC = () => {
  return (
    <section className="hero-section">
      <div className="hero-avatar">
        <img
          src="/assets/avt.jpg"
          alt="Robert He"
          className="hero-avatar-img"
        />
      </div>
      <h1 className="page-title">Hello, I'm Robert He</h1>
      <p className="hero-subtitle">Full-stack developer</p>
      <p className="hero-subtitle">Creating what I like & what you need</p>
    </section>
  );
};
