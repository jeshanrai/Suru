import { Rocket, Briefcase } from "lucide-react";
import "./UserPathSection.css";

const UserPathSection = () => {
    return (
        <section id="user-paths" className="user-path-section">
            <div className="user-path-container">
                <h2 className="user-path-heading">
                    Two Paths to Innovation
                </h2>
                <div className="user-path-grid">
                    {/* Path 1: Founders */}
                    <div className="user-path-card founders-card">
                        <div className="user-path-card-header">
                            <Rocket className="user-path-icon founders-icon" />
                            <h3 className="user-path-card-title">
                                For Visionary Founders
                            </h3>
                        </div>
                        <p className="user-path-card-text">
                            Stop looking for generic help. Find highly vetted, skill-matched co-founders and early employees ready to commit to your vision and scale your MVP into a market leader.
                        </p>
                        <a href="#" className="user-path-card-button founders-button">
                            Share Your Startup Idea
                        </a>
                    </div>

                    {/* Path 2: Joiners/Talent */}
                    <div className="user-path-card joiners-card">
                        <div className="user-path-card-header">
                            <Briefcase className="user-path-icon joiners-icon" />
                            <h3 className="user-path-card-title">
                                For Skilled Joiners & Talent
                            </h3>
                        </div>
                        <p className="user-path-card-text">
                            Skip the job boards. Discover high-potential, funded, and early-stage startups that need your specific expertise. Find meaningful equity and purpose in the next big thing.
                        </p>
                        <a href="#" className="user-path-card-button joiners-button">
                            Find a Startup to Join
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UserPathSection;
