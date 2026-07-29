import { Navigate, Outlet, Route, Link, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import './App.css'

function RootLayout() {
  return (
    <div className="app-shell">
      <nav className="navbar">
        <div className="brand">POS System</div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/orders">Orders</Link>
        </div>
      </nav>

      <main className="page-content">
        <Outlet />
      </main>
    </div>
  )
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<div className="page"><h1>Welcome to the POS system</h1><p>Your navbar is now visible.</p></div>} />
      <Route path="products" element={<div className="page"><h1>Products</h1></div>} />
      <Route path="orders" element={<div className="page"><h1>Orders</h1></div>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  )
)

export default router