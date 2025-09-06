import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import PlatformOverview from './components/PlatformOverview';
import VideoDemo from './components/VideoDemo';
import Status from './components/Status';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import Stats from './components/Stats';
import CTA from './components/CTA';
import Footer from './components/Footer';

// Import existing page components
import AppBuilderPage from './components/pages/AppBuilderPage';
import CloudHostingPage from './components/pages/CloudHostingPage';
import AccountPage from './components/pages/AccountPage';
import DashboardPage from './components/pages/DashboardPage';
import DocumentationPage from './components/pages/DocumentationPage';
import SupportPage from './components/pages/SupportPage';
import StatusPage from './components/pages/StatusPage';
import ProductPage from './components/pages/ProductPage';
import SolutionPage from './components/pages/SolutionPage';
import BuildsPage from './components/pages/BuildsPage';
import PricingRecommenderPage from './components/pages/PricingRecommenderPage';
import ProfilePage from './components/pages/ProfilePage';
import DeveloperTrainingPage from './components/pages/DeveloperTrainingPage';
import SoftwareDevelopmentPage from './components/pages/SoftwareDevelopmentPage';


// Import new page components
import AboutUsPage from './components/pages/AboutUsPage';
import StudioPage from './components/pages/StudioPage';
import PosPage from './components/pages/PosPage';
import MobileSdkPage from './components/pages/MobileSdkPage';
import EnterpriseSolutionsPage from './components/pages/EnterpriseSolutionsPage';


const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const renderContent = () => {
    switch (route) {
      // Core Platform Pages
      case '#/app-builder':
        return <AppBuilderPage />;
      case '#/cloud-hosting':
        return <CloudHostingPage />;
      case '#/studio':
        return <StudioPage />;
      case '#/pos':
        return <PosPage />;
      case '#/mobile-sdk':
        return <MobileSdkPage />;
      case '#/enterprise-solutions':
        return <EnterpriseSolutionsPage />;
      
      // Resource Pages
      case '#/documentation':
        return <DocumentationPage />;
      case '#/support':
        return <SupportPage />;
      case '#/status':
        return <StatusPage />;
      case '#/developer-training':
        return <DeveloperTrainingPage />;

      // Company Pages
      case '#/about-us':
        return <AboutUsPage />;
      case '#/product':
        return <ProductPage />;
      case '#/solution':
        return <SolutionPage />;
      case '#/services':
        return <SoftwareDevelopmentPage />;
      case '#/builds':
        return <BuildsPage />;

      // User Pages
      case '#/account':
        return <AccountPage />;
      case '#/dashboard':
        return <DashboardPage />;
      case '#/profile':
        return <ProfilePage />;

      // AI Pages
      case '#/pricing-recommender':
        return <PricingRecommenderPage />;

      default:
        return (
          <>
            <Hero />
            <Features />
            <PlatformOverview />
            <VideoDemo />
            <Status />
            <Pricing />
            <Testimonials />
            <Stats />
            <CTA />
          </>
        );
    }
  };

  return (
    <div className="bg-black text-gray-300 min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;