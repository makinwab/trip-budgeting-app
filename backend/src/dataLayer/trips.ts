import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { TripItem } from '../models/TripItem'

export class Trip {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly tripsTable = process.env.TRIPS_TABLE) {
  }

  async createTrip(trip: TripItem): Promise<TripItem> {
    await this.docClient.put({
      TableName: this.tripsTable,
      Item: trip
    }).promise()

    return trip
  }
}

function createDynamoDBClient() {
  return new AWS.DynamoDB.DocumentClient()
}
