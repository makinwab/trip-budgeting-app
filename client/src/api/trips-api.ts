import { apiEndpoint } from '../config'
import { Trip } from '../types/Trip';
import { CreateTripRequest } from '../types/CreateTripRequest';
import Axios from 'axios'
import { UpdateTripRequest } from '../types/UpdateTripRequest';

export async function getTrips(idToken: string): Promise<Trip[]> {
  console.log('Fetching trips')

  const response = await Axios.get(`${apiEndpoint}/trips`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Trips:', response.data)
  return response.data.items
}

export async function createTrip(
  idToken: string,
  newTrip: CreateTripRequest
): Promise<Trip> {
  const response = await Axios.post(`${apiEndpoint}/trips`,  JSON.stringify(newTrip), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchTrip(
  idToken: string,
  tripId: string,
  updatedTrip: UpdateTripRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/trips/${tripId}`, JSON.stringify(updatedTrip), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}
