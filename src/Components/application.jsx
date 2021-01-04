import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import MainPage from './mainPage';
import QrPage from './qrPage';
import Footer from './footer';
import NotFound from './notFound';
import Nap from './nap';
import VolumeScreen from './common/volumeScreen';
import DriverProfile from './driverProfile';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import './stylesheet.css';
import LoginPage from './loginPage';
import auth from '../services/authService';
import ProtectedRoute from './common/protectedRoute';
import Logout from './logout';
import WhatToDo from './whatToDo';

class Application extends Component {
  state = {
    nap: false,
    mute: false,
    volumePop: false,
    volume: 1,
    backAddress: '',
  };

  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }

  updateUser = () => {
    const user = auth.getCurrentUser();
    this.setState({ user });
  };

  handleNap = () => {
    const { nap } = this.state;
    this.setState({ nap: !nap });

    if (!nap) {
      setTimeout(() => {
        this.setState({ nap: false });
      }, 2000);
    }
  };

  muteMe = (element) => {
    if (element.muted) element.muted = false;
    else element.muted = true;
    // element.pause();
  };

  mutePage = () => {
    this.setState({ mute: true });

    setTimeout(() => {
      this.setState({ mute: false });
    }, 1500);

    // Array.prototype.slice.call(document.querySelectorAll('audio')).forEach(function(audio) {
    //   audio.muted = true;
    // });

    document
      .querySelectorAll('video, audio')
      .forEach((element) => this.muteMe(element));
  };

  volChange = (element, role) => {
    if (element.muted) element.muted = false;

    if (role === 'up' && element.volume < 1)
      element.volume = parseFloat(element.volume + 0.1);
    else if (role === 'down' && element.volume > 0.2)
      element.volume = parseFloat(element.volume - 0.1);

    this.setState({ volume: element.volume });
  };

  handleVolumeUp = () => {
    // const { volumePop } = this.state;
    // if (volumePop) {
    //   this.setState({ volumePop: false });
    //   this.handleVolumeUp();
    // } else
    this.setState({ volumePop: true });

    setTimeout(() => {
      this.setState({ volumePop: false });
    }, 2000);

    document
      .querySelectorAll('video, audio')
      .forEach((element) => this.volChange(element, 'up'));
  };

  handleVolumeDown = () => {
    // const { volumePop } = this.state;
    // if (volumePop) {
    // this.setState({ volumePop: false });
    // this.handleVolumeDown();
    // } else

    this.setState({ volumePop: true });

    setTimeout(() => {
      this.setState({ volumePop: false });
    }, 2000);

    document
      .querySelectorAll('video, audio')
      .forEach((element) => this.volChange(element, 'down'));
  };

  handleBack = (backAddress) => {
    this.setState({ backAddress });
  };

  render() {
    const { nap, mute, volumePop, volume, backAddress, user } = this.state;

    return (
      <div>
        <Router>
          <Footer
            handleNap={this.handleNap}
            backAddress={backAddress}
            mutePage={this.mutePage}
            handleVolumeUp={this.handleVolumeUp}
            handleVolumeDown={this.handleVolumeDown}
          />

          {nap && <Nap handleNap={this.handleNap} />}
          {mute && <VolumeScreen role='mute' />}
          {volumePop && <VolumeScreen role='volume' value={volume} />}

          <Switch>
            <ProtectedRoute
              path='/profile'
              render={(props) => (
                <DriverProfile {...props} handleBack={this.handleBack} />
              )}
            />

            <Route
              path='/main'
              render={(props) => (
                <MainPage {...props} handleBack={this.handleBack} />
              )}
            />
           
            <Route
              path='/whattodo'
              render={(props) => (
                <WhatToDo {...props} handleBack={this.handleBack} />
              )}
            />

            {user && (
              <Route
                path='/logout'
                render={(props) => (
                  <Logout {...props} updateUser={this.updateUser} handleBack={this.handleBack}/>
                )}
              />
            )}

            <Route
              path='/login/'
              render={(props) => {
                if (auth.getCurrentUser()) {
                  return <Redirect to='/profile' />;
                }
                return (
                  <LoginPage
                    {...props}
                    handleBack={this.handleBack}
                    updateUser={this.updateUser}
                    handleNotification={this.handleNotification}
                  />
                );
              }}
            />

            <Route
              path='/not-found'
              render={(props) => (
                <NotFound {...props} handleBack={this.handleBack} />
              )}
            />

            <Route
              exact
              path='/'
              render={(props) => (
                <QrPage {...props} handleBack={this.handleBack} />
              )}
            />
            <Redirect to='/not-found' />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default Application;
