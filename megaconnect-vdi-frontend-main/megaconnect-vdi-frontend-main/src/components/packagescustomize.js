import * as React from "react";
import { useEffect } from "react";
import "./../assets/css/styles.css";
import CustomSnackbar from "./shared/snackbar";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { experimentalStyled as styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import axios from "axios";
import { getIcons } from "./shared/getGraphics";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams } from "react-router-dom";
import Header from "./shared/header.js";
import Footer from "./shared/footer.js";

const images = getIcons();

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  padding: theme.spacing(2),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 5,
  borderRadius: 1,
  [`& .${linearProgressClasses.bar}`]: {
    backgroundColor: theme.palette.mode === "light" ? "#034a9a" : "#308fe8",
  },
}));

export default function CustomizePackages() {
  const SERVER_URI = process.env.REACT_APP_SERVER_URI;
  const CATEGORY_LIST = `${SERVER_URI}/getAllApps`;
  const UPGRADE = `${SERVER_URI}/userapps/storeUserApp`;
  const { categoryChecked } = useParams();
  const [res, setRes] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [selectedApps, setSelectedApps] = React.useState([]);
  const [spinner, setSpinner] = React.useState(true);
  const [message, setMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [variant, setMessageVariant] = React.useState("");
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [storage, setStorage] = React.useState(0);
  const [storagePercent, setStoragePercent] = React.useState(0);

  React.useEffect(() => {
    if (
      localStorage.getItem("accessToken") == "" ||
      localStorage.getItem("accessToken") == undefined
    ) {
      setMessage("User not logged in");
      setOpen(true);
      setTimeout(() => {
        window.location.href = "/login";
        setOpen(false);
      }, 100);
    }
  });

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    // setOpen(false);
  };
  let temp = 0;

  useEffect(() => {
    let token = localStorage.getItem("accessToken");
    // let bearerToken =
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGNiNzcyYzM0ZWUwOTFjZWMxN2MyZjIiLCJpYXQiOjE2OTEwNTYyNTAsImV4cCI6MTY5MTY2MTA1MH0.k1QMb_GsG6MjYCp8c7MTMhLIPBAihODCrbeaQVLpg4M";
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    if (res.length == 0) {
      axios
        .get(CATEGORY_LIST, config)
        .then((response) => {
          setRes(response.data);
          let dataList = response.data;
          dataList.forEach((el) => {
            el.apps.forEach((app) => {
              app["selected"] = false;
            });
          });
          setCategories(dataList);
          setSpinner(false);

          // Fetch selected Category
          const categoriesSelected = categoryChecked.split(",");
          console.log(categoriesSelected);
          localStorage.setItem("categoryChecked", categoriesSelected);   
          // Set selected Category app to active
          categoriesSelected.forEach((category) => {
            dataList.forEach((obj) => {
              if (obj.category === category) {
                obj.apps.forEach((app) => {
                  app.selected = true;
                  // setSelectedApps([...selectedApps, app]);
                  selectedApps.push(app);
                });
                // Set Allotted Storage
                obj.spacerequired = obj.spacerequired.replace("MB", "");
                temp = Number(obj.spacerequired) + Number(temp);
                setStorage(temp);
              }
            });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // let temp = 0
    // categories.forEach((el)=>{
    //   el.spacerequired = el.spacerequired.replace('MB', '')
    //   temp = Number(el.spacerequired) + Number(temp)
    //   setStorage(temp)
    // })
  });

  const handleAppSelection = (value) => () => {
    let appSelected;
    if (value.app) {
      appSelected = value.app;
    } else {
      appSelected = value;
    }
    appSelected.app_size = appSelected.app_size.replace("MB", "");

    let exists = false;
    let temp = 0;

    selectedApps.forEach((app) => {
      app.app_size = app.app_size.replace("MB", "");
      if (
        app["app_name"] == appSelected["app_name"] &&
        appSelected["selected"] === true
      ) {
        app["selected"] = false;
        setSelectedApps([...selectedApps]);
        exists = true;
        //Set Storage
        temp = Number(storage) - Number(app.app_size);
        setStorage(temp);
      }
      if (
        !exists &&
        app["app_name"] == appSelected["app_name"] &&
        appSelected["selected"] === false
      ) {
        app["selected"] = true;
        setSelectedApps([...selectedApps]);
        exists = true;
        //Set Storage
        temp = Number(app.app_size) + Number(storage);
        setStorage(temp);
      }
    });

    if (exists === false) {
      appSelected["selected"] = true;
      setSelectedApps([...selectedApps, appSelected]);
      //Set Storage
      temp = Number(appSelected.app_size) + Number(storage);
      setStorage(temp);
    }
    console.log(selectedApps);
    setStoragePercent((Number(storage) / Number(102400)) * 100);
  };

  const upgrade = function (e) {
    let token = localStorage.getItem("accessToken");

    // let token =
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGNiNzcyYzM0ZWUwOTFjZWMxN2MyZjIiLCJpYXQiOjE2OTEwNTYyNTAsImV4cCI6MTY5MTY2MTA1MH0.k1QMb_GsG6MjYCp8c7MTMhLIPBAihODCrbeaQVLpg4M";
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    axios
      .post(UPGRADE, selectedApps, config)
      .then((res) => {
        setOpen(true);
        if (res.data.message) {
          setMessage(res.data.message);
          setMessageVariant("success");
          setTimeout(() => {
            window.location.href = "/checkout";
          }, 2000);
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
        console.log(err);
        setMessage(err.message);
        setMessageVariant("error");
      });
    setTimeout(function () {
      setOpen(false);
    }, 5000);
  };

  return (<>
    {/* <Header /> */}
    <div className="AppBg">
      <Grid container className="catagoryGrid">
        <Grid item xs={10}>
          <h1>Customize Package</h1>
          <p>Please choose apps and customize if required</p>

          <Stack direction="row" spacing={1}>
            <Chip
              label="Recommendations"
              style={{ backgroundColor: "#5d5d5d", color: "#fff" }}
            />
            {/* <Chip label="Others" variant="outlined" /> */}
          </Stack>
        </Grid>
        <Grid
          item
          xs={2}
          style={{ textAlign: "center", fontSize: "13px", marginTop: "30px" }}
        >
          {/* <p>Allotted Storage</p>
          <BorderLinearProgress variant="determinate" value={50} />
          <p><small>23.21GB og 100GB</small></p> */}
        </Grid>
      </Grid>

      <Item className="catagoryList" style={{ marginTop: "25px" }}>
        <Grid container>
          <Grid item xs={9}>
            <p>
              All-day entertainment packed in one awesome package! Get ready to
              have a blast!
            </p>

            {spinner ? (
              <div className="align-center mt-40">
                <CircularProgress />
              </div>
            ) : (
              ""
            )}

            {/* Tab  */}
            <Box>
              <Box
                style={{
                  borderBottom: "0",
                  padding: "0 10px",
                  textAlign: "center",
                }}
              >
                <Tabs
                  value={value}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (e.key === "Tab") {
                      setValue((v) => (v === 2 ? 0 : ++v));
                    }
                  }}
                >
                  {categories.map((list, i) => (
                    <Tab label={list.category} key={i} {...a11yProps(0)} />
                  ))}
                </Tabs>
              </Box>

              {/* App listing  */}
              {categories.map((list, i) => (
                <TabPanel
                  value={value}
                  index={i}
                  key={i}
                  style={{ padding: "8px 0" }}
                >
                  <Grid
                    container
                    spacing={2}
                    columnSpacing={{ xs: 1, sm: 2, md: 2.5 }}
                  >
                    {list.apps.map((app, index) => (
                      <Grid item key={index}>
                        <div
                          className={
                            app.selected
                              ? "appDetails selectedApp"
                              : "appDetails"
                          }
                          onClick={handleAppSelection({ app })}
                        >
                          <img
                            src={images[app.app_name]}
                            alt={app.app_name}
                            className="pic"
                          />
                          <p>{app.app_name}</p>
                        </div>
                      </Grid>
                    ))}
                  </Grid>
                </TabPanel>
              ))}
            </Box>
          </Grid>

          <Grid
            item
            xs={3}
            style={{ textAlign: "left", fontSize: "13px", marginTop: "0px" }}
          >
            <div
              className="catagoryBlock"
              style={{ padding: "10px", minHeight: "240px" }}
            >
              Selected Apps
              {/* <Grid container spacing={0.5} columnSpacing={{ xs: 1, sm: 1, md: 1 }} sx={{ mt: 2 }} className="scrollSelected">
              {categories.map((value) => {
                return value.apps.map((app) => 
                    <Grid item xs={3} className={app.selected ? '' : 'hide'}>
                      <div className="selectedApps">
                        <img src={images[app.app_name]} alt="" width="100%" />
                        {app.app_name}
                      </div>
                    </Grid>
                );
              
              })}          
            </Grid> */}
              <Grid
                container
                spacing={0.5}
                columnSpacing={{ xs: 1, sm: 1, md: 1 }}
                sx={{ mt: 2 }}
                className="scrollSelected"
              >
                {Object.values(selectedApps).map((list, i) => (
                  <Grid
                    item
                    xs={3}
                    key={i}
                    className={list.selected ? " " : "hide"}
                  >
                    <div className="selectedApps">
                      <img src={images[list.app_name]} alt="" width="100%" />
                    </div>
                  </Grid>
                ))}
              </Grid>
            </div>
            <p>Allotted Storage</p>
            <BorderLinearProgress
              variant="determinate"
              value={storagePercent}
            />
            <p>
              <small>{storage}MB of 100GB</small>
            </p>
          </Grid>
        </Grid>
      </Item>

      <Box sx={{ mt: 3 }} style={{ textAlign: "right" }}>
        <Link to="/packages">
          <Button variant="contained" className="skip" sx={{ mr: 2 }}>
            CANCEL
          </Button>
        </Link>

        <Button
          variant="contained"
          className="theme"
          sx={{ mr: 2 }}
          onClick={upgrade}
        >
          PROCEED
        </Button>
      </Box>

      <CustomSnackbar message={message} variant={variant} open={open} />
    </div>
    <Footer />
    </>
  );
}

// export default function CustomizePackages();
