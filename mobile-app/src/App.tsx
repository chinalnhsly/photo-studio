import React, { PropsWithChildren } from 'react'
import './app.scss'

class App extends React.Component<PropsWithChildren> {
  render() {
    return this.props.children
  }
}

export default App
