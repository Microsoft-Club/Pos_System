import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import MainLandingPage from '../pages/MainLandingPage.jsx';
import UserLandingPage from '../pages/UserLandingPage.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import Product from '../pages/Product.jsx';
import ReceiptPrinting from '../pages/ReceiptPrinting.jsx';
import BillingPage from '../pages/BillingPage.jsx';
import Login from '../pages/Login.jsx';
import Signup from '../pages/Signup.jsx';
import ManageMember from '../pages/ManageMember.jsx';
import { getUserLoader } from '../loaders/getUserLoader.js';

// createBrowserRouter builds the routing table for the whole app
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<MainLayout />} loader={getUserLoader}>
        <Route index element={<MainLandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<DashboardLayout />}>
          <Route path="/user" element={<UserLandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Product />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/receipts" element={<ReceiptPrinting />} />
          <Route path="/manage-member" element={<ManageMember />} />
        </Route>
      </Route>
    </>
  )
);

export default router;
