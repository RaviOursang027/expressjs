import * as React from "react";
import "./auth.css";
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
import CheckIcon from "@mui/icons-material/Check";
import CustomSnackbar from "./../shared/snackbar";
import { GoogleLogin } from "@react-oauth/google";

import {
  isAlphanumeric,
  containsUppercase,
  containsSpecialCharacters,
} from "../shared/utils";
import axios from "axios";

export default function Signup() {
  const SERVER_URI = process.env.REACT_APP_SERVER_URI;
  const SIGN_UP_URL = `${SERVER_URI}/signup`;
  const GOOGLE_LOGIN_URL = `${SERVER_URI}/google-login`;

  const [showPassword, setShowPassword] = React.useState(false);
  const [emailId, setEmailId] = React.useState("");
  const [name, setName] = React.useState(" ")
  const [password, setPassword] = React.useState("");
  const [isEmailValid, setIsEmailValid] = React.useState(true);
  const [isPasswordValid, setIsPasswordValid] = React.useState(true);
  const [enableCreatebtn, setEnableCreatebtn] = React.useState(false);
  const [isLengthValid, setIsLengthValid] = React.useState(false);
  const [isAlphaNumericValid, setIsAlphaNumericValid] = React.useState(false);
  const [isSpecialCharacterValid, setIsSpecialCharacterValid] =
    React.useState(false);
  const [isCapitalLetterValid, setIsCapitalLetterValid] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [variant, setMessageVariant] = React.useState("");
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const onEmailIdChange = (e) => {
    let emailid = e.target.value;
    setEmailId(emailid);
    let valitdator =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z0-9-]+\.)+(com|in)))$/;
    if (valitdator.test(emailid)) {
      setIsEmailValid(true);
      if (password.length != 0) {
        setEnableCreatebtn(true);
      }
    } else {
      setIsEmailValid(false);
      if (password.length == 0) {
        setEnableCreatebtn(false);
      }
    }
  };

  const onPasswordChange = (e) => {
    let value = e.target.value;
    setPassword(value);
    if (password.length <= 1) {
      setIsPasswordValid(false);
    } else {
      setIsPasswordValid(true);
    }
    validateFields(value);
  };

  const validateFields = (value) => {
    // verify length
    if (value.length >= 8) setIsLengthValid(true);
    else setIsLengthValid(false);

    // verify alphanumeric
    // if (isAlphanumeric(value)) setIsAlphaNumericValid(true);
    //  else setIsAlphaNumericValid(false);
    // if (isAlphanumeric(value)) {
    //   setIsAlphaNumericValid(true);
    // } else {
    //   setIsAlphaNumericValid(false);
    // }

    // function isNumeric(value) {
    //   // Use a regular expression to check if the value is numeric
    //   return /^[0-9]+$/.test(value);
    // }
    
    // Usage
    if (isAlphanumeric(value)) {
      setIsAlphaNumericValid(true);
    } else {
      setIsAlphaNumericValid(false);
    }

    // verify capital letter
    if (containsUppercase(value)) setIsCapitalLetterValid(true);
    else setIsCapitalLetterValid(false);

    // verify special characters
    if (containsSpecialCharacters(value)) setIsSpecialCharacterValid(true);
    else setIsSpecialCharacterValid(false);

    console.log(
      isEmailValid,
      value.length >= 8,
      isAlphanumeric(value),
      containsUppercase(value),
      containsSpecialCharacters(value)
    );
    if (
      isEmailValid &&
      value.length >= 8 &&
      isAlphanumeric(value) &&
      containsUppercase(value) &&
      containsSpecialCharacters(value)
    ) {
      setEnableCreatebtn(true);
    } else {
      setEnableCreatebtn(false);
    }
  };

  const createUser = function () {
    // let URL = "https://techmega.cloud/api/signup";
    let data = {
      name: name,
      email: emailId,
      password: password,
    };
    axios
      .post(SIGN_UP_URL, data)
      .then((res) => {
        setOpen(true);
        if (res.data.success || res.data.message) {
          setMessage(res.data.message);
          setMessageVariant("success");
          setName("")
          setEmailId("");
          setPassword("");
          setEnableCreatebtn(false);
          validateFields("");
        } else if (res.data.warning) {
          setMessage(res.data.warning);
          setMessageVariant("warning");
        } else if (res.data.error) {
          setMessage(res.data.error);
          setMessageVariant("error");
        }
      })
      .catch((err) => {
        setMessage(err);
        setMessageVariant("error");
      });
  };

  const credentialResponse = (response) => {
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

            <div className="formValidation">
              <div className="signUpTitle">
                {/* Email id
              <p>Shubham.kothari@techmega.com</p> <br /> */}
                Your password should have
                <ul>
                  <li className={isLengthValid ? "active" : ""}>
                    <CheckIcon /> At least 8 characters
                  </li>
                  <li className={isAlphaNumericValid ? "active" : ""}>
                    <CheckIcon /> One alphanumeric
                  </li>
                  <li className={isSpecialCharacterValid ? "active" : ""}>
                    <CheckIcon /> One special character
                  </li>
                  <li className={isCapitalLetterValid ? "active" : ""}>
                    <CheckIcon /> One capital character
                  </li>
                </ul>
              </div>
            </div>
          </Grid>
          <Grid item sm={4} md={4}>
            <Card className="loginCard">
              <p className="logoName">VirtuVerse</p>
              <p className="logoSubText">
                Where Your Digital Universe Unfolds!
              </p>

              <div className="createAccount">
                <p>Create an Account</p>
                <GoogleLogin
                  onSuccess={credentialResponse}
                  type="icon"
                  shape="circle"
                  onError={errorMessage}
                  logo_alignment="center"
                />
              </div>

              <div className="hrAfter mt-35">
                <hr></hr>
              </div>

              <div className="signUpTitle">
                Sign up with email
                <p>
                  Already have an account?
                  <Link to="/login"> Sign In</Link>
                </p>
              </div>
              <div className="inputField">
              <TextField
                  type="text" // Change the input type to "text"
                  label="Name"
                  variant="filled"
                  size="small"
                  fullWidth
                  onChange={(e)=>setName(e.target.value)}
                />
              </div>

              <div className="inputField">
                <TextField
                  type="email"
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
                    error={!isPasswordValid}
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

              <div className="inputField">
                <Button
                  variant="contained"
                  fullWidth
                  onClick={createUser}
                  disabled={
                    !enableCreatebtn || !isEmailValid || !isPasswordValid
                  }
                >
                  CREATE
                </Button>
              </div>
              <p className="signUpText">
                <Link to="/login"> Back to Sign In</Link>
              </p>
            </Card>
          </Grid>
          {/* <Grid item xs={1}></Grid> */}
        </Grid>
        <CustomSnackbar message={message} variant={variant} open={open} />
      </div>
    </div>
  );
}

// export default function Signup();
