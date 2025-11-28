import { Rocket } from "lucide-react";
import "./CtaSection.css";
import { Link } from "react-router-dom";

const CtaSection = () => {
    return (
        <section className="cta-section">
            <div className="cta-container">
                <h2 className="cta-heading">
                    Ready to build the future?
                </h2>
                <p className="cta-subtext">
                    Join thousands of vetted founders and investors building the next generation of startups.
                    Your dream team is waiting.
                </p>
                <div className="cta-button-wrapper">
                    <Link to="register" className="cta-button">
                        Get Started Now
                        <Rocket className="cta-rocket" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CtaSection;
