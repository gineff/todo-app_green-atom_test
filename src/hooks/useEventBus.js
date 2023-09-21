const eventMap = new Map()

const on = (key, cb) => {
  let handlers = eventMap.get(key)
  if (!handlers) {
    handlers = []
  }
  handlers.push(cb)
  eventMap.set(key, handlers)
}

const emit = (key, payload) => {
  const handlers = eventMap.get(key)
  if (!Array.isArray(handlers)) return
  handlers.forEach(handler => {
    handler(payload)
  })
}

export const useEventBus = [on, emit]
