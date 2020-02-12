import * as uuid from 'uuid'

import { TripItem } from '../models/TripItem'
import { Trip } from '../dataLayer/trips'
import { CreateTripRequest } from '../requests/CreateTripRequest'

const trip = new Trip()

export async function createTrip(
  userId: string,
  payload: CreateTripRequest
): Promise<TripItem> {
  const tripId = uuid.v4()
  const data = {
    tripId,
    userId,
    ...payload
  }

  return await trip.createTrip(data)
}
