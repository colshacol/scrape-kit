import React from 'react'
import Output from './Output'
import Statistics from './Statistics'
import Status from './Status'
import Config from './Config'

import './styles/App.css'

const TopBar = (props) => {
  return (
    <div className="TopBar">
      <h2 className="logo">Scrape Kit</h2>
      <Status />
    </div>
  )
}

export default class App extends React.Component {
  emailsFound = []

  render() {
    return (
      <div className="App">
        <TopBar />
        <Config />
        <div style={{ display: 'flex', height: '100%' }}>
          {true && <Statistics />}
          <Output />
        </div>
      </div>
    )
  }
}
