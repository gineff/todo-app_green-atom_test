const _context = ['0']

export const setContext = el => _context.push(el) - 1
export const getContext = i => _context[i]

let id = 1
export const nextId = () => id++
export const uid = () =>
  Math.random().toString(16).slice(2) + Date.now().toString(16)
