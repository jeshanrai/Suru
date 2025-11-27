
import "./FeaturesSection.css";

const FeaturesSection = ({ features }) => {
    const FEATURES = features || FEATURES_DATA; // fallback to default data

    return (
        <section id="features" className="features-section">
            <div className="features-container">
                <div className="features-header">
                    <h2 className="features-subtitle">
                        Why CoFoundHQ?
                    </h2>
                    <p className="features-title">
                        Engineered for Founding Teams
                    </p>
                    <p className="features-description">
                        We provide the infrastructure and intelligence needed to secure funding, find partners, and scale rapidly.
                    </p>
                </div>

                <div className="features-grid">
                    {FEATURES.map((feature, index) => (
                        <div key={index} className="feature-card">
                            <div className="feature-icon-wrapper">
                                <feature.icon className="feature-icon" />
                            </div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-text">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
