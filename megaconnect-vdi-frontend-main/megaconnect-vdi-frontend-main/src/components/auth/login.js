import * as React from "react";
import styles from "./auth.css";
import { Link } from "react-router-dom";

import img1 from "./../../assets/images/img1.png";
import img2 from "./../../assets/images/img2.svg";
import img3 from "./../../assets/images/img3.svg";
import facebook from "./../../assets/images/facebook.svg";
import google from "./../../assets/images/google.svg";
import playBtn from "./../../assets/images/playBtn.svg";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import Card from "@mui/material/Card";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import FilledInput from "@mui/material/FilledInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import CustomSnackbar from "./../shared/snackbar";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import CircularProgress from "@mui/material/CircularProgress";

export default function Login() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [emailId, setEmailId] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [mobno, setMobNo] = React.useState("");
  const [isEmailValid, setIsEmailValid] = React.useState(true);
  const [isPasswordValid, setIsPasswordValid] = React.useState(true);
  const [enableLoginbtn, setEnableLoginbtn] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [variant, setMessageVariant] = React.useState("");
  const [user, setUser] = React.useState([]);
  const [isLoginSubmitted, setIsLoginSubmitted] = React.useState(false);

  const SERVER_URI = process.env.REACT_APP_SERVER_URI;
  const SIGN_IN_URL = `${SERVER_URI}/signin`;
  const GOOGLE_LOGIN_URL = `${SERVER_URI}/google-login`;
  const [spinner, setSpinner] = React.useState(false);

  React.useEffect(() => {
    // localStorage.setItem("accessToken", "");
  })

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const onEmailIdChange = (e) => {
    let emailid = e.target.value;
    setEmailId(emailid);
    let valitdator =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (valitdator.test(emailid)) {
      setIsEmailValid(true);
      if (password.length != 0) {
        setEnableLoginbtn(true);
      }
    } else {
      setIsEmailValid(false);
      if (password.length == 0) {
        setEnableLoginbtn(false);
      }
    }
  };

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
    if (password.length <= 1) {
      setIsPasswordValid(false);
      setEnableLoginbtn(false);
    } else {
      setIsPasswordValid(true);
      setEnableLoginbtn(true);
    }
  };

  const onLogin = function (e) {
    // remove once api is up and runnning
    setIsLoginSubmitted(true);
    setSpinner(true);
    let data = {
      email: emailId,
      password: password,
    };
    axios
      .post(SIGN_IN_URL, data)
      .then((res) => {
        setSpinner(false);
        setOpen(true);
        if (res.data.success) {
          let data = res?.data;
          setMessage(data.message);
          setMessageVariant("success");
          setTimeout(() => {
            window.location.href = "/home";
          }, 2000);
          console.log(data.token);
          localStorage.setItem("accessToken", data.token);
          setIsLoginSubmitted(false);
        } 
        else if (res.data.warning) {
          setMessage(res.data.warning);
          setMessageVariant("warning");
          setIsLoginSubmitted(false);
        } 
        else if (res.data.message) {
          setMessage(res.data.message);
          setMessageVariant("warning");
          setIsLoginSubmitted(false);
        }
        else if (res.data.error) {
          setMessage(res.data.error);
          setMessageVariant("error");
          setIsLoginSubmitted(false);
        }
        // redirect to home page
      })
      .catch((err) => {
        setOpen(true);
        setMessage(err.message);
        setMessageVariant("error");
        setIsLoginSubmitted(false);
      });
    setTimeout(function () {
      setOpen(false);
    }, 1000);
  };

   const credentialResponse = (response) => {
    console.log("credentialResponse", response);
    let d = {
      credential: response?.credential,
    };
    axios
      .post(GOOGLE_LOGIN_URL, d)
      .then((res) => {
        setOpen(true);
        if (res.data.success) {
          setMessage(res.data.message);
          setMessageVariant("success");
          setTimeout(() => {
            window.location.href = "/home";
          }, 3000);
        } else if (res.data.warning) {
          setMessage(res.data.warning);
          setMessageVariant("warning");
        } else if (res.data.error) {
          setMessage(res.data.error);
          setMessageVariant("error");
        }
      })
      .catch((err) => {
        setOpen(true);
        setMessage(err);
        setMessageVariant("error");
      });
    setTimeout(function () {
      setOpen(false);
    }, 5000);
  };

  const errorMessage = (error) => {
    console.log(error);
    alert(error);
  };

  return (
    <div className="auth">
      <div className="LoginBg">
        <Grid container className="container">
          <Grid item xs={8} className="sliderCard">
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid item xs={12}>
                <div className="pic-ctn">
                  <span>
                    <Grid
                      container
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Grid item xs={5} className="sliderTitle">
                        <div className="typedContainer">
                          <p className="typed">Enhance</p>
                        </div>
                        <p className="sliderSubTitle">
                          Accuracy | Speed | Reach
                        </p>
                      </Grid>
                      <Grid item xs={6}>
                        <img src={img1} alt="" className="pic" width="100%" />
                      </Grid>
                    </Grid>
                  </span>

                  <span>
                    <Grid
                      container
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Grid item xs={5} className="sliderTitle">
                        <div className="typedContainer">
                          <p className="typed">Deliver</p>
                        </div>
                        <p className="sliderSubTitle">
                          Context | Content | Expertise
                        </p>
                      </Grid>
                      <Grid item xs={7}>
                        <img src={img2} alt="" className="pic" width="100%" />
                      </Grid>
                    </Grid>
                  </span>

                  <span>
                    <Grid
                      container
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Grid item xs={5} className="sliderTitle">
                        <div className="typedContainer">
                          <p className="typed">Embrace</p>
                        </div>
                        <p className="sliderSubTitle">
                          Smart | Secure | Simple
                        </p>
                      </Grid>
                      <Grid item xs={7}>
                        <img src={img3} alt="" className="pic" width="100%" />
                      </Grid>
                    </Grid>
                  </span>
                </div>
              </Grid>
            </Grid>

            {/* <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            className="productTour"
          >
             <a href="#"><img src={playBtn} /></a>  &nbsp; Product Tour    
          </Grid> */}
          </Grid>
          <Grid item sm={4} md={4}>
            <Card className="loginCard">
              <p className="logoName">VirtuVerse</p>
              <p className="logoSubText">
                Where Your Digital Universe Unfolds!
              </p>
              <div className="inputField">
                <TextField
                  error={!isEmailValid}
                  label="Email Id"
                  variant="filled"
                  size="small"
                  fullWidth
                  helperText={
                    isEmailValid ? "" : "Please enter valid email address"
                  }
                  regex="/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/"
                  value={emailId}
                  onChange={(e) => onEmailIdChange(e)}
                />
              </div>

              <div className="inputField">
                <FormControl variant="filled" size="small" fullWidth>
                  <InputLabel htmlFor="filled-adornment-password">
                    Password
                  </InputLabel>
                  <FilledInput
                    id="filled-adornment-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => onPasswordChange(e)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </div>
              <div className="inputField checkbox">
                <FormControlLabel
                  control={
                    <Checkbox
                      defaultChecked
                      sx={{ "& .MuiSvgIcon-root": { fontSize: 20 } }}
                    />
                  }
                  label="Remember Password"
                />
                <Link to="/forgotpassword">
                  <span className="ForgotPassword">Forgot Password?</span>
                </Link>
              </div>
              <div className="mt-25">
                <Button
                  variant="contained"
                  fullWidth
                  onClick={onLogin}
                  disabled={
                    !isEmailValid || password.length == 0 || isLoginSubmitted
                  }
                >
                  LOGIN {spinner ? (<CircularProgress style={{width: '15px', height: '15px', marginLeft: '10px'}} />) : ("")}
                </Button>
              </div>
              <div className="hrAfter mt-70">
                <hr></hr>
              </div>
              <div className="otp">
                <Link to="/otplogin">
                  <p className="align-center">Login via OTP</p>
                </Link>
                &nbsp;
                {/* 
              <a href="#">
                <img src={facebook} />
              </a>
              <a href="#">  
              <img src={google} onClick={onGooglelogin} />
              </a>
               */}
              </div>
              <div className="socialMediaLogin">
                <GoogleLogin
                  onSuccess={credentialResponse}
                  type="icon"
                  shape="circle"
                  onError={errorMessage}
                  logo_alignment="center"
                />
              </div>
              <p className="signUpText">
                <span>Don’t have an account?</span>
                <Link to="/signup"> Sign up</Link>
              </p>
            </Card>
          </Grid>
          {/* <Grid item xs={1}></Grid> */}
        </Grid>
        <CustomSnackbar
          message={message}
          variant={variant}
          open={open}
          onClose={handleClose}
        />
        {/* <GoogleLogin onSuccess={credentialResponse} onError={errorMessage} /> */}
      </div>
    </div>
  );
}

// export default function Login();
