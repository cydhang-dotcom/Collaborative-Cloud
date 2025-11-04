
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MainContent from './components/MainContent';
import { PageName } from './types';

const App: React.FC = () => {
  const [page, setPage] = useState<PageName>('confirmation');

  return (
    <div className="flex h-screen bg-white text-gray-800">
      <Sidebar page={page} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <MainContent page={page} setPage={setPage} />
        </main>
      </div>
    </div>
  );
};

export default App;