import React, { Component } from 'react';
import auth from '../services/authService';
import Loader from './loader';
// import SearchInput from './common/searchInput';
import Input from './common/input';
import { getLocation, saveLocation } from '../services/locationService';

class Locations extends Component {
  state = {
    user: '',
    loading: true,
    locationInput: '',
    locations: [],
    locationObj: {
      locations: [],
      brandId: '',
    },
  };

  async componentDidMount() {
    window.scrollTo(0, 0);
    this.props.updateDashboardMenu('locations');

    const user = auth.getCurrentUser();
    this.setState({ user });

    // const res = await getLocation(user._id);
    // console.log(res)
    await this.populateLocations(user);

    this.setState({ loading: false });
  }

  async populateLocations(user) {
    try {
      const { data } = await getLocation(user._id);

      this.setState({
        locations: data.locations,
        locationObj: this.mapToViewModel(data),
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        // this.props.history.replace('/not-found');
        console.log(ex);
    }
  }

  mapToViewModel(location) {
    return {
      _id: location._id,
      brandId: location.brandId,
      locations: location.locations,
    };
  }

  handleStatusSelect = (status) => {
    this.setState({
      status,
    });
  };

  handleInput = (location) => {
    this.setState({
      locationInput: location,
    });
  };

  addLocation = async () => {
    let locations = [...this.state.locations];
    const { locationInput, user, locationObj } = this.state;

    locations.push(locationInput);

    locationObj.locations = locations;
    locationObj.brandId = user._id;

    const { data } = await saveLocation(locationObj);

    this.setState({
      locations,
      locationInput: '',
      locationObj: this.mapToViewModel(data),
    });
  };

  removeLocation = async (location) => {
    let locations = [...this.state.locations];
    const { user, locationObj } = this.state;

    locations = locations.filter((o) => o !== location);

    locationObj.locations = locations;
    locationObj.brandId = user._id;

    await saveLocation(locationObj);

    this.setState({ locations });
  };

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    // let { filtered: orders } = this.getFilteredOrders();
    const { loading, locationInput, locations } = this.state;

    if (loading) return <Loader />;

    return (
      <div className='customers-page orders'>
        {/* <div className='row'>
          <div className='col-md-12 p-2'> */}
        <div className='profile-right-block' style={{ animationDelay: '0.1s' }}>
          <h1>Locations</h1>
          <br />

          <div className='locations-page'>
            <div className='location-input-block'>
              <Input
                type='text'
                name='query'
                className='form-control location-input'
                placeholder='Enter branch address'
                value={locationInput}
                onChange={(e) => this.handleInput(e.currentTarget.value)}
                autoFocus
              />
              <button onClick={this.addLocation} disabled={!locationInput}>
                Add
              </button>
            </div>

            <div className='locations'>
              {locations.map((l) => (
                <div className='location-box' key={l}>
                  {l} <button onClick={() => this.removeLocation(l)}>X</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      //   </div>
      // </div>
    );
  }
}

export default Locations;
