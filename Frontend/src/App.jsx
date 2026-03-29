import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./component/Header";
import SmoothScroll from "./component/SmoothScroll";

import HeroBanner from "./Home/HeroBanner";
import VideoRevealSection from "./Home/VideoRevealSection";
import ServiceSection from "./Home/ServiceSection";
import Casestudysection from "./Home/Casestudysection";
import AboutSection from "./Home/Aboutsection";
import TestimonialSection from "./Home/Testimonialsection1";

import SocialMedia from "./Service/SocialMedia";
import AudioVisual from "./Service/AudioVisual";
import BrandCreation from "./Service/BrandCreation";
import MediaBuying from "./Service/MediaBuying";
import WebDevelopment from "./Service/WebDevelopment";
import SEO from "./Service/SEO";

import Services from "./Service/Services";
import WorkCulture from "./WorkCulture/WorkCulture";


function HomePage() {
  return (
    <>
      <HeroBanner />
      <VideoRevealSection />
      <ServiceSection />
      <Casestudysection />
      <AboutSection />
      <TestimonialSection />
    </>

  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* <Header /> */}
      <SmoothScroll />

      <Routes>
        {/* HOME */}
        <Route path="/" element={<HomePage />} />
        <Route path="/service" element={<Services />} />
        <Route path="/work-culture" element={<WorkCulture />} />

        {/* INDIVIDUAL SERVICE PAGES */}
        <Route path="/service/social-media" element={<SocialMedia />} />
        <Route path="/service/audio-visual" element={<AudioVisual />} />
        <Route path="/service/brand-creation" element={<BrandCreation />} />
        <Route path="/service/media-buying" element={<MediaBuying />} />
        <Route path="/service/web-development" element={<WebDevelopment />} />
        <Route path="/service/seo" element={<SEO />} />
      </Routes>
    </BrowserRouter>
  );
}