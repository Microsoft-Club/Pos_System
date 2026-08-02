import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import LandingPage from '../pages/LandingPage.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import { ProductManagement, BillingScreen, ReceiptPrinting } from '../pages/Placeholders.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><LandingPage /></Layout>,
  },
  {
    path: "/dashboard",
    element: <Layout><Dashboard /></Layout>,
  },
  {
    path: "/products",
    element: <Layout><ProductManagement /></Layout>,
  },
  {
    path: "/billing",
    element: <Layout><BillingScreen /></Layout>,
  },
  {
    path: "/receipts",
    element: <Layout><ReceiptPrinting /></Layout>,
  }
]);

export default router;