import React from 'react'
var userLocation = 'unknown'
class Location extends React.Component {
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
         userLocation = JSON.stringify(position);
        this.setState({userLocation});
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  render() {
    return (
      <span>
          {this.state.userLocation}
      </span>
    );
  }
}
