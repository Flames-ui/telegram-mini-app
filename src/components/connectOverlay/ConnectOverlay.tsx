import React from 'react';
import { truncateText } from '../../utils/truncateText';

interface ConnectOverlayProps {
  slideAnimation: string;
  close: () => void;
  onConnect: () => void;
  account: string | null;
}

const ConnectOverlay: React.FC<ConnectOverlayProps> = ({ slideAnimation, close, onConnect, account }) => {
  const someText = "This is a sample long text that needs to be truncated to look better in UI.";

  return (
    <div className={`connect-overlay ${slideAnimation}`}>
      <div className="content">
        <p className="dark:text-customDarkModeTextColor">
          {truncateText(someText, 100)}
        </p>
        <button onClick={onConnect}>Connect Wallet</button>
        <button onClick={close}>Close</button>
        {account && <p>Connected account: {account}</p>}
      </div>
    </div>
  );
};

export default ConnectOverlay;
