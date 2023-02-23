import { Route, Routes } from 'react-router-dom';
import ReactorDesigner from './routes/ReactorDesigner';
import './App.css'
import About from './routes/About';

function App() {
  return (
    <Routes>
      <Route path="/" element={<ReactorDesigner />} />
      <Route path="/About" element={<About />} />
    </Routes>
  )
}

export default App;
