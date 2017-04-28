import React from 'react'
import ReactDOM from 'react-dom'
import io from 'socket.io-client'

// GET USER LOCATION

let latitude;
let longitude;

var options = {
  enableHighAccuracy: false,
  // timeout: 10000,
  maximumAge: 0
};

function success(pos) {
   latitude = pos.coords.latitude;
   longitude = pos.coords.longitude;
  return latitude, longitude;
};
////// end LOCATION


function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
};

class App extends React.Component {
  constructor (props) {
    super(props)
    navigator.geolocation.getCurrentPosition(success, error, options);
    this.state = {
      messages: [] }
  }

  componentDidMount () {
    this.socket = io('/')
    this.socket.lat = latitude
    this.socket.lon = longitude
    this.socket.on('message', message => {
      console.log("socket.id", this.socket.id)
      this.setState({ messages: [message, ...this.state.messages] })
    })
  }

  handleSubmit = event => {
    const body = event.target.value
    if (event.keyCode === 13 && body) {
      const message = {
        body,
        from: 'Me',
        lat: latitude,
        lon: longitude
      }
      console.log(message.lat, message.lon)
      this.setState({ messages: [message, ...this.state.messages] })
      this.socket.emit('message', body)
      event.target.value = ''
    }
  }

  render () {
    const messages = this.state.messages.map((message, index) => {
      console.log( "from: ", message.from, "lat:", message.lat, " lat:", message.lon)
      return <li key={index}><b>{message.from}:</b>{message.body}  </li>
    })
    return (
      <div>
        <h1>Hello World</h1>
        <input type='text' placeholder='Enter a message...' onKeyUp={this.handleSubmit} />
        {messages}
      </div>
    )
  }
}


ReactDOM.render(<App />, document.getElementById('root'))
