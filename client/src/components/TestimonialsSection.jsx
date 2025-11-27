import { Target } from "lucide-react";
import "./TestimonialsSection.css";
const TestimonialsSection = ({ testimonials }) => {
    const TESTIMONIALS = testimonials || TESTIMONIALS_DATA; // fallback to default data

    return (
        <section id="testimonials" className="testimonials-section">
            <div className="testimonials-container">
                <h2 className="testimonials-heading">
                    Trusted by Leaders in the Ecosystem
                </h2>
                <div className="testimonials-grid">
                    {TESTIMONIALS.map((t, index) => (
                        <blockquote key={index} className="testimonial-card">
                            <Target className="testimonial-icon" />
                            <p className="testimonial-quote">
                                "{t.quote}"
                            </p>
                            <footer className="testimonial-footer">
                                <div className="testimonial-avatar-wrapper">
                                    <div className="testimonial-avatar">
                                        {t.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </div>
                                </div>
                                <div className="testimonial-info">
                                    <div className="testimonial-name">{t.name}</div>
                                    <div className="testimonial-title">{t.title}</div>
                                </div>
                            </footer>
                        </blockquote>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
