import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTripRequest } from '../../requests/UpdateTripRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { updateTrip, tripExists } from '../../businessLogic/trips'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  createLogger(`Processing update trips event: ${event}`)

  const userId = getUserId(event)
  const tripId = event.pathParameters.tripId
  const validTrip = await tripExists(tripId, userId)

  if (!validTrip) {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        error: 'Trip does not exist'
      })
    }
  }

  const payload: UpdateTripRequest = JSON.parse(event.body)

  await updateTrip(tripId, userId, payload)

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({})
  }
}
