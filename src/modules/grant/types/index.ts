export type GrantResultSuccess = {
  success: true
  data: any
}

export type GrantResultFailure = {
  success: false
  statusCode: number
  message: string
}
