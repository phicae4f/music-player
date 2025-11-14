import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.scss'
import { MainPage } from './pages/MainPage'
import { Layout } from './components/Layout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout><MainPage/></Layout>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
