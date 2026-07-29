import { useState } from 'react'
import './App.css'
import { RouterProvider } from 'react-router-dom'
import router from './router'

function App() {
  return <RouterProvider router={router}/> 
  // allows page trasition iwthout the browser reloading
  //rendering the app, top -level wrapper taht listens to URL changes
}

export default App

// export default function Navbar(){
//   return(
//     <nav>
//         <a href="">Home</a>
//         <a href="">About</a>
//         <a href="">Contacts</a>

//     </nav>
//   )
// }
