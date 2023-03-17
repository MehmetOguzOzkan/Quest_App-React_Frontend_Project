import './App.css';
import Navbar from './components/Navbar/Navbar'
import User from './components/User/User'
import Home from './components/Home/Home'
import Auth from './components/Auth/Auth'
import {BrowserRouter,Route,Routes,Navigate} from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route exact path='/' element={<Home/>}/>
          <Route exact path='/users/:userId' element={<User/>}/>
          {
            localStorage.getItem("currentUser") != null ?
            <Route exact path='/auth' element={<Navigate to="/" replace/>}/>
            : <Route exact path='/auth' element={<Auth/>}/>
          }
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
