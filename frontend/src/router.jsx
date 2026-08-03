import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import LandingPage from '../pages/LandingPage.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import { ProductManagement, BillingScreen, ReceiptPrinting } from '../pages/Placeholders.jsx';
import Product from '../pages/Product.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<MainLayout />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<LandingPage />}/>
          <Route path='/dashboard' element={<Dashboard />}/>
          <Route path='/products' element={<Product />}/>
          <Route path='/billing' element={<BillingScreen />}/>
          <Route path='/receipts' element={<ReceiptPrinting />}/>
        </Route>
      </Route>
    </>
  )
);

export default router;