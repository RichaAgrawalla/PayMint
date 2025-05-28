import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, CheckCircle } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [stripeStatus, setStripeStatus] = useState<{
    connected: boolean;
    detailsSubmitted: boolean;
    chargesEnabled: boolean;
    payoutsEnabled: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStripeStatus();
  }, []);

  const fetchStripeStatus = async () => {
    try {
      const res = await axios.get('/invoices/connect/status');
      setStripeStatus(res.data);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch Stripe status');
      setLoading(false);
    }
  };

  const handleConnectStripe = async () => {
    try {
      setLoading(true);
      const res = await axios.post('/invoices/connect/onboard');
      window.location.href = res.data.url;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to connect Stripe account');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container-custom page-container flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-secondary-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom page-container">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-secondary-800 mb-8">Settings</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="text-red-500 mr-2" />
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        <div className="card bg-white shadow-card p-6">
          <h2 className="text-lg font-semibold text-secondary-800 mb-4">Payment Settings</h2>
          
          {stripeStatus?.connected ? (
            <div className="space-y-4">
              <div className="flex items-center text-green-600">
                <CheckCircle className="mr-2" />
                <span>Stripe account connected</span>
              </div>
              
              {!stripeStatus.detailsSubmitted && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <p className="text-yellow-700">
                    Your Stripe account needs additional information to accept payments.
                    Please complete the onboarding process.
                  </p>
                  <button
                    onClick={handleConnectStripe}
                    className="btn btn-primary mt-4"
                  >
                    Complete Setup
                  </button>
                </div>
              )}

              {stripeStatus.detailsSubmitted && !stripeStatus.chargesEnabled && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <p className="text-yellow-700">
                    Your Stripe account is under review. You'll be able to accept payments once approved.
                  </p>
                </div>
              )}

              {stripeStatus.chargesEnabled && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <p className="text-green-700">
                    Your Stripe account is fully set up and ready to accept payments!
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-secondary-600">
                Connect your Stripe account to accept payments for your invoices.
              </p>
              <button
                onClick={handleConnectStripe}
                className="btn btn-primary"
              >
                Connect Stripe Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 