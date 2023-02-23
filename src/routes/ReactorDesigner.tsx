import { useState } from 'react'
import { Dialog, Grid, TextField } from '@mui/material'

import { Material } from '../classes/Materials'
import ReactorWindow from '../components/ReactorWindow'
import MaterialList from '../components/MaterialList'

import reactorLogo from '../assets/reactorsim.svg'
import { Link } from 'react-router-dom'

function ReactorDesigner() {
  const [material, setMaterial] = useState<Material | null>(null);
  const [openReactorSetup, setOpenReactorSetup] = useState(false);
  const [useOldMaterial, setUseOldMaterial] = useState(false);

  const [width, setWidth] = useState<number>(3);
  const [depth, setDepth] = useState<number>(3);
  const [height, setHeight] = useState<number>(3);

  return (
    <div className="App">
      <div className="header">
        <div className="logoBar">
          <img className="logo" src={reactorLogo}/>
          <div className="title">Reactor Simulator</div>
        </div>
        <div className="actions">
          <Link className="buttonLink" to="/About">About</Link>
          <button onClick={() => {setOpenReactorSetup(true)}}>New</button>
          {/* <button>Save</button>
          <button>Load</button> */}
        </div>
      </div>
      
      <Grid container spacing={1} paddingTop={1.5} columns={{ xs: 3, md: 12 }}>
        <Grid item xs={3} textAlign="left">
          <MaterialList setMaterial={setMaterial} useOldMaterials={useOldMaterial} />
        </Grid>
        <Grid item xs={9}>
          <ReactorWindow material={material} width={width} depth={depth} height={height} />
        </Grid>
      </Grid>
      
      <Dialog className="reactorSetup" open={openReactorSetup} onClose={() => {setOpenReactorSetup(false)}}>
        <p>Setup New Reactor</p>
        <div className="reactorSetupContent">
          <TextField className="reactorSetupInput" value={width} onChange={event => setWidth(Number(event.target.value))} autoFocus margin="dense" id="width" label="Width" type="number" variant="standard" />
          <TextField className="reactorSetupInput" value={depth} onChange={event => setDepth(Number(event.target.value))} margin="dense" id="depth" label="Depth" type="number" variant="standard" />
          <TextField className="reactorSetupInput" value={height} onChange={event => setHeight(Number(event.target.value))} margin="dense" id="height" label="Height" type="number" variant="standard" />
        </div>
        <div className="reactorSetupActions">
          <button onClick={() => setOpenReactorSetup(false)}>Done</button>
        </div>
      </Dialog>
    </div>
  )
}

export default ReactorDesigner;
