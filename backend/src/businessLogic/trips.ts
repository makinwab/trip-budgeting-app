import * as uuid from 'uuid'

import { TripItem } from '../models/TripItem'
import { Trip } from '../dataLayer/trips'
import { CreateTripRequest } from '../requests/CreateTripRequest'
import { UpdateTripRequest } from '../requests/UpdateTripRequest'

const trip = new Trip()

export async function getAllTrips(userId: string): Promise<TripItem[]> {
  return await trip.getAllTrips(userId)
}

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

export async function updateTrip(tripId: string, userId: string, payload: UpdateTripRequest): Promise<void> {
  return await trip.updateTrip(tripId, userId, payload)
}

export async function deleteTrip(tripId: string, userId: string): Promise<void> {
  await trip.deleteTrip(tripId, userId)
}

export async function tripExists(tripId: string, userId: string) {
  const item = await trip.getTrip(tripId, userId)

  console.log('Get trip: ', item)
  return !!item
}