// Vite exposes variables that start with VITE_ through import.meta.env
// This value comes from frontend/.env -> http://localhost:5000/api/v1
const API_URL = import.meta.env.VITE_API_URL

/**
 * Send a GET request and return parsed JSON.
 * @param {string} path  example: "/billing/items"
 */
export async function apiGet(path) {
  // fetch() returns a Response object (not the data itself)
  const response = await fetch(`${API_URL}${path}`, {credentials: 'include'})

  // response.ok is false for 4xx / 5xx status codes
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  // .json() reads the body and converts JSON text into a JS object
  return response.json()
}

/**
 * Send a POST request with a JSON body.
 * @param {string} path  example: "/billing/orders"
 * @param {object} body  example: { items: [...], payment_method: "CASH" }
 */
export async function apiPost(path, body) {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST', // HTTP verb for creating data
    headers: { 'Content-Type': 'application/json' }, // tell server we send JSON
    credentials: 'include',
    body: JSON.stringify(body), // convert JS object -> JSON text
  })

  if (!response.ok) {
    // Backend sends { message: "..." } on errors — try to read it
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `Request failed with status ${response.status}`)
  }

  return response.json()
}
