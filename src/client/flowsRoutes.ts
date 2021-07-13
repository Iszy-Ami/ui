// This file is generated by [oats][0] and should not be edited by hand.
//
// [0]: https://github.com/influxdata/oats

export interface FlowList {
  flows?: Flow[]
  nextPageToken?: string
}

export interface Flow {
  orgID?: string
  id?: string
  name?: string
  spec?: {}
  createdAt?: string
  updatedAt?: string
}

export interface RuntimeError {
  error?: string
  code?: number
  message?: string
  details?: ProtobufAny[]
}

export interface ProtobufAny {
  type_url?: string
  value?: string
}

export interface FlowCreateRequest {
  orgID?: string
  name?: string
  spec?: {}
}

export interface FlowUpdateRequest {
  orgID?: string
  id?: string
  name?: string
  spec?: {}
}

interface RequestOptions {
  signal?: AbortSignal
}

export type RequestHandler = (
  url: string,
  query: string,
  init: RequestInit
) => {url: string; query: string; init: RequestInit}
export type ResponseHandler = (
  status: number,
  headers: Headers,
  data: any
) => {status: number; headers: Headers; data: any}

const RequestContext = function(
  requestHandler: RequestHandler,
  responseHandler: ResponseHandler
) {
  this.requestHandler = requestHandler
  this.responseHandler = responseHandler
}

RequestContext.prototype.request = async function(
  method: string,
  url: string,
  params: any = {},
  options: RequestOptions = {}
): Promise<any> {
  const requestHeaders = new Headers(params.headers)
  const contentType = requestHeaders.get('Content-Type') || ''

  if (params.auth) {
    const credentials = btoa(`${params.auth.username}:${params.auth.password}`)

    requestHeaders.append('Authorization', `Basic ${credentials}`)
  }

  const body =
    params.data && contentType.includes('json')
      ? JSON.stringify(params.data)
      : params.data

  const query = params.query ? `?${new URLSearchParams(params.query)}` : ''

  const {
    url: middlewareUrl,
    query: middlewareQuery,
    init,
  } = this.requestHandler(url, query, {
    method,
    body,
    credentials: 'same-origin',
    signal: options.signal,
    headers: requestHeaders,
  })

  const response = await fetch(`${middlewareUrl}${middlewareQuery}`, init)

  const {status, headers} = response
  const responseContentType = headers.get('Content-Type') || ''

  let data

  if (responseContentType.includes('json')) {
    data = await response.json()
  } else if (responseContentType.includes('octet-stream')) {
    data = await response.blob()
  } else {
    data = await response.text()
  }

  return this.responseHandler(status, headers, data)
}

RequestContext.prototype.setRequestHandler = function(
  requestHandler: RequestHandler
) {
  this.requestHandler = requestHandler
}

RequestContext.prototype.setResponseHandler = function(
  responseHandler: ResponseHandler
) {
  this.responseHandler = responseHandler
}

const rc = new RequestContext(
  (url, query, init) => {
    return {url, query, init}
  },
  (status, headers, data) => {
    return {status, headers, data}
  }
)
const request = rc.request.bind(rc)
const setRequestHandler = rc.setRequestHandler.bind(rc)
const setResponseHandler = rc.setResponseHandler.bind(rc)

export {request, setRequestHandler, setResponseHandler}

export interface GetFlowsOrgsFlowsParams {
  orgID: string

  query?: {
    limit?: number
    pageToken?: string
  }
}

type GetFlowsOrgsFlowsResult =
  | GetFlowsOrgsFlowsOKResult
  | GetFlowsOrgsFlowsDefaultResult

interface GetFlowsOrgsFlowsOKResult {
  status: 200
  headers: Headers
  data: FlowList
}

interface GetFlowsOrgsFlowsDefaultResult {
  status: 500
  headers: Headers
  data: RuntimeError
}

