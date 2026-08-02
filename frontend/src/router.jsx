// Navigate = redirect helper, Route = one URL rule
import { Navigate, Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
// Module 2: Billing Page
import BillingPage from './modules/billing/BillingPage.jsx'

// createBrowserRouter builds the routing table for the whole app
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      {/* "/" redirects straight to the sales screen */}
      <Route index element={<Navigate to="/sales" replace />} />

      {/* The POS billing screen (Module 2) */}
      <Route path="sales" element={<BillingPage />} />

      {/* Any unknown URL falls back to /sales */}
      <Route path="*" element={<Navigate to="/sales" replace />} />
    </Route>
  )
)

export default router
