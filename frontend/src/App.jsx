import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login"
import { ProtectedRoute } from "./routes/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/main' element={<ProtectedRoute/>}/>
      </Routes>
    </Router>
  );
}

export default App;