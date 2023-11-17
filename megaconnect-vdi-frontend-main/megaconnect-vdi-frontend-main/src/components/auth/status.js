import * as React from "react";
import "./auth.css";
import img1 from "./../../assets/images/img1.png";
import img2 from "./../../assets/images/img2.svg";
import img3 from "./../../assets/images/img3.svg";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import axios from "axios";
import CustomSnackbar from "../shared/snackbar";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";

export default function Status() {
  const [ip, setIp] = React.useState("192.168.0.101");
  const [diskSize, setDiskSize] = React.useState(0);
  const [cpuCount, setCpuCount] = React.useState(0);
  const [memory, setMemory] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [variant, setMessageVariant] = React.useState("");

  const SERVER_URI = process.env.REACT_APP_SERVER_URI;
  const SIGN_IN_URL = `${SERVER_URI}/user/createVirtualMachine`;

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const onLogin = function (e) {
    console.log(ip, cpuCount, memory, diskSize);
    let data = {
      vmName: Math.random().toString(36).substring(2, 7),
      cpuCount: 2,
      memoryGB: 2192,
      diskSizeGB: 50,
      staticIP: "192.168.0.101",
      diskPath: Math.random().toString(36).substring(2, 7),
    };
    axios
      .post(SIGN_IN_URL, data)
      .then((res) => {
        setMessage(res.data.message);
        setOpen(true);
        console.log(res.data);
        // setMessageVariant("success");
        alert(res.data.message);
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
          <Grid item xs={4}>
            <Card className="loginCard">
              <p className="logoName">Status</p>
              <div className="inputField">
                <TextField
                  label="CPU Count"
                  variant="filled"
                  size="small"
                  fullWidth
                  value={cpuCount}
                  onChange={(e) => setCpuCount(e.target.value)}
                />
              </div>
              <div className="inputField">
                <TextField
                  label="Disk Size"
                  variant="filled"
                  size="small"
                  fullWidth
                  value={diskSize}
                  onChange={(e) => setDiskSize(e.target.value)}
                />
              </div>

              <div className="inputField">
                <TextField
                  label="Memory"
                  variant="filled"
                  size="small"
                  fullWidth
                  value={memory}
                  onChange={(e) => setMemory(e.target.value)}
                />
              </div>

              <div className="inputField">
                <TextField
                  label="Static IP"
                  variant="filled"
                  size="small"
                  fullWidth
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                />
              </div>
              <div className="mt-25">
                <Button variant="contained" fullWidth onClick={onLogin}>
                  Create VM
                  {open}
                </Button>
              </div>
            </Card>
          </Grid>
        </Grid>
        <CustomSnackbar
          message={message}
          variant={variant}
          open={open}
          onClose={handleClose}
        />
      </div>
    </div>
  );
}

// export default function Login();
