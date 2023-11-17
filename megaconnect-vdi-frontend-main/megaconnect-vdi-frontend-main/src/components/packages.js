// import * as React from "react";
// import { useEffect } from "react";
// import "./../assets/css/styles.css";
// import CustomSnackbar from "./shared/snackbar";
// import Chip from "@mui/material/Chip";
// import Stack from "@mui/material/Stack";
// import { experimentalStyled as styled } from "@mui/material/styles";
// import Box from "@mui/material/Box";
// import Paper from "@mui/material/Paper";
// import Grid from "@mui/material/Grid";
// import Checkbox from "@mui/material/Checkbox";
// import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
// import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
// import DialogTitle from "@mui/material/DialogTitle";
// import Button from "@mui/material/Button";
// import LinearProgress, {
//   linearProgressClasses,
// } from "@mui/material/LinearProgress";
// import axios from "axios";
// import { getIcons } from "./shared/getGraphics";
// import { Link } from "react-router-dom";
// import Header from "./shared/header.js";
// import Footer from "./shared/footer.js";
// import CircularProgress from "@mui/material/CircularProgress";

// const images = getIcons();
// const label = { inputProps: { "aria-label": "Checkbox demo" } };
// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
//   padding: theme.spacing(2),
//   textAlign: "left",
//   color: theme.palette.text.secondary,
// }));

// const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
//   height: 5,
//   borderRadius: 1,
//   [`& .${linearProgressClasses.bar}`]: {
//     backgroundColor: theme.palette.mode === "light" ? "#034a9a" : "#308fe8",
//   },
// }));

// export default function Packages() {
//   const SERVER_URI = process.env.REACT_APP_SERVER_URI;
//   const CATEGORY_LIST = `${SERVER_URI}/getAllApps`;
//   const PROCEED = `${SERVER_URI}/userapps/storeUserApp`;

//   const [open, setAppOpen] = React.useState(false);
//   const [snackbaropen, setSnackbarOpen] = React.useState(false);
//   const [categories, setCategories] = React.useState([]);
//   const [spinner, setSpinner] = React.useState(true);
//   const [storage, setStorage] = React.useState(0);
//   const [storagePercent, setStoragePercent] = React.useState(0);
//   const [selectedCategory, setSelectedCategory] = React.useState([
//     "Entertainment",
//     "Games",
//     "Productivity",
//     "Health & Fitness",
//   ]);
//   const [res, setRes] = React.useState([]);
//   const [selectedApps, setSelectedApps] = React.useState([]);
//   const [message, setMessage] = React.useState("");
//   const [variant, setMessageVariant] = React.useState("");
//   // const [snackbarOpen, setSnackbarOpen] = React.useState(false);

//   // handleCategory
//   const handleCategoryToggle = (category) => {
//     if (selectedCategory.includes(category)) {
//       setSelectedCategory(selectedCategory.filter((item) => item !== category));
//     } else {
//       setSelectedCategory([...selectedCategory, category]);
//     }
//   };

//   React.useEffect(() => {
//     if (
//       localStorage.getItem("accessToken") == "" ||
//       localStorage.getItem("accessToken") == undefined
//     ) {
//       setMessage("User not logged in");
//       setAppOpen(true);
//       setTimeout(() => {
//         window.location.href = "/login";
//         setAppOpen(false);
//       }, 100);
//     }
//   });

//   useEffect(() => {
//     let token = localStorage.getItem("accessToken");
//     // let token =
//     //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGNiNzcyYzM0ZWUwOTFjZWMxN2MyZjIiLCJpYXQiOjE2OTEwNTYyNTAsImV4cCI6MTY5MTY2MTA1MH0.k1QMb_GsG6MjYCp8c7MTMhLIPBAihODCrbeaQVLpg4M";
//     let config = {
//       headers: { Authorization: `Bearer ${token}` },
//     };

//     if (res.length == 0) {
//       axios
//         .get(CATEGORY_LIST, config)
//         .then((response) => {
//           setRes(response.data);
//           setCategories(response.data);
//           setSpinner(false);

