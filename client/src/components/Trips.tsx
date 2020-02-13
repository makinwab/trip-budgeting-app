import dateFormat from 'dateformat'
import { History } from 'history'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createTrip, getTrips } from '../api/trips-api'
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

  onTripCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      // const date = this.calculateDueDate()
      const newTrip = await createTrip(this.props.auth.getIdToken(), {
        location: this.state.newTripLocation,
        date: this.state.newTripDate,
        budget: this.state.newTripBudget
      })
      this.setState({
        trips: [...this.state.trips, newTrip],
        newTripLocation: ''
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
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New trip location',
              onClick: this.onTripCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To change the world..."
            onChange={this.handleTripLocationChange}
          />

          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'Budget for trip (EUR)',
              onClick: this.onTripCreate
            }}
            fluid
            actionPosition="left"
            placeholder="1000"
            onChange={this.handleBudgetChange}
          />

          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'Date of trip',
              onClick: this.onTripCreate
            }}
            fluid
            type="datetime"
            actionPosition="left"
            onChange={this.handleDateChange}
          />
        </Grid.Column>
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
        {(this.state.trips && this.state.trips.length > 0) ? this.state.trips.map((trip, pos) => {
          return (
            <Grid.Row key={trip.tripId}>
              <Grid.Column width={1} verticalAlign="middle">
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {trip.location}
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {trip.budget} EUR
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {dateFormat(trip.date, 'yyyy-mm-dd')}
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
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        }) : <h3>There are currently no Trips.</h3>}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
