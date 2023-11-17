import * as React from "react";
import "./auth.css";
import { Link } from "react-router-dom";

import img1 from "./../../assets/images/img1.png";
import img2 from "./../../assets/images/img2.svg";
import img3 from "./../../assets/images/img3.svg";
import playBtn from "./../../assets/images/playBtn.svg";
import thankyou from "./../../assets/images/thankyou.png";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import axios from "axios";
import { useParams } from "react-router-dom";
import CustomSnackbar from "./../shared/snackbar";

export default function Activateuser() {
  const { token } = useParams();
  const [button, setBtn] = React.useState("activate");
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [variant, setMessageVariant] = React.useState("");

  const sendResetLink = function () {
    let URL = "http://techmega.cloud:8000/api/account-activation";
    let data = {
      token: token,
    };
    axios
      .post(URL, data)
      .then((res) => {
        setOpen(true);
        if (res.data.success) {
          setMessage(res.data.success);
          setMessageVariant("success");
          setBtn("login");
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
      })
      .catch((err) => {
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
                {/***********  Thank You  **************/}

                {button == "login" && (
                  <div className="thankyou">
                    <img src={thankyou} />
                    <h1>Thank you!</h1>
                    <p>Your account has been activated</p>
                    <div className="mt-35">
                      <Link to="/login">
                        <Button variant="contained" fullWidth>
                          LOGIN
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}

                {button != "login" && (
                  <div className="thankyou">
                    <img src={thankyou} />
                    <h1>Thank you!</h1>
                    <p>Activate your account</p>
                    <div className="inputField mt-35">
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={sendResetLink}
                      >
                        ACTIVATE
                      </Button>
                    </div>
                  </div>
                )}
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

// export default function Activateuser();
