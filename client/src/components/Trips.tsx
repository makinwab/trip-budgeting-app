import dateFormat from 'dateformat'
import { History } from 'history'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Loader,
  Form
} from 'semantic-ui-react'

import { createTrip, getTrips, deleteTrip } from '../api/trips-api'
import Auth from '../auth/Auth'
import { Trip } from '../types/Trip'

interface TripsProps {
  auth: Auth
  history: History
}

interface TripsState {
  trips: Trip[]
  newTripLocation: string
  newTripBudget: number,
  newTripDate: string,
  loadingTrips: boolean
}

export class Trips extends React.PureComponent<TripsProps, TripsState> {
  state: TripsState = {
    trips: [],
    newTripLocation: '',
    newTripBudget: 0,
    newTripDate: '',
    loadingTrips: true
  }

  handleTripLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTripLocation: event.target.value })
  }

  handleBudgetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTripBudget: parseInt(event.target.value) })
  }

  handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTripDate: event.target.value })
  }

  onEditButtonClick = (tripId: string) => {
    this.props.history.push(`/trips/${tripId}/edit`)
  }

  handleDeleteTripAction = async (tripId: string) => {
    try {
      await deleteTrip(this.props.auth.getIdToken(), tripId)

      const updatedTrips = this.state.trips.filter(trip => {
        return trip.tripId !== tripId
      })

      this.setState({
        trips: [...updatedTrips],
      })
    } catch {
      alert('Trip deletion failed')
    }
  }

  onTripCreate = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const newTrip = await createTrip(this.props.auth.getIdToken(), {
        location: this.state.newTripLocation,
        date: this.state.newTripDate,
        budget: this.state.newTripBudget
      })
      this.setState({
        trips: [...this.state.trips, newTrip],
      })
    } catch {
      alert('Trip creation failed')
    }
  }

  async componentDidMount() {
    try {
      const trips = await getTrips(this.props.auth.getIdToken())
      this.setState({
        trips,
        loadingTrips: false
      })
    } catch (e) {
      alert(`Failed to fetch trips: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">My Trips</Header>

        {this.renderCreateTripInput()}

        {this.renderTrips()}
      </div>
    )
  }

  renderCreateTripInput() {
    return (
      <Grid.Row>
        <Form size='large'>
          <Form.Group>
            <Form.Field>
              <label>Location</label>
              <Input
                placeholder="To change the world..."
                onChange={this.handleTripLocationChange}
              />
            </Form.Field>
            <Form.Field>
              <label>Budget</label>
              <Input
                placeholder="1000"
                onChange={this.handleBudgetChange}
              />
            </Form.Field>
            <Form.Field>
              <label>Date of trip</label>
              <Input
                type="date"
                onChange={this.handleDateChange}
              />
            </Form.Field>
            <Button primary type='submit' onClick={this.onTripCreate}>Create new Trip</Button>
          </Form.Group>
        </Form>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderTrips() {
    if (this.state.loadingTrips) {
      return this.renderLoading()
    }

    return this.renderTripsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Trips
        </Loader>
      </Grid.Row>
    )
  }

  renderTripsList() {
    return (
      <Grid padded>
        <Grid.Row>
          <Grid.Column width={5} verticalAlign="middle" floated="left">
            <b>Location</b>
          </Grid.Column>

          <Grid.Column width={5} verticalAlign="middle" floated="left">
            <b>Budget</b>
          </Grid.Column>

          <Grid.Column width={3} verticalAlign="middle" floated="left">
            <b>Date</b>
          </Grid.Column>
        </Grid.Row>
        {(this.state.trips && this.state.trips.length > 0) ? this.state.trips.map((trip, pos) => {
          return (
            <React.Fragment>
              <Grid.Row key={trip.tripId}>
                <Grid.Column width={1} verticalAlign="middle">
                </Grid.Column>
                <Grid.Column width={5} verticalAlign="middle" floated="left">
                  {trip.location}
                </Grid.Column>
                <Grid.Column width={5} verticalAlign="middle" floated="left">
                  {trip.budget} EUR
                </Grid.Column>
                <Grid.Column width={3} verticalAlign="middle" floated="left">
                  {trip.date}
                </Grid.Column>
                <Grid.Column width={1} floated="right">
                  <Button
                    icon
                    color="blue"
                    onClick={() => this.onEditButtonClick(trip.tripId)}
                  >
                    <Icon name="pencil" />
                  </Button>
                </Grid.Column>
                <Grid.Column width={1} floated="right">
                  <Button
                    icon
                    color="red"
                    onClick={() => this.handleDeleteTripAction(trip.tripId)}
                  >
                    <Icon name="cancel" />
                  </Button>
                </Grid.Column>
                <Grid.Column width={16}>
                  <Divider />
                </Grid.Column>
              </Grid.Row>
            </React.Fragment>
          )
        }) : <h3>There are currently no Trips.</h3>}
      </Grid>
    )
  }

  parseDate(tripDate: string): string {
    const date = new Date(tripDate)
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
