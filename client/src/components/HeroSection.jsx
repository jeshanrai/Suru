import "./HeroSection.css";

const HeroSection = () => {
    return (
        <section className="hero-section">
            <div className="hero-container">
                <h1 className="hero-heading">
                    <span className="hero-heading-span">The Platform for</span>
                </h1>
                <p className="hero-subtext">
                    <strong>Founders:</strong> Find your core team. <strong>Joiners:</strong> Find high-impact startups with real potential.
                </p>
                <div className="hero-buttons">
                    <a href="#" className="hero-button-primary">
                        Post Your Opportunity
                    </a>
                    <a href="#" className="hero-button-secondary">
                        Explore Talents & Startups
                    </a>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
