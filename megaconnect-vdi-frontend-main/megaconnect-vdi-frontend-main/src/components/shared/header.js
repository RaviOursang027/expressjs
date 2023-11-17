import * as React from "react";
import {  useState } from "react";
import axios from "axios";
import "./../../assets/css/header.css";
import Grid from '@mui/material/Grid';
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { Drawer } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import FeedbackIcon from '@mui/icons-material/Feedback';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Container, Input } from '@mui/material';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import FilledInput from "@mui/material/FilledInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Dialog from '@mui/material/Dialog';
import Modal from '@mui/material/Modal';
import CustomSnackbar from "../shared/snackbar";
import '../../assets/css/responsive.css';

export default function Header() {
  const SERVER_URI = process.env.REACT_APP_SERVER_URI;
  const GET_USER = `${SERVER_URI}/user`;
  const DELETE_ACCOUNT = `${SERVER_URI}/user/delete-Account`;
  const FEEDBACK = `${SERVER_URI}/feedback-rating`;

  const [res, setRes] = React.useState([]);
  
  // SnackBar
  const [open, setOpen] = React.useState(false);
  // const [snackbaropen, setSnackbarOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  // const [variant, setMessageVariant] = React.useState("");

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [selectedImage, setSelectedImage] = React.useState('');

  //delete account
  const [opendelete, setOpenDelete] = useState(false);
  const [deletemessage, setDeleteMessage] = useState('');
  const [deletevariant, setDeleteVariant] = useState('success');
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);

  //Feedback
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
  const [openDeleteAccountDialog, setOpenDeleteAccountDialog] = useState(false);
  const [openFeedback, setOpenFeedback] = useState(false);
  const [Feedbackmessage, setFeedbackMessage] = useState('');
  const [Feedbackvariant, setFeedbackVariant] = useState('');
  const [ratingFeedback, setratingFeedback] = useState(0);
  const [messageFeedback, setmessageFeedback] = useState('');

  
  // Add this state to track the entered email
  const [confirmEmail, setConfirmEmail] = useState('');
  
  // Add a state to track whether the email matches
  const [emailMatches, setEmailMatches] = useState(false);
  
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  }

  const [anchorEl, setAnchorEl] = React.useState(null);
  const opensettings = Boolean(anchorEl);

  const setViewChangesetting = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  let path = window.location.pathname.replace('/', '');
  const [viewSelected, setView] = React.useState(path);
  const locale = 'en';
  const [today, setDate] = React.useState(new Date())

  React.useEffect(() => {
    const timer = setInterval(() => {
      // This will trigger a rerender every component that uses the useDate hook.
      setDate(new Date());
    }, 60 * 1000);
    return () => {
      clearInterval(timer);
    }
  }, []);

  const day = today.toLocaleDateString(locale, { weekday: 'long' });
  const hour = today.getHours();
  const date = `${day}, ${today.getDate()} ${today.toLocaleDateString(locale, { month: 'long' })}\n\n`;
  const wish = `Good ${(hour < 12 && 'Morning') || (hour < 17 && 'Afternoon') || 'Evening'}, `;
  const time = today.toLocaleTimeString(locale, { hour: 'numeric', hour12: true, minute: 'numeric' });

  const checkout = function () {
    localStorage.setItem("accessToken", "");
    setTimeout(() => {
      window.location.href = "/login";
    }, 100);
  };

  const setViewChange = function () {
    let path = window.location.pathname.replace('/', '')
    setView(path)
  }

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
  React.useEffect(() => {
    let token = localStorage.getItem("accessToken");
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    if (res.length == 0) {
      axios
        .get(GET_USER, config)
        .then((response) => {
          setRes(response.data);
          setName(response.data.name)
          setEmail(response.data.email)
          if (response.data.profilePictureUrl && response.data.profilePictureUrl !== "") {
            setSelectedImage(response.data.profilePictureUrl);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });


  // Function to handle the click event of the "Delete account" option
  const handleDeleteAccountClick = () => {
    setOpenDeleteAccountDialog(true); // Show the delete account confirmation dialog
    handleClose(); // Close the settings menu
  };

  // Function to handle closing the delete account confirmation dialog
  const handleCloseDeleteAccountDialog = () => {
    setOpenDeleteAccountDialog(false); // Hide the delete account confirmation dialog
  };
  

  // Function to handle the delete button click
  const handleDeleteClick = () => {
    // Show the confirmation section
    setConfirmationVisible(true);
  };
  
  // Step 3: Create a function to handle opening and closing the dialog
  const handleOpenFeedbackDialog = () => {
    setOpenFeedbackDialog(true);
  };

  const handleCloseFeedbackDialog = () => {
    setOpenFeedbackDialog(false);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  const handleDeleteAccount = async () => {
    try {
      const Token = localStorage.getItem('accessToken'); // Get the JWT token
      const config = {
        headers: { Authorization: `Bearer ${Token}` }, // Include the JWT token in the header
      };

      const response = await axios.delete(DELETE_ACCOUNT, config);

      if (response.status === 200) {
        // Successful response, show a success message
        setDeleteVariant('success');
        setDeleteMessage('User deleted successfully');
        setOpenDelete(true);
        window.location.href = '/signup';
        // Close the dialog or perform any other necessary actions
      } else if (response.status === 404) {
        // User not found, show an error message
        setDeleteVariant('error');
        setDeleteMessage('User not found');
        setOpenDelete(true);
      } else {
        // Server error, show an error message
        setDeleteVariant('error');
        setDeleteMessage('Error deleting user');
        setOpenDelete(true);
      }
    } catch (error) {
      // Handle any network errors or other exceptions here
      setDeleteVariant('error');
      setDeleteMessage(`Error: ${error.message}`);
      setOpenDelete(true);
    }
  };

//Feedback
  const handleratingChange = (event) => {
    const value = event.target.value;
    const numericValue = parseInt(value); // or parseFloat(value) if you want a floating-point number
  
    if (!isNaN(numericValue)) {
      setratingFeedback(numericValue);
    }
  };
  
  const handlemessageChange = (event) => {
    setmessageFeedback(event.target.value);
  };
  
  const handleSubmitFeedback = async () => {
    try {
      const Token = localStorage.getItem('accessToken'); // Get the JWT token
      const config = {
        headers: { Authorization: `Bearer ${Token}` },
      };
  
      const feedbackData = {
        rating: ratingFeedback,
        feedback: messageFeedback,
      };
  
      const response = await axios.post(FEEDBACK, feedbackData, config);
  
      if (response.status === 200) {
        setFeedbackMessage('Feedback successfully submitted!');
        setFeedbackVariant('success');
        setOpenFeedback(true);
        handleCloseFeedbackDialog();
  
        // Automatically close the Snackbar after 5 seconds
        setTimeout(() => {
          setOpenFeedback(false);
        }, 5000); // 5000 milliseconds = 5 seconds
      }
    } catch (error) {
      setFeedbackVariant('error');
      setFeedbackMessage(`Error: ${error.message}`);
      setOpenFeedback(true);
  
      // Automatically close the Snackbar after 5 seconds
      setTimeout(() => {
        setOpenFeedback(false);
      }, 5000); // 5000 milliseconds = 5 seconds
    }
  };
  
  const handleFeedbackClose = () => {
    setOpenFeedback(false);
  };
  

 
  return (
    <div className="headerBg">
      <div className="App LoginBg" style={{ marginTop: "20px", paddingBottom: "12px" }}>
        <Grid container spacing={3}>
          <Grid item xs style={{ fontSize: '30px', fontWeight: 500 }}>
          <img
              src="/MicrosoftTeams-image (10).png"
              alt="logo"
              width="100px"
            />
          </Grid>
          <Grid item xs={8} style={{ paddingTop: "18px" }}>
            <ul className={drawerOpen ? "hide" : "show"}>

              <li className={viewSelected === 'overview' ? "selected" : ""} onClick={setViewChange}>
                <Link to="/overview">Overview</Link>
              </li>
              <li className={viewSelected === 'files' ? "selected" : ""} onClick={setViewChange}>
              <Link to="/files">Files</Link>
              </li>
              <li className={viewSelected === 'profile' ? "selected" : ""} onClick={setViewChange}>
                <Link to="/profile">Profile</Link>
              </li>
              <li className={viewSelected === 'setting' ? "selected" : ""} onClick={setViewChangesetting}>
                Settings
              </li>
              <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={opensettings}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  border: '1px solid rgba(255, 255, 255, .25)', // Add border style
                  borderRadius: '20px', // Add border-radius
                  backgroundColor: 'rgba(255, 255, 255, 0.45)', // Add background color
                  boxShadow: '0 0 10px 1px rgba(0, 0, 0, 0.25)', // Add box-shadow
                  backdropFilter: 'blur(15px)',
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleDeleteAccountClick}>
                  <Avatar /> Delete account
                </MenuItem>
                <MenuItem onClick={handleOpenFeedbackDialog}>
                  <FeedbackIcon /> Feedback
                </MenuItem>
              </Menu>
              <li className={viewSelected === 'support' ? "selected" : ""} onClick={setViewChange}>
                <Link to="/support">Support</Link>
              </li>
              <li>Refer & Earn</li>
            </ul>
          </Grid>
          <Grid item xs>
            <div className="log-menu">
              <div className="menu">
                <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
                  <MenuIcon />
                </IconButton>
              </div>
              <p className="logout" onClick={checkout}>
                Logout
              </p>
            </div>
            <Drawer
              variant="temporary"
              anchor="left"
              open={drawerOpen}
              onClose={handleDrawerToggle}
              className="drawer"
            >
              <div className="drawer-content">
                <ul>
                  <li className={viewSelected === 'overview' ? "selected" : ""} onClick={setViewChange}>
                    <Link to="/overview">Overview</Link>
                  </li>
                  <li className={viewSelected === 'files' ? "selected" : ""} onClick={setViewChange}>
                    <Link to="/files">Files</Link>
                  </li>
                  <li className={viewSelected === 'profile' ? "selected" : ""} onClick={setViewChange}>
                    <Link to="/profile">Profile</Link>
                  </li>
                  <li>Settings</li>
                  <li className={viewSelected === 'support' ? "selected" : ""} onClick={setViewChange}>
                    <Link to="/support">Support</Link>
                  </li>
                  <li>Refer & Earn</li>
                </ul>
              </div>
            </Drawer>
          </Grid>
        </Grid>
      </div>
      <p className="headerHr"></p>
      {viewSelected === 'overview' && (
        <div className="breadcrumbs" style={{ height: '130px' }}>
          <div className="App LoginBg">
            <Grid container spacing={3}>
              <Grid item md={10} style={{ fontSize: '30px', fontWeight: 500, textTransform: 'capitalize', marginTop: '-20px', padding: '0' }}>
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Profile"
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      position: 'relative',
                      top: '37px',
                    }}
                  />
                ) : (
                  <AccountCircleIcon style={{ fontSize: '80px', position: 'relative', top: '37px' }} />
                )}
                <span class="view">Welcome,  {name.split(' ')[0]} 
                    <br/>
                      <small style={{fontSize: '15px', marginLeft: '85px', position: 'relative', top: '-10px'}} >{date}, {time}</small>
                    </span>
                  </Grid>
                  {/* <Grid item md={2} style={{textAlign: 'right'}} className={viewSelected == 'packages'? "hide": " "}>
                    <Button variant="contained" className="theme">
                      RENEWAL
                    </Button>
                  </Grid> */}
                </Grid>
            </div>
          </div>
      )}
      {viewSelected !== 'overview' && (
        <div className="breadcrumbs">
          <div className="App LoginBg">
            <Grid container spacing={3}>
              <Grid item md style={{ fontSize: '30px', fontWeight: 500, textTransform: 'capitalize' }}>
                {viewSelected.length <= 20 && <p class="view">{viewSelected}</p>}
                {viewSelected.length >= 20 && <p class="view">Packages / <small>Customize Package</small></p>}
              </Grid>
              <Grid item md style={{ textAlign: 'right' }} className={viewSelected === 'packages' ? "hide" : " "}>
                {/* <Button variant="contained" className="theme">
                  RENEWAL
                </Button> */}
              </Grid>
            </Grid>
          </div>
        </div>
      )}

      {/* Delete Account */}
      <Dialog
        open={openDeleteAccountDialog}
        onClose={handleCloseDeleteAccountDialog}
        maxWidth="sm"
        PaperProps={{
          style: {
            width: '800px',
            borderRadius: '10px',
          },
        }}
      >
        <div className="Deleteaccount-main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',padding: '10px 14px' }}>
          <div className="deleteaccount-info" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', borderRadius: '7px', marginBlock: '10px', padding: '20px 24px' }}>
            <Typography style={{ textAlign: 'center', marginTop: '20px' }} variant="h4">
              <DeleteIcon /> Delete Account
            </Typography>
            <Typography style={{ marginTop: '10px' }}>
              Are you sure want to delete your account? This will erase all of your account data from the site. To delete your account enter your password below.
            </Typography>
            <Typography variant="h5" style={{ textAlign: 'center' }}>
              <LockPersonIcon />
              <span style={{ display: 'block' }}>{email}</span>
            </Typography>
            <Typography><strong>To confirm, type "{email}" in the box below</strong></Typography>
            <FormControl style={{ marginTop: '10px' }} variant="filled" size="small" fullWidth>
              <InputLabel htmlFor="filled-adornment-confirm">Email</InputLabel>
              <FilledInput
                id="filled-adornment-confirm"
                value={confirmEmail}
                onChange={(e) => {
                  setConfirmEmail(e.target.value);
                  // Check if the entered email matches the displayed email
                  setEmailMatches(e.target.value === email);
                }}
                // Disable copy and paste
                onPaste={(e) => e.preventDefault()}
                onCopy={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
              />
            </FormControl>
            <Button style={{ marginTop: '20px', textAlign: 'center' }} variant="contained" disabled={!emailMatches || confirmEmail !== email} onClick={handleDeleteAccount}>Delete Account</Button>
            <CustomSnackbar message={deletemessage} variant={deletevariant} open={opendelete} onClose={handleDeleteClose} />
          </div>
        </div>
      </Dialog>

      {/* Feedback */}
      <Dialog
        open={openFeedbackDialog}
        onClose={handleCloseFeedbackDialog}
        maxWidth="md" // Adjust the size as needed
        PaperProps={{
          style: {
            width: '800px', // Adjust the width as needed
            borderRadius: '10px', // Add border radius for the dialog
          },
        }}
      >
          <div className="feedback-main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',padding: '10px 14px' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
                borderRadius: '7px',
                marginBlock: '10px',
                padding: '20px 24px',
              }}
            >
              <Typography style={{ textAlign: 'center', marginTop: '10px' }} variant="h4">
                Feedback Form
              </Typography>
              <Typography style={{ marginTop: '10px', textAlign: 'center' }}>
                Thank you for taking the time to provide your honest feedback! I am always looking for ways to improve, and your comments help me do so.
              </Typography>
              <Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Rating
                    name="hover-feedback"
                    value={ratingFeedback}
                    size="large"
                    precision={0.5}
                    onChange={handleratingChange}
                  />
                </Box>
                <InputLabel htmlFor="opinion">How satisfied were you with your session?</InputLabel>
                <Input
                  id="opinion"
                  name="opinion"
                  multiline
                  aria-label="Your Opinion"
                  fullWidth
                  value={messageFeedback}
                  onChange={handlemessageChange}
                  variant="outlined"
                  style={{ marginBottom: '10px' }}
                  inputProps={{
                    style: { padding: '1rem', height: '100px' },
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Button type="submit" variant="contained" color="primary" size="large" onClick={handleSubmitFeedback}>
                    Submit
                  </Button>
                </Box>
              </Box>
            </div>
          </div>
        </Dialog>
          <CustomSnackbar message={Feedbackmessage} variant={Feedbackvariant} open={openFeedback}  onClose={handleFeedbackClose} />  
    </div>
  );
  

}