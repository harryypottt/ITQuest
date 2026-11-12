import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/HowItWorksSection';
import SpecializationsSection from './components/SpecializationsSection';
import BossQuestsSection from './components/BossQuestsSection';
import PlatformPreviewSection from './components/PlatformPreviewSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-quest-bg text-quest-text font-body">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <SpecializationsSection />
        <BossQuestsSection />
        <PlatformPreviewSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}