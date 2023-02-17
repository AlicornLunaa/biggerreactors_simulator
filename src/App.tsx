import reactorLogo from './assets/reactorsim.svg'
import './App.css'
import ReactorWindow from './components/ReactorWindow'
import { Dialog, Grid, TextField } from '@mui/material'
import MaterialList from './components/MaterialList'
import { useState } from 'react'
import { Material } from './classes/Materials'

function App() {
  const [material, setMaterial] = useState<Material | null>(null);
  const [openReactorSetup, setOpenReactorSetup] = useState(false);
  const [useOldMaterial, setUseOldMaterial] = useState(false);

  return (
    <div className="App">
      <div className="header">
        <div className="logoBar">
          <img className="logo" src={reactorLogo}/>
          <div className="title">Reactor Simulator</div>
        </div>
        <div className="actions">
          <button onClick={() => {setOpenReactorSetup(true)}}>New</button>
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
      
      <Dialog className="reactorSetup" open={openReactorSetup} onClose={() => {setOpenReactorSetup(false)}}>
        <p>Setup New Reactor</p>
        <div className="reactorSetupContent">
          <TextField autoFocus margin="dense" id="width" label="Width" type="number" variant="standard" />
          <TextField autoFocus margin="dense" id="height" label="Height" type="number" variant="standard" />
        </div>
        <div className="reactorSetupActions">
          <button onClick={() => setOpenReactorSetup(false)}>Cancel</button>
          <button onClick={() => setOpenReactorSetup(false)}>New</button>
        </div>
      </Dialog>
    </div>
  )
}

export default App;
