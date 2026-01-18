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
        <div className="bg-[#0a0a0a] text-white selection:bg-blue-500/30 overflow-x-hidden min-h-screen relative font-sans">
            {/* Global Background Grid */}
            <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none -z-50" />

            <Hero />
            <TrustStrip />

            <main className="space-y-0">
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

