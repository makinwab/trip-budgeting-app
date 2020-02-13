import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { TripItem } from '../models/TripItem'
import { UpdateTripRequest } from '../requests/UpdateTripRequest'
import { createLogger } from '../utils/logger'

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

  async getTrip(tripId: string, userId: string) {
    const result = await this.docClient
      .get({
        TableName: this.tripsTable,
        Key: {
          tripId,
          userId
        }
      })
      .promise()

    return result.Item
  }

  async getAllTrips(userId: string): Promise<TripItem[]> {
    console.log('Getting all trips')

    const params = {
      TableName: this.tripsTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    }

    const result = await this.docClient.query(params).promise()

    return result.Items as TripItem[]
  }


  async updateTrip(tripId: string, userId: string, updatedTrip: UpdateTripRequest): Promise<void> {
    await this.docClient.update({
      TableName: this.tripsTable,
      Key: {
        tripId,
        userId
      },
      ExpressionAttributeNames: {
        '#L': 'location',
        '#D': 'date'
      },
      UpdateExpression: 'SET #L = :location, #D = :date, budget = :budget',
      ExpressionAttributeValues: {
        ':location': updatedTrip.location,
        ':date': updatedTrip.date,
        ':budget': updatedTrip.budget
      }
    }).promise()
  }

  async deleteTrip(tripId: string, userId: string): Promise<void> {
    try {
      await this.docClient.delete({
        TableName: this.tripsTable,
        Key: {
          tripId,
          userId
        }
      }).promise()
    } catch(err) {
      createLogger(`Error while deleting document: ${err}`)
    }
  }
}

function createDynamoDBClient() {
  return new AWS.DynamoDB.DocumentClient()
}
