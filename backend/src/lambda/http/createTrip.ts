import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { getUserId } from '../utils'
import { CreateTripRequest } from '../../requests/CreateTripRequest'
import { createTrip } from '../../businessLogic/trips'
import { createLogger } from '../../utils/logger'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  createLogger(`Processing event: ${event}`)

  const newTrip: CreateTripRequest = JSON.parse(event.body)
  const userId = getUserId(event)
  const item = await createTrip(userId, newTrip)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item
    })
  }
}


