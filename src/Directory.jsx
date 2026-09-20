import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import BusinessCard from './components/BusinessCard';
import BlogSection from './components/BlogSection';
import MonetizationModule from './components/MonetizationModule';
import BackgroundBeams from 'aceternity/background-beams';

const Directory = () => {
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    async function fetchBusinesses() {
      let { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('location', 'Seattle');
      if (!error) setBusinesses(data);
    }
    fetchBusinesses();
  }, []);

  return (
    <div className="directory-container">
      <BackgroundBeams />
      <h1>Paulis List - Seattle Business Directory</h1>
      {businesses.map((business) => (
        <BusinessCard key={business.id} business={business} />
      ))}
      <BlogSection />
      <MonetizationModule />
    </div>
  );
};

export default Directory;
