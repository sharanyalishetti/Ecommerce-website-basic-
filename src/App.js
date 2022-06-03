import { FcApproval } from "react-icons/fc";
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Components/Home'
import Signup from './Components/Signup'
import Login from './Components/Login'
import ContactUs from './Components/ContactUs'
import {Route,Routes,NavLink } from 'react-router-dom';
import {useDispatch,useSelector} from 'react-redux'
import {useNavigate, Navigate} from 'react-router-dom'
import {Dropdown,DropdownButton,Navbar,Nav, NavDropdown,Container} from 'react-bootstrap'
import Userdashboard from "./Components/Userdashboard";
import { clearLoginStatus } from "./slices/userSlice";
import Userprofile from './Components/profile/Userprofile'
import Products from './Components/products/Products'
import Cart from './Components/cart/Cart'
function App() {

  //get state from store
  let {userObj, isError, isLoading, isSuccess, errMsg } = useSelector(
    (state) => state.user
  );

  //get dispatch function
  let dispatch = useDispatch()

  //get navigate function
  let navigate = useNavigate()

  //logout user
  const userLogout = () => {
    localStorage.clear()
    dispatch(clearLoginStatus()); 
    navigate('/login')
  }
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Navbar</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              {isSuccess !== true ?  (
                <>
                  {/* these links can be visible when no user login*/ }
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                      <NavLink className="nav-link active" to="">Home</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="signup">SignUp</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="login">Login</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="contactus">ContactUs</NavLink>
                    </li> 
                    </ul> 
                  </> 

                ) : (
                  <>
                  {/* this dropdown is visible only when a user is login */}
                  <Navbar bg="dark" expand="sm">
                      <Container>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                          <Nav className="ms-auto">
                            <NavDropdown title={userObj.username} id="basic-nav-dropdown">
                              <NavDropdown.Item >Change userName</NavDropdown.Item>
                              <NavDropdown.Item onClick={userLogout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                          </Nav>
                        </Navbar.Collapse>
                      </Container>
                    </Navbar>
                  </>
                )
              }       

          </div>
        </div>
      </nav>





      {/* Defining Routes */}
      <Routes>
        {/* Route for Home Component */}
        <Route path="/" element = {<Home/>}/>
        {/* Route for SignUp Component */}
        <Route path="/signup" element = {<Signup/>}/>
        {/* Route for Login Component */}
        <Route path="/login" element = {<Login/>}/>
        {/* Route for Contactus Component */}
        <Route path="/contactus" element = {<ContactUs/>}/>
        <Route path="/userdashboard" element= {<Userdashboard/>}>
          <Route path="profile" element = {<Userprofile/>}></Route>
          <Route path="cart" element = {<Cart/>}/> 
          <Route path="products" element = {<Products/>} />
          {/* Navigating to profile when child path is empty */}
          <Route path="" element= {<Navigate to="profile" replace = {true}/>}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
