import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";

import Header from "./component/Header";
import SmoothScroll from "./component/SmoothScroll";

import HeroBanner from "./Home/HeroBanner";
import VideoRevealSection from "./Home/VideoRevealSection";
import ServiceSection from "./Home/ServiceSection";
import Casestudysection from "./Home/Casestudysection";
import AboutSection from "./Home/Aboutsection";
import TestimonialSection from "./Home/Testimonialsection1";
import NewServices from "./Home/NewServices";

import HomeBanner1 from "./Home1/HomeBanner1";
import HomeBanner2 from "./Home2/HomeBanner2";

import SocialMedia from "./Service/SocialMedia";
import AudioVisual from "./Service/AudioVisual";
import BrandCreation from "./Service/BrandCreation";
import MediaBuying from "./Service/MediaBuying";
import WebDevelopment from "./Service/WebDevelopment";
import SEO from "./Service/SEO";

import Services from "./Service/Services";
import WorkCulture from "./WorkCulture/WorkCulture";
import Clientele from "./Clientele/Clientele";



function HomePage() {
  return (
    <>
      <HeroBanner />
      <VideoRevealSection />
     <NewServices />
      <Casestudysection />
      <AboutSection />
      <TestimonialSection />
    </>

  );
}

function HomePage1() {
  return (
    <>
      <HomeBanner1 />
      <VideoRevealSection />
     <NewServices />
    </>

  );
}

function HomePage2() {
  return (
    <>
      <HomeBanner2 />
      <VideoRevealSection />
      <NewServices />
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
        <Route path="/home1" element={<HomePage1 />} />
        <Route path="/home2" element={<HomePage2 />} />
        <Route path="/service" element={<Services />} />
        <Route path="/work-culture" element={<WorkCulture />} />
        <Route path="/clientele" element={<Clientele />} />

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