import React from 'react'
import socket from '../socket'
import TimeAgo from 'react-timeago'
import './styles/Output.css'

const DEFAULT_MESSAGE = {
  title: 'Waiting for query',
  text: 'Use the form above to start your scrape.',
  date: new Date(),
}

export default class Output extends React.Component {
  state = {
    messages: [DEFAULT_MESSAGE],
  }

  componentDidMount() {
    socket.on('outputMessage', (message) => {
      this.setState({ messages: [...this.state.messages, message] })
    })
  }

  render() {
    return (
      <div className="Output">
        {this.state.messages.map((message) => (
          <div className="message">
            <p>
              <span className="title">{message.title}</span>
              <TimeAgo className="date" date={message.date} />
              <br />
              {message.text}
            </p>
          </div>
        ))}
      </div>
    )
  }
}
