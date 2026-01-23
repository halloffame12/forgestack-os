import Hero from './components/Hero';
import TrustStrip from './components/TrustStrip';
import WhatIsForgeStack from './components/WhatIsForgeStack';
import StackSelector from './components/StackSelector';
import CLIExamples from './components/CLIExamples';
import HowItWorks from './components/HowItWorks';
import ArchitectureDeepDive from './components/ArchitectureDeepDive';
import ComparisonSection from './components/ComparisonSection';
import DeveloperExperience from './components/DeveloperExperience';
import OpenSourceSection from './components/OpenSourceSection';
import Creator from './components/Creator';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import StickyMobileCTA from './components/StickyMobileCTA';
import './index.css';

function App() {
    return (
        <div className="bg-[#030303] text-white selection:bg-blue-500/30 overflow-x-hidden min-h-screen relative font-sans noise-overlay">
            {/* Aurora Background */}
            <div className="aurora" />
            
            {/* Global Background Grid */}
            <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none -z-50" />
            
            {/* Ambient Orbs */}
            <div className="fixed top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none -z-40 animate-pulse-glow" />
            <div className="fixed bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none -z-40 animate-pulse-glow" style={{ animationDelay: '-1.5s' }} />

            <Hero />
            <TrustStrip />

            <main className="space-y-0 relative z-10">
                <WhatIsForgeStack />
                <StackSelector />
                <CLIExamples />
                <HowItWorks />
                <ArchitectureDeepDive />
                <ComparisonSection />
                <DeveloperExperience />
                <OpenSourceSection />
                <Creator />
                <FinalCTA />
            </main>

            <Footer />
            <StickyMobileCTA />
        </div>
    );
}

export default App;

