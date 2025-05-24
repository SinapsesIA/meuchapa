
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { setupStorageBuckets } from './utils/supabase-storage-setup.ts';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element not found! Cannot mount React app.');
}

// Check storage buckets when the app starts
// But don't block the app from loading if they don't exist
setupStorageBuckets()
  .then(result => {
    console.log('Storage buckets check completed:', result ? 'Success' : 'Not available');
  })
  .catch(error => {
    console.warn('Failed to check storage buckets:', error);
  });

const root = createRoot(container);
root.render(<App />);
