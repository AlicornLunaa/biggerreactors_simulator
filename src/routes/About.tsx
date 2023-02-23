import reactorLogo from '../assets/reactorsim.svg'
import { Link } from 'react-router-dom'
import "./About.css";

function About() {
  return (
    <div className="App">
      <div className="header">
        <div className="logoBar">
          <img className="logo" src={reactorLogo}/>
          <div className="title">Reactor Simulator</div>
        </div>
        <div className="actions">
          <Link className="buttonLink" to="/">Back</Link>
        </div>
      </div>
      <div className="about">
        <p>I made this project as a tool to help quickly develop <a href="https://github.com/BiggerSeries/BiggerReactors">Bigger Reactors </a>
        designs for the game Minecraft. The only other tool I could find was out of date and had a poor selection of moderators, so I made
        my own. I hope it is simple to use, but if you have suggestions leave them on the
        <a href="https://github.com/AlicornLunaa/biggerreactors_simulator"> github repo</a> and I might implement them. Please report any bugs
        to the github repo as well and I will fix them as quickly as possible. This is version one, so there are bound to be bugs or improvements.
        In addition to this being just version 1, in the future I hope to expand on this simulator to turbine design and simulation.</p>
      </div>
    </div>
  )
}

export default About;