//           let dataList = response.data;

//           // Fetch selected Category
//           dataList.forEach((el) => {
//             el.apps.forEach((app) => {
//               app["selected"] = false;
//             });
//           });

//           // Fetch apps from selected Category
//           dataList.forEach((cat) => {
//             cat.apps.forEach((appsArray) => {
//               selectedApps.push(appsArray);
//             });
//           });
//           // console.log(selectedApps);

//           let categoryChecked = localStorage.getItem("categoryChecked");
//           if(categoryChecked != ''){
//             const categoriesSelected = categoryChecked.split(",");
//             console.log(categoriesSelected);
//             setSelectedCategory(categoriesSelected)
//           }
//           else {
//             setSelectedCategory(["Entertainment", "Games", "Productivity", "Health & Fitness"])
//           }

          
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }
//     let temp = 0;
//     categories.forEach((el) => {
//       el.spacerequired = el.spacerequired.replace("MB", "");
//       temp = Number(el.spacerequired) + Number(temp);
//       setStorage(temp);
//       setStoragePercent((Number(storage) / Number(102400)) * 100);
//     });
//   });

//   const handleAppSelection = (value) => {};

//   const handleAppOpen = () => {
//     setAppOpen(true);
//   };

//   const handleClose = () => {
//     setAppOpen(false);
//   };

//   const proceed = function (e) {
//     const selectedAppsList = [];
//     categories.forEach((cat) => {
//       if (selectedCategory.includes(cat.category)) {
//         cat.apps.forEach((app) => {
//           selectedAppsList.push(app);
//         });
//       }
//     });

//     let token = localStorage.getItem("accessToken");
//     if (token != "" && token != undefined) {
//       console.log("token received from local -> ", token);
//       let config = {
//         headers: { Authorization: `Bearer ${token}` },
//       };
//       axios
//         .post(PROCEED, selectedAppsList, config)
//         .then((res) => {
//           setSnackbarOpen(true);
//           if (res.data.message) {
//             setMessage(res.data.message);
//             setMessageVariant("success");
//             localStorage.setItem("categoryChecked", selectedCategory);   
//             setTimeout(() => {
//               window.location.href = "/checkout";
//             }, 2000);
//           } else if (res.data.warning) {
//             setMessage(res.data.warning);
//             setMessageVariant("warning");
//           } else if (res.data.error) {
//             setMessage(res.data.error);
//             setMessageVariant("error");
//           }
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//       setTimeout(function () {
//         setSnackbarOpen(false);
//       }, 5000);
//     }
//   };

//   return (
//   <>
//     {/* <Header /> */}
//     <div className="AppBg">
//       <Grid container className="catagoryGrid">
//         <Grid item xs={10}>
//           <h1>Loaded App</h1>
//           <p>Please choose apps and customize if required</p>

//           <Stack direction="row" spacing={1} xs={{ mt: 3 }}>
//             <Chip
//               label="Recommendations"
//               style={{ backgroundColor: "#5d5d5d", color: "#fff" }}
//             />
//             {/* <Chip label="Others" variant="outlined" /> */}
//           </Stack>
//         </Grid>
//         <Grid
//           item
//           xs={2}
//           style={{ textAlign: "center", fontSize: "13px", marginTop: "30px" }}
//         >
//           <p>Allotted Storage</p>
//           <BorderLinearProgress variant="determinate" value={storagePercent} />
//           <p>
//             <small>{storage}MB of 100GB</small>
//           </p>
//         </Grid>
//       </Grid>

//       {spinner ? (
//         <p className="align-center mt-40">
//           <CircularProgress />
//         </p>
//       ) : (
//         ""
//       )}

//       <Box style={{ marginTop: "25px" }}>
//         <Grid container spacing={{ xs: 2, md: 3 }}>
//           {categories.map((list, index) => (
//             <Grid item xs={12} sm={6} md={3} key={index}>
//               <Item className="catagoryList">
//                 <div className={"catagoryBg"}>
//                   <Checkbox
//                     {...label}
//                     checked={selectedCategory.includes(list.category)}
//                     onChange={() => handleCategoryToggle(list.category)}
//                     color="default"
//                     sx={{ "& .MuiSvgIcon-root": { fontSize: 26 } }}
//                   />
//                   {list.category}
//                   <img src={images[list.category]} alt="" width="100%" />
//                 </div>
//                 <p style={{ minHeight: "60px" }}>{list.title}</p>

