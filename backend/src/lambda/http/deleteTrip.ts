import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { deleteTrip, tripExists } from '../../businessLogic/trips'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  createLogger(`Processing delete Trip event: ${event}`)

  const tripId = event.pathParameters.tripId
  const userId = getUserId(event)
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

  await deleteTrip(tripId, userId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({})
  }
}

