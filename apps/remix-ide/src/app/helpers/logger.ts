/* eslint-disable func-names */
const isDevelopment = false
const emptyFn = () => {}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  info: isDevelopment
    ? function (...props: any) {
      console.info(...props)
    }
    : emptyFn,
  debug: isDevelopment
    ? function (...props: any) {
      console.debug(...props)
    }
    : emptyFn,
  error: isDevelopment
    ? function (...props: any) {
      console.error(...props)
    }
    : emptyFn,
  warn: isDevelopment
    ? function (...props: any) {
      console.warn(...props)
    }
    : emptyFn
}
