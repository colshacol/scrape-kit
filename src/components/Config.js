import * as React from 'react'
import socket from '../socket'

import './styles/Config.css'

export default class Config extends React.Component {
  state = {
    query: 'EMAIL ADDRESS REGEX',
    depth: '50',
    busy: false,
  }

  componentDidMount() {
    socket.on('done', () => {
      this.setState({ busy: false })
    })
  }

  setQuery = (event) => {
    const { value: query } = event.target
    this.setState({ query })
  }

  submit = async () => {
    socket.emit('search', this.state)
    this.setState({ busy: true })
  }

  setDepth = (event) => {
    const { value } = event.target
    const lessThanZero = Number(value) < 0
    const isEmpty = value.length === 0
    const greaterThan50 = Number(value) > 50

    if (isEmpty) return this.setState({ depth: this.state.depth })
    if (lessThanZero) return this.setState({ depth: '0' })
    if (greaterThan50) return this.setState({ depth: '50' })
    this.setState({ depth: value })
  }

  render() {
    return (
      <div className="Config">
        <span className="input">
          <label htmlFor="depth">Depth</label>
          <input
            id="depth"
            type="number"
            placeholder="Crawling Depth"
            value={this.state.depth}
            onChange={this.setDepth}
          />
        </span>
        <span className="input">
          <label htmlFor="query">Query</label>
          <input
            id="query"
            style={{ width: '185px' }}
            value={this.state.query}
            onChange={this.setQuery}
            placeholder="What to Google"
          />
        </span>
        <button disabled={this.state.busy} onClick={this.submit}>
          Submit
        </button>
      </div>
    )
  }
}
