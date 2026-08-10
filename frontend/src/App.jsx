import { RouterProvider } from 'react-router-dom'
// Import the router configuration from router.jsx
import router from './router.jsx'
import { ThemeProvider } from '../context/ThemeContext.jsx'

// Root component — hands the router to React Router
export default function App() {
  // Allows page transitions without a full browser reload
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}
