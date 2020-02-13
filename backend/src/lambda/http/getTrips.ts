import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { getAllTrips } from '../../businessLogic/trips'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  createLogger(`Processing get trips with event: ${event}`)
  const userId = getUserId(event)

  const trips = await getAllTrips(userId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({items: trips})
  }
}
