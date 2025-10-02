import React, { useState } from 'react';

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ClipboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const policies = [
  {
    title: 'Shipping',
    url: 'https://merchant.razorpay.com/policy/RH8sLstVxs37x/shipping'
  },
  {
    title: 'Terms and Conditions',
    url: 'https://merchant.razorpay.com/policy/RH8sLstVxs37x/terms'
  },
  {
    title: 'Cancellation & Refunds',
    url: 'https://merchant.razorpay.com/policy/RH8sLstVxs37x/refund'
  }
];

const PolicyLinksPage: React.FC = () => {
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

    const handleCopy = (url: string) => {
        navigator.clipboard.writeText(url).then(() => {
            setCopiedUrl(url);
            setTimeout(() => setCopiedUrl(null), 2000);
        });
    };

    return (
        <div className="container mx-auto px-6 py-12 fade-in">
          <h1 className="text-5xl font-serif text-center mb-4 text-white">Your Policy Links</h1>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Copy and add the page links within 7 days to your website for verification.
          </p>

          <div className="max-w-3xl mx-auto bg-brand-dark p-8 border border-gray-800 rounded-lg">
            <div className="space-y-8">
              {policies.map((policy, index) => (
                <div 
                  key={policy.title}
                  className={`flex items-start gap-4 ${index < policies.length - 1 ? 'pb-8 border-b border-gray-700' : ''}`}
                >
                  <CheckCircleIcon />
                  <div className="flex-grow">
                    <h3 className="text-xl font-serif text-white mb-2">{policy.title}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 bg-gray-900 p-2 pl-4 rounded-md border border-gray-700">
                        <input
                            type="text"
                            value={policy.url}
                            readOnly
                            className="bg-transparent text-gray-400 w-full focus:outline-none text-sm sm:text-base py-2 sm:py-0"
                            onFocus={(e) => e.target.select()}
                            aria-label={`${policy.title} URL`}
                        />
                        <button 
                            onClick={() => handleCopy(policy.url)}
                            className="flex-shrink-0 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors duration-300 flex items-center gap-2 w-full sm:w-auto justify-center"
                            aria-label={`Copy ${policy.title} URL`}
                        >
                            {copiedUrl === policy.url ? (
                                'Copied!'
                            ) : (
                                <>
                                 <ClipboardIcon /> Copy
                                </>
                            )}
                        </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
    );
};

export default PolicyLinksPage;