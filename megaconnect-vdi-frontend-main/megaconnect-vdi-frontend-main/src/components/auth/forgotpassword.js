import * as React from "react";
import "./auth.css";
import { Link } from "react-router-dom";

import img1 from "./../../assets/images/img1.png";
import img2 from "./../../assets/images/img2.svg";
import img3 from "./../../assets/images/img3.svg";
import playBtn from "./../../assets/images/playBtn.svg";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import axios from "axios";
import CustomSnackbar from "./../shared/snackbar";

export default function Forgot() {
  const [emailId, setEmailId] = React.useState("");
  const [isEmailValid, setIsEmailValid] = React.useState(true);
  const [enableResetLinkbtn, setEnableResetLinkbtn] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [variant, setMessageVariant] = React.useState("");
  

  const SERVER_URI = process.env.REACT_APP_SERVER_URI;
  const FORGOT_URL = `${SERVER_URI}/forgot-password`;

  const onEmailIdChange = (e) => {
    let emailid = e.target.value;
    setEmailId(emailid);
    let valitdator =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (valitdator.test(emailid)) {
      setIsEmailValid(true);
      setEnableResetLinkbtn(true);
    } else {
      setIsEmailValid(false);
      setEnableResetLinkbtn(false);
    }
  };

  const sendResetLink = function () {
    // let URL = "http://techmega.cloud:8000/api/forgot-password";
    let data = {
      email: emailId,
    };
    axios
      .post(FORGOT_URL, data)
      .then((res) => {
        setOpen(true);
        if (res.data.message) {
          setMessage(res.data.message);
          setMessageVariant("success");
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
          </Grid>

          <Grid item sm={4} md={4}>
            <Card className="loginCard">
              <p className="logoName">VirtuVerse</p>
              <p className="logoSubText">
                Where Your Digital Universe Unfolds!
              </p>

              {/***********  Sign Up  **************/}
              <div>
                <h2>Forgot Password</h2>
                <p>
                  Don’t worry, you are just two steps away from accessing your
                  account.
                </p>
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

                <p className="mt-35">
                  We will send you a reset password link to your registered
                  email id
                </p>

                <div className="inputField mt-25">
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={sendResetLink}
                    disabled={!isEmailValid || !enableResetLinkbtn}
                  >
                    SEND RESET LINK
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

// export default function Forgot();
