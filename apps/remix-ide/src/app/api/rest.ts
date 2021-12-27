// base api realization
import logger from '../helpers/logger'
const isDevelopment = false
const cloudFunctionsApiUrl = '//localhost:5001/dukeweb-fef75/us-central1'
const TIMEOUT = 20000 // 20 sec timeout
const baseUrl = cloudFunctionsApiUrl

type Props = {
  url: string
  method?: string
  headers?: Headers
  body?: any
}

type Params = Omit<Props, 'url'>

const fetchWithTimeout = (uri: string, params: Params) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async resolve => {
    const t = setTimeout(() => {
      resolve({ status: 0, error: 'Request timed out' })
    }, TIMEOUT)
    try {
      const res = await fetch(uri, params)
      resolve(res)
    } catch (error: any) {
      resolve({ status: 0, error: error?.message ?? 'Request filed' })
    } finally {
      clearTimeout(t)
    }
  })
}

/**
 * Throws connection error.
 */
const throwConnectionError = (error: string) => {
  throw new Error(error)
}

const BaseAPI = <T>(method: string, { url, body }: Props, mockResponse?: T): Promise<T> => {
  const baseHeaders = new Headers()
  baseHeaders.append('Content-Type', 'application/json')
  baseHeaders.append('Accept', 'application/json')
  const uri = `${baseUrl}/${url}`

  const params: Params = {
    method,
    headers: baseHeaders
  }

  if (method !== 'GET') {
    params.body = JSON.stringify(body)
  }

  logger.info(`${method}: `, uri, params)

  if (mockResponse) {
    return new Promise(resolve => resolve(mockResponse))
  }

  return fetchWithTimeout(uri, params)
    .catch(throwConnectionError)
    .then(async (response: any) => {
      await validateResponse(response)

      return response
    })
    .then((response: Response & { error?: string }) => {
      if (response.status === 401) {
        return { code: response.status, message: response.statusText }
      }

      if (response.status === 0 && response?.error) {
        return throwConnectionError(response?.error)
      }

      return response.json()
    })
}

export const POST = <T>(url: string, body: Props['body'], mockResponse?: T) => {
  return BaseAPI<T>('POST', { url, body }, mockResponse)
}

export const PUT = <T>(url: string, body: Props['body'], mockResponse?: T) => {
  return BaseAPI('PUT', { url, body }, mockResponse)
}

export const PATCH = <T>(url: string, body: Props['body'], mockResponse?: T) => {
  return BaseAPI('PATCH', { url, body }, mockResponse)
}

export const GET = <T>(url: string, body: Props['body'], mockResponse?: T) => {
  return BaseAPI('GET', { url, body }, mockResponse)
}

export const DELETE = <T>(url: string, body: Props['body'], mockResponse?: T) => {
  return BaseAPI('DELETE', { url, body }, mockResponse)
}

/**
 * Validates HTTP response and throws error if something goes wrong.
 */
const validateResponse = async (response: Response) => {
  // Redirect user to login screen if he is not authorized
  if (response.status === 401) {
    return Promise.resolve(true)
  }

  if (response.status !== 200) {
    logger.error(response)
  }

  // if (Config.__TEST__) return Promise.resolve(true)
  if (isDevelopment && typeof response.clone === 'function') {
    const clonedResponse = response.clone()
    const body = await clonedResponse.json()

    logger.info({
      response,
      body
    })
  } else {
    logger.info(response)
  }

  return Promise.resolve(true)
}
