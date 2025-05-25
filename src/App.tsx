import React, { useState } from 'react';
import ConnectOverlay from './components/connectOverlay/ConnectOverlay';

const App: React.FC = () => {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [account, setAccount] = useState<string | null>(null);

  const handleConnect = () => {
    // Simulate wallet connect
    setAccount('0x123...abc');
    setOverlayVisible(false);
  };

  const handleClose = () => {
    setOverlayVisible(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Welcome to Anointed Flames TV</h1>
      <button
        onClick={() => setOverlayVisible(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Connect Wallet
      </button>

      {overlayVisible && (
        <ConnectOverlay
          slideAnimation="slide-left"
          close={handleClose}
          onConnect={handleConnect}
          account={account}
        />
      )}
    </div>
  );
};

export default App
