/**
 * Next.js Example - Pay2Nature Widget
 * 
 * For Next.js 13+ App Router, use 'use client' directive
 * For Pages Router, this works as-is
 */

'use client'; // Required for Next.js 13+ App Router

import { Pay2NatureWidgetComponent, ContributionData } from '@pay2nature/widget-sdk';
import { useState } from 'react';

export default function DonationPage() {
  const [contributionData, setContributionData] = useState<ContributionData | null>(null);

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <h1>Support Nature Conservation</h1>
      <p>Make a contribution to verified nature projects.</p>

      {contributionData && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#d1fae5', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3>Thank you for your contribution!</h3>
          <p>Amount: {contributionData.currency}{contributionData.amount}</p>
        </div>
      )}

      <Pay2NatureWidgetComponent
        widgetToken={process.env.NEXT_PUBLIC_WIDGET_TOKEN!}
        baseUrl={process.env.NEXT_PUBLIC_API_URL!}
        onContribution={(data) => {
          console.log('Contribution made:', data);
          setContributionData(data);
        }}
        onError={(error) => {
          console.error('Widget error:', error);
        }}
      />
    </div>
  );
}

/**
 * Alternative: Server-Side Rendering (SSR) with dynamic import
 * Use this if you need SSR or want to avoid client-side bundle
 */

// import dynamic from 'next/dynamic';
// 
// const Pay2NatureWidget = dynamic(
//   () => import('@pay2nature/widget-sdk').then(mod => mod.Pay2NatureWidgetComponent),
//   { ssr: false }
// );
// 
// export default function DonationPage() {
//   return (
//     <div>
//       <Pay2NatureWidget
//         widgetToken={process.env.NEXT_PUBLIC_WIDGET_TOKEN!}
//         baseUrl={process.env.NEXT_PUBLIC_API_URL!}
//       />
//     </div>
//   );
// }