export const getFlowsOrgsFlows = (
  params: GetFlowsOrgsFlowsParams,
  options: RequestOptions = {}
): Promise<GetFlowsOrgsFlowsResult> =>
  request(
    'GET',
    `/api/v2private/flows/orgs/${params.orgID}/flows`,
    params,
    options
  ) as Promise<GetFlowsOrgsFlowsResult>

export interface PostFlowsOrgsFlowParams {
  orgID: string

  data: FlowCreateRequest
}

type PostFlowsOrgsFlowResult =
  | PostFlowsOrgsFlowOKResult
  | PostFlowsOrgsFlowDefaultResult

interface PostFlowsOrgsFlowOKResult {
  status: 200
  headers: Headers
  data: Flow
}

interface PostFlowsOrgsFlowDefaultResult {
  status: 500
  headers: Headers
  data: RuntimeError
}

export const postFlowsOrgsFlow = (
  params: PostFlowsOrgsFlowParams,
  options: RequestOptions = {}
): Promise<PostFlowsOrgsFlowResult> =>
  request(
    'POST',
    `/api/v2private/flows/orgs/${params.orgID}/flows`,
    {...params, headers: {'Content-Type': 'application/json'}},
    options
  ) as Promise<PostFlowsOrgsFlowResult>

export interface GetFlowsOrgsFlowParams {
  orgID: string
  id: string
}

type GetFlowsOrgsFlowResult =
  | GetFlowsOrgsFlowOKResult
  | GetFlowsOrgsFlowDefaultResult

interface GetFlowsOrgsFlowOKResult {
  status: 200
  headers: Headers
  data: Flow
}

interface GetFlowsOrgsFlowDefaultResult {
  status: 500
  headers: Headers
  data: RuntimeError
}

export const getFlowsOrgsFlow = (
  params: GetFlowsOrgsFlowParams,
  options: RequestOptions = {}
): Promise<GetFlowsOrgsFlowResult> =>
  request(
    'GET',
    `/api/v2private/flows/orgs/${params.orgID}/flows/${params.id}`,
    params,
    options
  ) as Promise<GetFlowsOrgsFlowResult>

export interface PatchFlowsOrgsFlowParams {
  orgID: string
  id: string

  data: FlowUpdateRequest
}

type PatchFlowsOrgsFlowResult =
  | PatchFlowsOrgsFlowOKResult
  | PatchFlowsOrgsFlowDefaultResult

interface PatchFlowsOrgsFlowOKResult {
  status: 200
  headers: Headers
  data: Flow
}

interface PatchFlowsOrgsFlowDefaultResult {
  status: 500
  headers: Headers
  data: RuntimeError
}

export const patchFlowsOrgsFlow = (
  params: PatchFlowsOrgsFlowParams,
  options: RequestOptions = {}
): Promise<PatchFlowsOrgsFlowResult> =>
  request(
    'PATCH',
    `/api/v2private/flows/orgs/${params.orgID}/flows/${params.id}`,
    {...params, headers: {'Content-Type': 'application/json'}},
    options
  ) as Promise<PatchFlowsOrgsFlowResult>

export interface DeleteFlowsOrgsFlowParams {
  orgID: string
  id: string
}

type DeleteFlowsOrgsFlowResult =
  | DeleteFlowsOrgsFlowOKResult
  | DeleteFlowsOrgsFlowDefaultResult

interface DeleteFlowsOrgsFlowOKResult {
  status: 200
  headers: Headers
  data: any
}

interface DeleteFlowsOrgsFlowDefaultResult {
  status: 500
  headers: Headers
  data: RuntimeError
}

export const deleteFlowsOrgsFlow = (
  params: DeleteFlowsOrgsFlowParams,
  options: RequestOptions = {}
): Promise<DeleteFlowsOrgsFlowResult> =>
  request(
    'DELETE',
    `/api/v2private/flows/orgs/${params.orgID}/flows/${params.id}`,
    params,
    options
  ) as Promise<DeleteFlowsOrgsFlowResult>
