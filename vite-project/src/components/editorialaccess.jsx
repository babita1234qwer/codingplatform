// src/components/EditorialAccessChecker.jsx
import React, { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosclient';
import PaymentButton from './paymentbutton';
import Editorial from './editorial';

const EditorialAccessChecker = ({ secureUrl, thumbnailUrl, duration }) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get('/payment/has-access');
        setHasAccess(data.hasAccess);
      } catch (err) {
        console.error("Access check error:", err);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAccess();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-4">
        <span className="loading loading-spinner text-[#ffa116]"></span>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-[#1e1e1e] text-[#e2e2e2] p-4 rounded-lg border border-[#303030]">
      {hasAccess ? (
        <Editorial
          secureUrl={secureUrl}
          thumbnailUrl={thumbnailUrl}
          duration={duration}
        />
      ) : (
        <div className="text-center">
          <p className="mb-4 text-lg">🔒 Editorial is locked</p>
          <p className="mb-4">Unlock premium access for ₹200</p>
          <PaymentButton amount={200} onSuccess={() => setHasAccess(true)} />
        </div>
      )}
    </div>
  );
};

export default EditorialAccessChecker;