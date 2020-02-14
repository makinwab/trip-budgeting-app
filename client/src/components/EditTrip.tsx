import * as React from 'react'
import { History } from 'history'
import { Form, Button, Input } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getTrips, patchTrip} from '../api/trips-api'

interface EditTripProps {
  match: {
    params: {
      tripId: string
    }
  }
  auth: Auth
  history: History
}

interface EditTripState {
  location: string,
  date: string,
  budget: number
}

export class EditTrip extends React.PureComponent<
  EditTripProps,
  EditTripState
> {
  state: EditTripState = {
    location: '',
    date: 'string',
    budget: 0
  }



  handleTripLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ location: event.target.value })
  }

  handleBudgetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ budget: parseInt(event.target.value) })
  }

  handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ date: event.target.value })
  }

  async componentDidMount() {
    try {
      const trips = await getTrips(this.props.auth.getIdToken())
      console.log(trips, this.props)
      trips.forEach((trip) => {
        if(trip.tripId === this.props.match.params.tripId) {
          this.setState({
            location: trip.location,
            date: trip.date,
            budget: trip.budget
          })

          return
        }
      });
    } catch (e) {
      alert(`Failed to fetch trip: ${e.message}`)
    }
  }


  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      await patchTrip(this.props.auth.getIdToken(), this.props.match.params.tripId, {
        location: this.state.location,
        date: this.state.date,
        budget: this.state.budget
      })

      this.props.history.push('/')
    } catch {
      alert('Trip creation failed')
    }
  }


  render() {
    return (
      <div>
        <h1>Edit trip</h1>

        <Form onSubmit={this.handleSubmit} size='large'>
          <Form.Group>
            <Form.Field>
              <label>Location</label>
              <Input
                value={this.state.location}
                onChange={this.handleTripLocationChange}
              />
            </Form.Field>
            <Form.Field>
              <label>Budget</label>
              <Input
                value={this.state.budget}
                onChange={this.handleBudgetChange}
              />
            </Form.Field>
            <Form.Field>
              <label>Date of trip</label>
              <Input
                type="date"
                value={this.state.date}
                onChange={this.handleDateChange}
              />
            </Form.Field>
            <Button primary type='submit'>Update Trip</Button>
          </Form.Group>
        </Form>
      </div>
    )
  }
}