//                 <Grid container className="catagoryGrid">
//                   <Grid item xs={11}>
//                     <Grid
//                       container
//                       spacing={0.5}
//                       columnSpacing={{ xs: 0.5, sm: 0.5, md: 0.5 }}
//                     >
//                       {list.apps.slice(0, 4).map((app, index) => (
//                         <Grid item key={index} xs={3}>
//                           <img
//                             src={images[app.app_name]}
//                             // src={Netflix}
//                             alt={app.app_name}
//                             className="pic"
//                           />
//                         </Grid>
//                       ))}
//                     </Grid>
//                   </Grid>

//                   <Grid
//                     item
//                     xs={1}
//                     style={{
//                       textAlign: "center",
//                       fontSize: "12px",
//                       marginTop: "20px",
//                       textDecoration: "underline",
//                       color: "blue",
//                     }}
//                   >
//                     {list.apps.length > 4 && (
//                       <p style={{ padding: "0" }} onClick={handleAppOpen}>
//                         + {list.apps.length - 4}{" "}
//                       </p>
//                     )}
//                   </Grid>
//                 </Grid>

//                 <p style={{ marginTop: "0px" }}>
//                   Required Space: {list.spacerequired}
//                 </p>
//               </Item>
//             </Grid>
//           ))}
//         </Grid>
//       </Box>

//       <Dialog
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <DialogTitle id="alert-dialog-title">
//           {/* {list.category} */}
//           Productivity
//         </DialogTitle>
//         <DialogContent>
//           <DialogContentText id="alert-dialog-description">
//             {categories.slice(1, 2).map((list, i) => (
//               <Grid
//                 container
//                 key={i}
//                 spacing={0.5}
//                 columnSpacing={{ xs: 0.5, sm: 0.5, md: 0.5 }}
//               >
//                 {list.apps.map((app, index) => (
//                   <Grid item xs key={index}>
//                     <img
//                       src={images[app.app_name]}
//                       // src={Netflix}
//                       alt={app.app_name}
//                       className="pic"
//                     />
//                   </Grid>
//                 ))}
//               </Grid>
//             ))}
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose}>Ok</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Buttons  */}
//       <Box style={{ textAlign: "right", marginTop: "25px" }}>
//         <Link to="/checkout">
//           <Button variant="contained" className="skip">
//             SKIP
//           </Button>
//         </Link>

//         <Link to={"/customizepackages/" + selectedCategory}>
//           <Button
//             variant="contained"
//             className="theme"
//             style={{ marginRight: "15px" }}
//           >
//             CUSTOMIZE
//           </Button>
//         </Link>

//         <Button variant="contained" className="theme" onClick={proceed}>
//           Proceed
//         </Button>
//       </Box>

//       <CustomSnackbar message={message} variant={variant} open={snackbaropen} />
//     </div>
//     <Footer />
//   </>
//   );
// }
//  export default function Packages();



// // Customizing code 

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
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import axios from "axios";
import { getIcons } from "./shared/getGraphics";
import { Link } from "react-router-dom";
import Header from "./shared/header.js";
import Footer from "./shared/footer.js";
import CircularProgress from "@mui/material/CircularProgress";
import { data } from "flickity";

const images = getIcons();
const label = { inputProps: { "aria-label": "Checkbox demo" } };
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

