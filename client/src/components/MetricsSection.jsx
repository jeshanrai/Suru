import "./MetricsSection.css";
const MetricsSection = ({ metrics }) => {
    const METRICS_DATA = metrics || METRICS; // fallback to default metrics if no props passed

    return (
        <section id="metrics" className="metrics-section">
            <div className="metrics-container">
                <h2 className="metrics-heading">Metrics of Success</h2>
                <div className="metrics-grid">
                    {METRICS_DATA.map((metric, index) => (
                        <div key={index} className="metric-card">
                            <metric.icon className="metric-icon" />
                            <p className="metric-count">{metric.count}</p>
                            <p className="metric-label">{metric.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MetricsSection;
