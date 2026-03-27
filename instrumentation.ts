// Polyfill browser APIs that Payload UI expects on the server.
// Node.js v22+ exposes a partial localStorage stub; patch it so
// getItem / setItem / removeItem don't throw during SSR compilation.
export async function register() {
  if (typeof globalThis.localStorage !== 'undefined') {
    const noop = () => null
    if (typeof globalThis.localStorage.getItem !== 'function') {
      Object.defineProperty(globalThis, 'localStorage', {
        value: {
          getItem: noop,
          setItem: noop,
          removeItem: noop,
          clear: noop,
          key: noop,
          length: 0,
        },
        writable: true,
        configurable: true,
      })
    }
  }
}
