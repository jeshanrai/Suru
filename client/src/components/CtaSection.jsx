import { Rocket } from "lucide-react";
import "./CtaSection.css";

const CtaSection = () => {
    return (
        <section className="cta-section">
            <div className="cta-container">
                <h2 className="cta-heading">
                    Ready to find your competitive edge?
                </h2>
                <p className="cta-subtext">
                    Join thousands of validated founders and investors building the future.
                    Your next co-founder is waiting.
                </p>
                <div className="cta-button-wrapper">
                    <a href="#" className="cta-button">
                        Launch Your Profile
                        <Rocket className="cta-rocket" />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default CtaSection;
