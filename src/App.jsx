import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import CustomCursor from './components/CustomCursor'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Prologue from './pages/Prologue.jsx'
import Work from './pages/Work.jsx'
import WorkDetail from './pages/WorkDetail.jsx'
import Archive from './pages/Archive.jsx'
import Note from './pages/Note.jsx'

function App() {
  return (
    <BrowserRouter>
      <CustomCursor />
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/prologue" element={<Prologue />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:slug" element={<WorkDetail />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/note" element={<Note />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
