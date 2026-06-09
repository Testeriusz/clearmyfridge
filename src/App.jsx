import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Fridge from './pages/Fridge'
import Recipes from './pages/Recipes'
import Shopping from './pages/Shopping'
import Alerts from './pages/Alerts'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen pb-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fridge" element={<Fridge />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/shopping" element={<Shopping />} />
          <Route path="/alerts" element={<Alerts />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}
