import { BrowserRouter, Routes, Route } from "react-router-dom"
import InputForm from "./pages/InputForm"
import Display from "./pages/Display"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InputForm />} />
        <Route path="/display" element={<Display />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
