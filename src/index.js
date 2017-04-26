import React from 'react'
import ReactDOM from 'react-dom'
import io from 'socket.io-client'


let userLocation = [];

var options = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 0
};

function success(pos) {
  userLocation = [pos.coords.latitude, pos.coords.longitude];
  console.log(userLocation)
};

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
    this.socket.on('message', message => {
      this.setState({ messages: [message, ...this.state.messages] })
    })
  }

  handleSubmit = event => {
    const body = event.target.value
    if (event.keyCode === 13 && body) {
      const message = {
        body,
        from: 'Me',

      }
      this.setState({ messages: [message, ...this.state.messages] })
      this.socket.emit('message', body)
      event.target.value = ''
    }
  }

  render () {
    const messages = this.state.messages.map((message, index) => {
      return <li key={index}><b>{message.from}:</b>{message.body} {message.location}, </li>
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
