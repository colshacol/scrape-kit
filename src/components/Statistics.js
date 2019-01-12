import * as React from 'react'
import socket from '../socket'

import './styles/Statistics.css'

export default class Statistics extends React.Component {
  state = {
    emailsFound: 0,
    hrefsVisited: 0,
    urlsFound: 0,
    googleResults: 0,
    googleResultsDone: 0,
    pagesScraped: 0,
    emails: [],
  }

  componentDidMount() {
    socket.on('emailsFound', (emailsFound: string[]) => {
      this.setState({
        emailsFound: emailsFound.length,
        emails: emailsFound,
      })
    })

    socket.on('visitingHref', (href: string) => {
      this.setState({
        hrefsVisited: this.state.hrefsVisited + 1,
      })
    })

    socket.on('urlsFound', (urlCount: number) => {
      this.setState({
        urlsFound: this.state.urlsFound + urlCount,
      })
    })

    socket.on('googleResults', (urls: string[]) => {
      this.setState({
        googleResults: urls.length,
      })
    })

    socket.on('pageScraped', () => {
      this.setState({
        pagesScraped: this.state.pagesScraped + 1,
      })
    })
  }

  render() {
    return (
      <div className="Statistics">
        {/* <p>Results Queued: {this.state.googleResults}</p> */}
        <p>Pages Scraped: {this.state.pagesScraped}</p>
        <p>Emails found: {this.state.emailsFound}</p>
        {/* <p>Urls found: {this.state.urlsFound}</p> */}
        {/* <p>Urls visited: {this.state.hrefsVisited}</p> */}
        <div
          style={{
            marginTop: '16px',
            padding: '8px',
            background: 'white',
            borderTop: '1px solid black',
            overflowY: 'scroll',
            height: '100%',
          }}
        >
          {this.state.emails.map((email) => (
            <div>{email}</div>
          ))}
        </div>
      </div>
    )
  }
}
