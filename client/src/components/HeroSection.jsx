import "./HeroSection.css";
import { Link } from "react-router-dom";

const HeroSection = () => {
    return (
        <section className="hero-section">
            <div className="hero-container">
                <h1 className="hero-heading">
                    <span className="hero-heading-span">Build the Future. Together.</span>
                </h1>
                <p className="hero-subtext">
                    <strong>Founders:</strong> Connect with the perfect co-founder to bring your vision to life. <strong>Talent:</strong> Join high-growth startups and make a real impact.
                </p>
                <div className="hero-buttons">
                    <Link to="register" className="hero-button-primary">
                        Find Your Co-Founder
                    </Link>
                    <Link to="browse-startups" className="hero-button-secondary">
                        Browse Opportunities
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
