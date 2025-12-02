import { Rocket } from "lucide-react";
import "./CtaSection.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const CtaSection = () => {
    const { user } = useContext(AuthContext);

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
                    <Link to={user ? "/create-startup" : "/login"} className="cta-button">
                        Get Started Now
                        <Rocket className="cta-rocket" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CtaSection;
