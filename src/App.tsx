import { Route, Routes } from 'react-router-dom';
import ReactorDesigner from './routes/ReactorDesigner';
import About from './routes/About';
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<ReactorDesigner />} />
      <Route path="/About" element={<About />} />
    </Routes>
  )
}

export default App;
