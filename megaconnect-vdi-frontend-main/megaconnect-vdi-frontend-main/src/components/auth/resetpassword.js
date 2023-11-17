import * as React from "react";
import "./auth.css";
import { Link } from "react-router-dom";

import img1 from "./../../assets/images/img1.png";
import img2 from "./../../assets/images/img2.svg";
import img3 from "./../../assets/images/img3.svg";
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
import { useLocation } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import CustomSnackbar from "./../shared/snackbar";
import {
  isAlphanumeric,
  containsUppercase,
  containsSpecialCharacters,
} from "../shared/utils";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Reset() {
  const [isLengthValid, setIsLengthValid] = React.useState(false);
  const [isAlphaNumericValid, setIsAlphaNumericValid] = React.useState(false);
  const [isSpecialCharacterValid, setIsSpecialCharacterValid] =
    React.useState(false);
  const [isCapitalLetterValid, setIsCapitalLetterValid] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState("");
  const [isPasswordMatching, setIsPasswordMatching] = React.useState(false);
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [enableSavebtn, setEnableSavebtn] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const [showNewPassword, setNewShowPassword] = React.useState(false);
  const handleClickShowNewPassword = () => setNewShowPassword((show) => !show);

  const validationMsg = () => alert("Toggle Validation Block");

  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [variant, setMessageVariant] = React.useState("");
  const { token, emailId } = useParams();

  const SERVER_URI = process.env.REACT_APP_SERVER_URI;
  const RESET_URL = `${SERVER_URI}/reset-password`;

  const Save = () => {
    // let URL = "https://techmega.cloud/api/reset-password";
    let data = {
      resetPasswordLink: token,
      "newPassword": newPassword,
    };
    axios.put(RESET_URL, data).then((res) => {
      setOpen(true);
      if (res.data.success) {
        setMessage(res.data.success);
        setMessageVariant("success");
        // redirect to home page
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } else if (res.data.warning) {
        setMessage(res.data.warning);
        setMessageVariant("warning");
      } else if (res.data.error) {
        setMessage(res.data.error);
        setMessageVariant("error");
      }
    });
    setTimeout(function () {
      setOpen(false);
    }, 5000);
  };

  const onNewPasswordChange = (e) => {
    let value = e.target.value;
    setNewPassword(value);
    console.log(value, newPassword, confirmPassword);
    if (confirmPassword == e.target.value) {
      setIsPasswordMatching(true);
      setEnableSavebtn(true);
    } else {
      setIsPasswordMatching(false);
      setEnableSavebtn(false);
    }
    validateFields(value, "new");
  };

  const onConfirmPasswordChange = (e) => {
    let value = e.target.value;
    setConfirmPassword(value);
    console.log(value, newPassword, confirmPassword);

    if (newPassword == e.target.value) {
      setIsPasswordMatching(true);
      setEnableSavebtn(true);
    } else {
      setIsPasswordMatching(false);
      setEnableSavebtn(false);
    }
    validateFields(value, "confirm");
  };

  const validateFields = (value, type) => {
    let np = newPassword;
    let cp = confirmPassword;

    if (type == "confirm") {
      cp = value;
    } else if (type == "new") {
      np = value;
    }

    // verify length
    if (np.length >= 8 && cp.length >= 8) setIsLengthValid(true);
    else setIsLengthValid(false);

    // verify alphanumeric
    console.log(isAlphanumeric(np), isAlphanumeric(cp));
    if (isAlphanumeric(np) && isAlphanumeric(cp)) setIsAlphaNumericValid(true);
    else setIsAlphaNumericValid(false);

    // verify capital letter
    if (containsUppercase(np) && containsUppercase(cp))
      setIsCapitalLetterValid(true);
    else setIsCapitalLetterValid(false);

    // verify special characters
    if (containsSpecialCharacters(np) && containsSpecialCharacters(cp))
      setIsSpecialCharacterValid(true);
    else setIsSpecialCharacterValid(false);
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
              <span onClick={validationMsg}></span>
              <div className="signUpTitle">
                Registered Email id
                <p>{emailId}</p> <br />
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

              {/***********  Sign Up  **************/}
              <div>
                <h2>Reset Password</h2>
                <div className="inputField">
                  <FormControl variant="filled" size="small" fullWidth>
                    <InputLabel htmlFor="filled-adornment-password">
                      New Password
                    </InputLabel>
                    <FilledInput
                      id="filled-adornment-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={onNewPasswordChange}
                      helperText="Please enter valid email address"
                      error={!isPasswordMatching}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowNewPassword}
                            edge="end"
                          >
                            {showNewPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </div>

                <div className="inputField">
                  <FormControl variant="filled" size="small" fullWidth>
                    <InputLabel htmlFor="filled-adornment-password">
                      Confirm Password
                    </InputLabel>
                    <FilledInput
                      id="filled-adornment-password"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={onConfirmPasswordChange}
                      error={!isPasswordMatching}
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
                    onClick={Save}
                    disabled={
                      !enableSavebtn ||
                      !isAlphaNumericValid ||
                      !isLengthValid ||
                      !isCapitalLetterValid ||
                      !isSpecialCharacterValid
                    }
                  >
                    SAVE CHANGES
                  </Button>
                </div>
                <p className="signUpText top">
                  <Link to="/login"> Back to Sign In</Link>
                </p>
              </div>
            </Card>
          </Grid>
          {/* <Grid item xs={1}></Grid> */}
        </Grid>
        <CustomSnackbar message={message} variant={variant} open={open} />
      </div>
    </div>
  );
}

// export default function Reset();
