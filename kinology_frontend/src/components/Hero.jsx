const Hero = () => {
  return (
    <div className="hero">
      <div className="intro">
        <h2>
          Welcome to <strong>Kinology</strong>
        </h2>
        <div>
          Choosing a movie made easy
          <br />
          <br />
          Pick actors, directors or genres that interest you and explore
        </div>
        <button className="CTA-search">search</button>
      </div>
      <div className="register">
        <div>
          Too many good options to choose from?
          <br /> Create an account to save movies for later!
        </div>
        <button className="CTA-register">Register</button>
      </div>
    </div>
  );
};

export default Hero;
