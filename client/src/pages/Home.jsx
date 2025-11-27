import React from "react";
import HeroSection from "../components/HeroSection";
import MetricsSection from "../components/MetricsSection";
import UserPathSection from "../components/UserPathSection";
import FeaturesSection from "../components/FeaturesSection";
import TestimonialsSection from "../components/TestimonialsSection";
import CtaSection from "../components/CtaSection";
import METRICS from "../data/METRICS_DATA";
import FEATURES_DATA from "../data/FEATURES_DATA";
import TESTIMONIALS_DATA from "../data/TESTIMONIALS_DATA";

const Home = () => {
    return (
        <>
            <div className="tailwind">
                <HeroSection />
                <MetricsSection metrics={METRICS} />
                <UserPathSection />
                <FeaturesSection features={FEATURES_DATA} />
                <TestimonialsSection testimonials={TESTIMONIALS_DATA} />
                <CtaSection />
            </div>
        </>
    );
};

export default Home;
