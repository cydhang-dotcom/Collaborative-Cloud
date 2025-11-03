
import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MainContent from './components/MainContent';

const App: React.FC = () => {
  return (
    <div className="flex h-screen bg-white text-gray-800">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <MainContent />
        </main>
      </div>
    </div>
  );
};

export default App;
