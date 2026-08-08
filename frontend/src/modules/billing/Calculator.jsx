import { useState } from 'react'

/**
 * A simple POS calculator.
 * Evaluates left-to-right (like a basic physical calculator, no operator precedence).
 * Matches the page's blue/white color scheme.
 *
 * props:
 *   onAddToBill = fn(amount) — adds the current value as an add-on charge
 */
export default function Calculator({ onAddToBill }) {
  // The running expression string, e.g. "12+5×2"
  const [expr, setExpr] = useState('')
  // The value shown on the little screen
  const [display, setDisplay] = useState('0')

  const operators = ['+', '−', '×', '÷']

  // Add a digit or dot to the expression
  function inputDigit(d) {
    const next = expr + d
    setExpr(next)
    setDisplay(next)
  }

  // Add an operator (replace the last one if the user taps two in a row)
  function inputOperator(op) {
    if (expr === '') return // don't start with an operator
    const lastChar = expr[expr.length - 1]
    const next = operators.includes(lastChar)
      ? expr.slice(0, -1) + op // swap trailing operator
      : expr + op
    setExpr(next)
    setDisplay(next)
  }

  // Clear everything
  function clearAll() {
    setExpr('')
    setDisplay('0')
  }

  // Evaluate the expression left to right
  function evaluate() {
    // Split into numbers and operators, e.g. ["12","+","5"]
    const tokens = expr.match(/(\d+\.?\d*)|[+\-−×÷]/g)
    if (!tokens || tokens.length === 0) return

    let result = parseFloat(tokens[0])

    for (let i = 1; i < tokens.length; i += 2) {
      const op = tokens[i]
      const nextNum = parseFloat(tokens[i + 1])
      if (isNaN(nextNum)) break

      if (op === '+') result += nextNum
      else if (op === '−' || op === '-') result -= nextNum
      else if (op === '×') result *= nextNum
      else if (op === '÷') result = nextNum === 0 ? 0 : result / nextNum
    }

    const rounded = Number(result.toFixed(2))
    setDisplay(String(rounded))
    setExpr(String(rounded)) // allow chaining calculations
  }

  // Grid layout of keys (matches your sketch)
  const keys = [
    { label: '7' }, { label: '8' }, { label: '9' }, { label: 'AC', kind: 'clear' },
    { label: '4' }, { label: '5' }, { label: '6' }, { label: '+', kind: 'op' },
    { label: '1' }, { label: '2' }, { label: '3' }, { label: '−', kind: 'op' },
    { label: '0' }, { label: '.' }, { label: '=', kind: 'equals' }, { label: '×', kind: 'op' },
  ]

  function handleKey(key) {
    if (key.kind === 'clear') clearAll()
    else if (key.kind === 'equals') evaluate()
    else if (key.kind === 'op') inputOperator(key.label)
    else inputDigit(key.label)
  }

  // Compute the current value from the expression (left-to-right)
  function computeValue() {
    const tokens = expr.match(/(\d+\.?\d*)|[+\-−×÷]/g)
    if (!tokens || tokens.length === 0) return Number(display) || 0

    let result = parseFloat(tokens[0])
    for (let i = 1; i < tokens.length; i += 2) {
      const op = tokens[i]
      const nextNum = parseFloat(tokens[i + 1])
      if (isNaN(nextNum)) break
      if (op === '+') result += nextNum
      else if (op === '−' || op === '-') result -= nextNum
      else if (op === '×') result *= nextNum
      else if (op === '÷') result = nextNum === 0 ? 0 : result / nextNum
    }
    return Number(result.toFixed(2))
  }

  // Add the current value to the bill as an add-on, then reset the keypad
  function handleAddToBill() {
    const value = computeValue()
    if (onAddToBill && value > 0) {
      onAddToBill(value)
      clearAll()
    }
  }

  return (
    <div className="bg-blue-600 rounded-xl p-3">
      {/* Display screen */}
      <div className="bg-white rounded-lg px-3 py-2 mb-3 text-right text-lg font-semibold text-slate-800 truncate">
        {display}
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-2">
        {keys.map((key) => (
          <button
            key={key.label}
            onClick={() => handleKey(key)}
            className={
              'py-2 rounded-lg text-sm font-semibold ' +
              (key.kind === 'op'
                ? 'bg-blue-500 text-white hover:bg-blue-400'
                : key.kind === 'equals'
                ? 'bg-blue-800 text-white hover:bg-blue-700'
                : key.kind === 'clear'
                ? 'bg-rose-500 text-white hover:bg-rose-400'
                : 'bg-white text-slate-800 hover:bg-slate-100')
            }
          >
            {key.label}
          </button>
        ))}
      </div>

      {/* Add the calculated amount to the bill as an add-on */}
      <button
        onClick={handleAddToBill}
        className="mt-2 w-full bg-white text-blue-700 rounded-lg py-2 text-sm font-semibold hover:bg-slate-100"
      >
        + Add to Bill
      </button>
    </div>
  )
}
