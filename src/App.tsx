import reactorLogo from './assets/reactorsim.svg'
import './App.css'
import ReactorWindow from './components/ReactorWindow'
import { Grid } from '@mui/material'
import MaterialList from './components/MaterialList'
import { useState } from 'react'
import { Material } from './classes/Materials'

function App() {
  const [material, setMaterial] = useState<Material | null>(null);
  const [useOldMaterial, setUseOldMaterial] = useState(false);

  return (
    <div className="App">
      <div className="header">
        <div className="logoBar">
          <img className="logo" src={reactorLogo}/>
          <div className="title">Reactor Simulator</div>
        </div>
        <div className="actions">
          <button>New</button>
          <button>Save</button>
          <button>Load</button>
        </div>
      </div>
      <Grid container spacing={1} paddingTop={1.5} columns={{ xs: 3, md: 12 }}>
        <Grid item xs={3} textAlign="left">
          <MaterialList setMaterial={setMaterial} useOldMaterials={useOldMaterial} />
        </Grid>
        <Grid item xs={9}>
          <ReactorWindow material={material} />
        </Grid>
      </Grid>
    </div>
  )
}

export default App
