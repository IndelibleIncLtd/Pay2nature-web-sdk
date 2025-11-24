/**
 * React Example - Pay2Nature Widget
 * 
 * Usage:
 * 1. Install: npm install @pay2nature/widget-sdk
 * 2. Import the component
 * 3. Use in your React app
 */

import React, { useState } from 'react';
import { Pay2NatureWidgetComponent, ContributionData } from '@pay2nature/widget-sdk';

function App() {
  const [contributionData, setContributionData] = useState<ContributionData | null>(null);

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <h1>Pay2Nature Widget - React Example</h1>
      
      {contributionData && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#d1fae5', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3>Thank you for your contribution!</h3>
          <p>Amount: {contributionData.currency}{contributionData.amount}</p>
          {contributionData.paymentUrl && (
            <p>Payment URL: <a href={contributionData.paymentUrl} target="_blank" rel="noopener noreferrer">Open Payment</a></p>
          )}
        </div>
      )}

      <Pay2NatureWidgetComponent
        widgetToken={process.env.REACT_APP_WIDGET_TOKEN || 'your-widget-token'}
        baseUrl={process.env.REACT_APP_API_URL || 'https://api.pay2nature.com'}
        onContribution={(data) => {
          console.log('Contribution made:', data);
          setContributionData(data);
        }}
        onError={(error) => {
          console.error('Widget error:', error);
          alert('An error occurred: ' + error.message);
        }}
        style={{ marginTop: '20px' }}
      />
    </div>
  );
}

export default App;

