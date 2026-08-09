import { RouterProvider } from 'react-router-dom'
// Import the router configuration from router.jsx
import router from './router.jsx'

// Root component — hands the router to React Router
export default function App() {
  // Allows page transitions without a full browser reload
  return <RouterProvider router={router} />
}