export default function Packages() {
  const SERVER_URI = process.env.REACT_APP_SERVER_URI;
  const CATEGORY_LIST = `${SERVER_URI}/getAllApps`;
  const PROCEED = `${SERVER_URI}/userapps/storeUserApp`;
  const GET_USER_APP=`${SERVER_URI}/getUserApps`

  
  const [open, setAppOpen] = React.useState(false);
  const [snackbaropen, setSnackbarOpen] = React.useState(false);
  const [categories, setCategories] = React.useState([]);
  const [spinner, setSpinner] = React.useState(true);
  const [storage, setStorage] = React.useState(0);
  const [storagePercent, setStoragePercent] = React.useState(0);
  const [selectedCategory, setSelectedCategory] = React.useState([]);
  const [res, setRes] = React.useState([]);
  const [selectedApps, setSelectedApps] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [variant, setMessageVariant] = React.useState("");

  const [preloadedApps, setPreloadedApps] = React.useState([]);
  const [userAppDetails, setUserAppDetails] =React.useState([]); // User app details fetched from the backend
  const [totalStorage, setTotalStorage] =React.useState(0);

  useEffect(() => {
    // Load data only when the component mounts
    if (
      localStorage.getItem("accessToken") === "" ||
      localStorage.getItem("accessToken") === undefined
    ) {
      setMessage("User not logged in");
      setAppOpen(true);
      setTimeout(() => {
        window.location.href = "/login";
        setAppOpen(false);
      }, 100);
    } else {
      fetchData();
    }
  }, []);

  const fetchData = () => {
    let token = localStorage.getItem("accessToken");
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };
  
    axios
      .get(CATEGORY_LIST, config)
      .then((response) => {
        console.log("Data fetched successfully:", response.data);
        setCategories(response.data);
        setPreloadedApps(response.data);
        setSpinner(false);
        // Automatically select all apps
        let allSelectedApps = [];
        let totalStorage = 0; // Initialize the total size
  
        if (Array.isArray(response.data)) {
          response.data.forEach((cat) => {
            if (Array.isArray(cat.apps)) {
              cat.apps.forEach((app) => {
                allSelectedApps.push(app.app_name);
                // Assuming each app has a "size" property
                if (typeof app.size === 'string' && app.size.match(/^\d+MB$/)) {
                  const sizeValue = parseFloat(app.app_size); // Extract the numeric part
                  if (!isNaN(sizeValue)) {
                    totalStorage += sizeValue;
                    
                  }
                }
 
              });
            
            }
          });
        }
  
        // Update selectedApps state with all apps selected
        setSelectedApps(allSelectedApps);
  
        // Display the total storage size in the UI
        console.log("Total Storage Size:", totalStorage);
      
  
        // You can update your UI with the totalStorageSize value
        // For example, if you want to display it in a component:
        setTotalStorage(totalStorage);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  



  // Handle category selection
  const handleCategoryToggle = (category) => {
    if (selectedCategory.includes(category)) {
      setSelectedCategory(selectedCategory.filter((item) => item !== category));
    } else {
      setSelectedCategory([...selectedCategory, category]);
    }
  };

  const handleClose = () => {
    setAppOpen(false);
  };

  const proceed = function (e) {
    // Create a list of selected app names
    const selectedAppsList = [];
  
    categories.forEach((cat) => {
      if (cat.apps && Array.isArray(cat.apps)) {
        cat.apps.forEach((app) => {
          if (selectedApps.includes(app.app_name)) {
            selectedAppsList.push(app.app_name);
          }
        });
      }
    });
    console.log("Selected apps list:", selectedAppsList);
  
    let token = localStorage.getItem("accessToken");
    if (token !== "" && token !== undefined) {
      let config = {
        headers: { Authorization: `Bearer ${token}` },
      };
  
      // Make an API call to storeUserApp here
      axios
        .post(PROCEED, selectedAppsList, config)
        .then((res) => {
          setSnackbarOpen(true);
          if (res.data.message) {
            setMessage(res.data.message);
            setMessageVariant("success");
            localStorage.setItem("categoryChecked", selectedCategory);
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
          console.log(err);
        });
  
      setTimeout(function () {
        setSnackbarOpen(false);
      }, 5000);
    }
  };
  

  useEffect(() => {
    let token = localStorage.getItem("accessToken");
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios
      .get(GET_USER_APP,config)
      .then((response) => {
        const { userApps } = response.data;

        // Set user app details in state
        setUserAppDetails(userApps);

        // Calculate total storage size
        let tempTotalStorage = 0;
        for (const app of userApps) {
          // Parse the app size and add it to the total
          tempTotalStorage += parseInt(app.app_size.replace("MB", ""));
        }

        // Set total storage size in state
        setTotalStorage(tempTotalStorage);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSkip = () => {
    // Set total storage to 0 when user skips
    setTotalStorage(0);
  
    // Add your logic for skipping here, if needed
    const confirmSkip = window.confirm("Are you sure you want to skip?");
  
    if (confirmSkip) {
      // Perform actions when the user confirms skipping
      // For example, navigate to a different page
      window.location.href = "/checkout";
    } else {
      // Handle the case when the user cancels the skip action
      console.log("Skip canceled.");
      // You can optionally provide feedback to the user or take other actions
    }
  };
  
  return (
  <>
    {/* <Header /> */}
    <div className="AppBg">
      <Grid container className="catagoryGrid">
        <Grid item xs={10}>
          <h1>Loaded App</h1>
          <p>Please choose apps and customize if required</p>

          <Stack direction="row" spacing={1} xs={{ mt: 3 }}>
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
          <p>Allotted Storage</p>
          <BorderLinearProgress variant="determinate"  value={(totalStorage / (1024 * 1024 * 1024)) * 100}  />
          <p>
            <small>{totalStorage}MB of 100GB</small>
          </p>
        </Grid>
      </Grid>

      {spinner ? (
        <p className="align-center mt-40">
          <CircularProgress />
        </p>
      ) : (
        ""
      )}
<Box style={{ marginTop: "25px" }}>
  <Grid container spacing={{ xs: 2, md: 3 }}>
    <Grid item xs={8}>
      <Item className="catagoryList" style={{ minHeight: "90%" }}>
      <img src="https://www.wynnsoft-solution.com/images/2016/09/AAAIAAAAAAUAOAAEAEAAu_WEB_APPLICATION.jpg" alt="" width="100%" />
        <Grid container className="catagoryGrid">
          <Grid item xs={12} style={{marginTop:"60px"}}>
            <Grid container spacing={0.5} columnSpacing={0.5}>
              {categories.map((app, index) => (
                <Grid item key={index} xs={2}>
                  <img
                    src={images[app.app_name]}
                    alt={app.app_name}
                    className="pic"
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid
            item
            xs={1}
            style={{
              textAlign: "center",
              fontSize: "12px",
              marginTop: "20px",
              textDecoration: "underline",
              color: "blue",
            }}
          >
            {selectedApps.length > 4 && (
              <p style={{ padding: "0" }}>
                + {selectedApps.length - 4}{" "}
              </p>
            )}
          </Grid>
          
        </Grid>
        
      </Item>
    
    </Grid>
    <Grid item xs={4}>
              <Paper elevation={3} style={{ padding: "20px"}} className="preloaded-apps-paper">
                <h2>Preloaded Apps</h2>
                <div className="preloaded-apps-list">
  {preloadedApps.map((app, index) => (
    <div key={index} className="preloaded-app">
      <img src={app.icon} alt=""/>
      <p><strong>Name:</strong> {app.app_name}</p>
      <p><strong>Size:</strong> {app.app_size}</p>
    </div>
  ))}
</div>
              </Paper>
            </Grid>
  </Grid>
</Box>


      <Box style={{ textAlign: "right", marginTop: "25px" }}>
        <Link to="/checkout">
          <Button variant="contained" className="skip" onClick={handleSkip}>
            SKIP
          </Button>
        </Link>

        {/* <Link to={"/customizepackages/" + selectedCategory}>
          <Button
            variant="contained"
            className="theme"
            style={{ marginRight: "15px" }}
          >
            CUSTOMIZE
          </Button>
        </Link> */}

        <Button variant="contained" className="theme" onClick={proceed}>
          Proceed
        </Button>
      </Box>

      <CustomSnackbar message={message} variant={variant} open={snackbaropen} />
    </div>
    <Footer />
  </>
  );
}
