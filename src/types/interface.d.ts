type ApiCommonRes<T> = {
  code: number
  data: T | null
  msg: string
}

type PaginationData<T> = {
  data?: T
  page: number
  size: number
  totalElements: number
  totalPage: number
}

interface PaginationParams {
  page: number
  pageSize?: number
  search?: string
  keyword?: string
  name?: string
  size?: number
  type?: number | string
}

interface Window {
  // expose in the `electron/preload/index.ts`
}
