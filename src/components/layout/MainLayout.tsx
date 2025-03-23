import React, { ReactNode } from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import AiChat from '../common/AiChat';

interface MainLayoutProps {
  children: ReactNode;
  hideAiAssistant?: boolean;
}

/**
 * Main layout component that includes header, footer, and AI assistant
 * Used to maintain consistent layout across pages
 */
const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  hideAiAssistant = false 
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-blue-50">
      <Header />
      
      <main className="flex-1 p-4">
        {children}
      </main>
      
      <Footer />
      
      {!hideAiAssistant && (
        <div className="fixed bottom-0 right-0 m-4 z-50">
          <AiChat />
        </div>
      )}
    </div>
  );
};

export default MainLayout;
