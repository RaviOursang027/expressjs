import { Outlet, Link } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Button from "@mui/material/Button";
import { createTheme } from "@mui/material/styles";

import Signup from "./components/auth/signup.js";
import Login from "./components/auth/login.js";
import OtpLogin from "./components/auth/otplogin.js";
import Reset from "./components/auth/resetpassword.js";
import Forgot from "./components/auth/forgotpassword.js";
import CustomSnackbar from "./components/shared/snackbar";
import Activateuser from "./components/auth/activateuser";
import Home from "./components/home";
import Overview from "./components/overview";
import Support from "./components/support";
import Profile from "./components/profile";
import Packages from "./components/packages";
import CustomizePackages from "./components/packagescustomize";
import Checkout from "./components/checkout";
// import Status from "./components/auth/status.js";
import Footer from "./components/shared/footer.js";
import Buffer from "./components/shared/Buffer.js";
// import Deleteaccount from "./components/shared/Deleteaccount.js";
import FileList from "./components/filefolder/FileList.js";


function App() {
  return (
    <div>
      <Routes>
        <Route path="*" element={<Login />}></Route>
        <Route path="/" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/otplogin" element={<OtpLogin />}></Route>
        <Route path="/resetpassword/:token/:emailId" element={<Reset />}></Route>
        <Route path="/forgotpassword" element={<Forgot />}></Route>
        <Route path="/snackbar" element={<CustomSnackbar />}></Route>
        <Route path="/activateUser/:token/:emailId" element={<Activateuser />}></Route>

        <Route path="/home" element={<Home />}></Route>
        <Route path="/overview" element={<Overview />}></Route>
        <Route path="/support" element={<Support />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/packages" element={<Packages />}></Route>
        {/* <Route
          path="/customizepackages/:categoryChecked"
          element={<CustomizePackages />}
        ></Route> */}
        <Route path="/checkout" element={<Checkout />}></Route>
        <Route path="/buffer" element={<Buffer />}></Route>
        {/* <Route path="/deleteaccount" element={<Deleteaccount/>}></Route> */}
        {/* <Route path="/status" element={<Status />}></Route> */}
        <Route path="/files" element={<div className="App"><FileList /></div>}></Route>
      </Routes>

      {/* <Link to="/Login">
          <Button variant="contained">Login</Button>
        </Link> 

        <Outlet /> */}
    </div>
    // <div className="App">
    //   <header className="App-header">

    //     <Link to="/Login">Blogs</Link>

    //     <Outlet/>

    //   </header>
    // </div>
  );
}

export default App;
