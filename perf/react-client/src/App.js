import logo from './logo.svg';
import './App.css';
import socket from "./utilities/socketConnection";
import {Component} from "react";
import Widget from "./Widget";

class App extends Component{
  constructor (props) {
    super(props)
    this.state = {
      performanceData: {

      }
    }
  }

  componentDidMount() {
    socket.on('data', (data) => {
      // inside this callback we just gome some new data!
      // lets update state so we can re-render app --> widget --> cpu
      // we need to make a copy of current state
      // so we can mutate it!
      const currentState = ({ ...this.state.performanceData})
      // const currentState = Object.assign(this.state.performanceData)
      // currentState is an object! Not an array!
      // the reason for this is so we can use the machines
      // macA as it's property
      currentState[data.macA] = data
      this.setState({
        performanceData: currentState
      })
    })
  }

  render() {

    // console.log(this.state.performanceData)

    let widgets = []
    const data = this.state.performanceData

    // grab each machine, by property, from data
    Object.entries(data).forEach(([key, value]) => {
      widgets.push(<Widget key={key} data={value} />)
    })

    console.log(widgets)

    return (
      <div className="App">
        { widgets }
      </div>
    ) };
}

export default App;
