export type HouseholdResultSuccess = {
  success: true
  data: any
}

export type HouseholdResultFailure = {
  success: false
  statusCode: number
  message: string
}
