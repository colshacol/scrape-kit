import * as React from 'react'
import socket from '../socket'

import './styles/Status.css'

export default class Status extends React.PureComponent {
  state = {
    connected: false,
  }

  componentDidMount() {
    socket.on('connect', () => {
      this.setState({ connected: true })
    })

    socket.on('disconnect', () => {
      this.setState({ connected: false })
    })
  }

  render() {
    const className = this.state.connected ? 'connected' : 'notConnected'

    return (
      <div className={`Status ${className}`}>
        <small>{this.state.connected ? 'CONNECTED' : 'NOT CONNECTED'}</small>
      </div>
    )
  }
}
