import { BrowserRouter, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import ImagePage from "./pages/ImagePage"
import VideoPage from "./pages/VideoPage"


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
           <Route path="" element={<HomePage/>}/>
           <Route path="image" element={<ImagePage/>}/>
           <Route path="video" element={<VideoPage/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
