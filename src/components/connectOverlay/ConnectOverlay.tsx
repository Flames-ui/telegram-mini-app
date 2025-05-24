import React from 'react';
import truncateText from '../../utils/truncateText';

interface ConnectOverlayProps {
  text: string; // example prop, adjust as needed
}

const ConnectOverlay: React.FC<ConnectOverlayProps> = ({ text }) => {
  return (
    <div>
      {/* other JSX */}
      <p className="dark:text-customDarkModeTextColor">
        {truncateText(text, 100)}
      </p>
      {/* other JSX */}
    </div>
  );
};

export default ConnectOverlay;
