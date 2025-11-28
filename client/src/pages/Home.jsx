import React from "react";
import HeroSection from "../components/HeroSection";
import MetricsSection from "../components/MetricsSection";
import UserPathSection from "../components/UserPathSection";
import AboutUs from "../components/AboutUs";
import FeaturesSection from "../components/FeaturesSection";
import TestimonialsSection from "../components/TestimonialsSection";
import CtaSection from "../components/CtaSection";
import METRICS from "../data/METRICS_DATA";
import FEATURES_DATA from "../data/FEATURES_DATA";
import TESTIMONIALS_DATA from "../data/TESTIMONIALS_DATA";
import Footer from "../components/Footer";

const Home = () => {
    return (
        <>
            <div className="home">
                <HeroSection />
                <AboutUs />
                <MetricsSection metrics={METRICS} />
                <UserPathSection />
                <FeaturesSection features={FEATURES_DATA} />
                <TestimonialsSection testimonials={TESTIMONIALS_DATA} />
                <CtaSection />
                <Footer />
            </div>
        </>
    );
};

export default Home;
