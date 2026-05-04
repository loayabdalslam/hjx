'use client';
import { useState, useEffect } from 'react';

export default function DiscountCalculator() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/hjx');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to load discount data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading Business Logic...</div>;

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl border border-gray-100">
      <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
        AI-Powered Business Rules (HJX)
      </div>
      <h1 className="block mt-1 text-lg leading-tight font-medium text-black">
        Dynamic Order Summary
      </h1>
      
      <div className="mt-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-500">Tier:</span>
          <span className="font-bold capitalize">{data.tier}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Original Price:</span>
          <span>${data.original}</span>
        </div>
        <div className="flex justify-between text-green-600">
          <span>Applied Discount:</span>
          <span>-{data.discount}%</span>
        </div>
        <div className="border-t pt-2 flex justify-between text-xl font-bold">
          <span>Final Price:</span>
          <span className="text-indigo-600">${data.final}</span>
        </div>
      </div>
      
      <p className="mt-4 text-xs text-gray-400 italic">
        * This calculation was generated dynamically by HJX based on natural language rules.
      </p>
    </div>
  );
}
