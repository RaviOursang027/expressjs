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
import Card from "@mui/material/Card";
import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import axios from "axios";
import CustomSnackbar from "../shared/snackbar";
import OtpInput from "react-otp-input";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function OtpLogin() {
  const [mobno, setMobNo] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [screen, setScreen] = React.useState("send");
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [variant, setMessageVariant] = React.useState("");
  const [resendTimer, setResendTimer] = React.useState(0);
  const [isResendDisabled, setIsResendDisabled] = React.useState(false);

  const onMobNoChange = (e) => {
    setMobNo(e.target.value);
  };
  
  const sendOtp = function (e) {

    //validating the mobile number
    const isValidMobileNumber = /^(\d{10})$/.test(mobno);
    if (!isValidMobileNumber) {
      // Display an error message or handle invalid mobile number format.
      // For example:
      setOpen(true);
      setMessage("Invalid mobile number format. Please enter a 10-digit number.");
      setMessageVariant("error");
      return; 
    }
    let URL = "http://techmega.cloud:8000/api/send-otp";
    let data = {
      mobileNumber: mobno,
    };
    axios
      .post(URL, data)
      .then((res) => {
        setOpen(true);
        if (res.data.success) {
          setMessage(res.data.message);
          setMessageVariant("success");
          setScreen("verify");
        } else if (res.data.warning) {
          setMessage(res.data.message);
          setMessageVariant("warning");
        } else if (res.data.error) {
          setMessage(res.data.message);
          setMessageVariant("error");
        }
      })
      .catch((err) => {});
    setTimeout(function () {
      setOpen(false);
    }, 5000);
  };

  const verifyOtp = function (e) {
    let URL = "http://techmega.cloud:8000/api/verify-otp";
    let data = {
      mobileNumber: mobno,
      otp: otp,
    };
    axios
      .post(URL, data)
      .then((res) => {
        setOpen(true);
        if (res.data.success) {
          setMessage(res.data.message);
          setMessageVariant("success");
          localStorage.setItem("accessToken", res.data.token);
          setTimeout(() => {
            window.location.href = "/home";
          }, 3000);
        } else if (res.data.warning) {
          setMessage(res.data.message);
          setMessageVariant("warning");
        } else if (res.data.error) {
          setMessage(res.data.message);
          setMessageVariant("error");
        }
      })
      .catch((err) => {});
    setTimeout(function () {
      setOpen(false);
    }, 5000);
  };

  const handleResendClick = () => {
    sendOtp();
    // Set the resend timer to 30 seconds and disable the button
    setResendTimer(30);
    setIsResendDisabled(true);
  
    const updateTimer = () => {
      setResendTimer((prevTimer) => {
        if (prevTimer === 1) {
          setIsResendDisabled(false); // Enable the button when the timer reaches 1 second
          return 0; // Reset the timer to 0
        }
        return prevTimer - 1;
      });
    };
  
    // Start countdown
    const intervalId = setInterval(updateTimer, 1000);
    // Clear the interval after 30 seconds
    setTimeout(() => {
      clearInterval(intervalId);
    }, 30000);
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

              {/* SEND OTP */}
              {screen != "verify" && (
                <div className="mt-70">
                <div className="inputField">
                <TextField
                  label="Mobile Number"
                  variant="filled"
                  size="small"
                  fullWidth
                  value={mobno}
                  onChange={(e) => onMobNoChange(e)}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, ''); // Allow only numeric input
                  }}
                />
              </div>
                  <div className="mt-25">
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={sendOtp}
                      disabled={mobno.length < 10}
                    >
                      SEND OTP
                    </Button>
                  </div>
                </div>
              )}

              {/* VERIFY OTP */}
              {screen == "verify" && (
                <div className="mt-70">
                  <p className="align-center">
                    We have sent you <strong>One Time Password </strong>to your
                    Mobile Number
                  </p>
                  <div className="otpClass">
                    <OtpInput
                      value={otp}
                      onChange={setOtp}
                      numInputs={6}
                      renderSeparator={<span>-</span>}
                      renderInput={(props) => <input {...props} />}
                    />
                  </div>
                  <div className="mt-35">
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={handleResendClick}
                          disabled={isResendDisabled}
                        >
                          {isResendDisabled ? `Resend OTP (${resendTimer}s)` : "RESEND OTP"}
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={verifyOtp}
                          disabled={otp.length < 4}
                        >
                          VERIFY OTP
                        </Button>
                      </Grid>
                    </Grid>
                  </div>
                </div>
              )}

              <div className="hrAfter mt-70">
                <hr></hr>
              </div>
              <div className="otp">
                <Link to="/login">
                  <p className="align-center">Login with another account</p>
                </Link>
              </div>
              <p className="signUpText">
                <span>Don’t have an account?</span>
                <Link to="/signup"> Sign up</Link>
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

// export default function OtpLogin();
