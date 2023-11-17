import * as React from "react";
import { useEffect } from "react";
import axios from "axios";
import CustomSnackbar from "./shared/snackbar";
import Button from "@mui/material/Button";
import Grid from '@mui/material/Grid';
import { getIcons } from "./shared/getGraphics";
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from "@mui/material/TextField";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PropTypes from "prop-types";
import OtpInput from 'react-otp-input';
import jsPDF from 'jspdf';
import CircularProgress from "@mui/material/CircularProgress";
import Header from "./shared/header.js";
import Footer from "./shared/footer.js";
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import Tooltip from '@mui/material/Tooltip';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Modal } from "@mui/material";
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

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};
export default function Profile() {
  const SERVER_URI = process.env.REACT_APP_SERVER_URI;
  const GET_USER = `${SERVER_URI}/user`;
  const USER_UPDATE = `${SERVER_URI}/user/update`;
  const GET_ADDRESS = `${SERVER_URI}/address/getUserDeliveryAddresses`;
  const CREATE_ADDRESS = `${SERVER_URI}/address/createDeliveryAddress`;
  const UPLOAD_PROFILE_PIC= `${SERVER_URI}/uploadProfilePicture/`;
  const DELETE_PROFILE_PIC=`${SERVER_URI}/deleteProfilePicture/`
  const INVOICE_PDF= `${SERVER_URI}/userSubscriptionDetails`;
  const UPDATE_EMAIL=`${SERVER_URI}/initiateEmailChange`
  const VERIFY_EMAIL=`${SERVER_URI}/verifyAndChangeEmail`
  const [res, setRes] = React.useState([]);

  const [value, setValue] = React.useState(0);
  const images = getIcons();
  const [spinner, setSpinner] = React.useState(true);

  //Modal
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  // const handleModalOpen = () => setModalOpen(true);
  // const handleModalClose = () => setModalOpen(false);

  // SnackBar 
  const [snackbaropen, setSnackbarOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [variant, setMessageVariant] = React.useState("");
  const [otp, setOtp] = React.useState('');

  //UserId
  const [userId, setUserId] = React.useState("");

  // Billing Information
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  
  // Billing Information
  const [country, setCountry] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [apartment, setApartment] = React.useState("");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [pincode, setPincode] = React.useState("");
  const [saveButtonEnable, setSaveButtonEnable] = React.useState(false);
  const [addressList, setAddressList] = React.useState([]);
  const [selectedImage, setSelectedImage]=React.useState([])
  const [date, setDate]=React.useState();
  
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  }; 
  
  React.useEffect(() => {
    if (
      localStorage.getItem("accessToken") == "" ||
      localStorage.getItem("accessToken") == undefined
    ) {
      setMessage("User not logged in");
      setSnackbarOpen(true);
      setTimeout(() => {
        window.location.href = "/login";
        setSnackbarOpen(false);
      }, 100);
    }
  });  
  
  
  useEffect(() => {
    let token = localStorage.getItem("accessToken");
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    if (res.length == 0) {
      axios
        .get(GET_USER, config)
        .then((response) => {
          setSpinner(false);
          setRes(response.data);
          setName(response.data.name)
          setEmail(response.data.email)
          setPhone(response.data.mobileNumber)
          setDate(response.data.createdAt.split('T')[0])
          setUserId(response.data._id)
          if(response.data.profilePictureUrl && response.data.profilePictureUrl != ''){
            setSelectedImage(response.data.profilePictureUrl)
          }
        })
        .catch((err) => {
          console.log(err);
        });

        // Get Delivery Address
        axios
        .get(GET_ADDRESS, config)
        .then((response) => {
          let data = response.data;
          setAddressList(data);
          setSpinner(false);
          setFirstName(data.firstname);
          setLastName(data.lastname);
          setAddress(data.address);
          setApartment(data.apartment);
          setCity(data.city);
          setState(data.state);
          setCountry(data.country);
          // setPhone(data.phone);
          setPincode(data.postalCode);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });

  const userUpdate = () => {
    let token = localStorage.getItem("accessToken");
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    let data = {
      "name": name,   
      "mobileNumber": phone 
    }
    axios
        .put(USER_UPDATE, data, config)
        .then((res) => {
          setSnackbarOpen(true);
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
          console.log(err);
        });
      setTimeout(function () {
        setSnackbarOpen(false);
      }, 5000);
  };
   
  const saveAddress = () => {
    let token = localStorage.getItem("accessToken");
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    if (
      country == "" ||
      firstName == "" ||
      firstName == "" ||
      address == "" ||
      city == "" ||
      state == "" ||
      pincode == ""
    ) {
      setSaveButtonEnable(true);
      setSnackbarOpen(true);
      setMessage("Fill the mandatory fields");
      setMessageVariant("warning");
    } else {
      let data = {
        country: country,
        firstname: firstName,
        lastname: lastName,
        address: address,
        apartment: apartment,
        city: city,
        state: state,
        postalCode: pincode,
        phone: phone,
      };

      axios
        .post(CREATE_ADDRESS, data, config)
        .then((res) => {
          setSnackbarOpen(true);
          if (res.data.message) {
            setMessage(res.data.message);
            setMessageVariant("success");
            setAddressList(res.data);
            setSpinner(false);
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
    }
    setTimeout(function () {
      setSnackbarOpen(false);
    }, 5000);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.includes('image')) {
      uploadProfilePicture(file);
    } else {
      alert('Please select a valid image file.');
    }
  };

  const uploadProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const res = await axios.post(UPLOAD_PROFILE_PIC + userId, formData);
      setSnackbarOpen(true);
      if (res.data.message) {
        setMessage(res.data.message);
        setMessageVariant('success');
        // Save the uploaded image URL to local storage
        // localStorage.setItem('profileImageURL', res.data.imageUrl);
        setSelectedImage(res.data.imageUrl);
        setSpinner(false);
      } else if (res.data.warning) {
        setMessage(res.data.warning);
        setMessageVariant('warning');
      } else if (res.data.error) {
        setMessage(res.data.error);
        setMessageVariant('error');
      }
      setTimeout(() => {
        setSnackbarOpen(false);
      }, 5000);
    } catch (err) {
      console.log(err);
    }
  }

  const deleteProfilePicture = async (userId) => {
    try {
      const res = await axios.delete(DELETE_PROFILE_PIC + userId);
      setSnackbarOpen(true);
      
      if (res.data) {
        setSelectedImage(null);
        setMessage("The profile picture was deleted successfully.");
        setMessageVariant('success');
        window.location.reload();
      } else if (res.data.warning) {
        setMessage(res.data.warning);
        setMessageVariant('warning');
      } else if (res.data.error) {
        setMessage(res.data.error);
        setMessageVariant('error');
      }
      setTimeout(() => {
        setSnackbarOpen(false);
      }, 5000);
    } catch (err) {
      console.log(err);
    }
  }
  

  // useEffect(() => {
  //   const savedImageURL = localStorage.getItem('profileImageURL');
  //   if (savedImageURL) {
  //     setSelectedImage(savedImageURL);
  //   }
  // }, []);



  const downloadInvoice = async () => {
      let isDownloading = false;

    if (isDownloading) {

      return; // Prevent multiple simultaneous downloads

    }
    isDownloading = true;

     let token = localStorage.getItem("accessToken");
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    try {
      const response = await axios.get(INVOICE_PDF, config);
      const paymentDetails = response.data.paymentDetails;
   
        console.log(response)

      const userFileName = window.prompt('Enter the file name for the download:', 'invoice');

      if (!userFileName) {
        return; // User cancelled the prompt
     }
      const doc = new jsPDF();
      doc.setFontSize(12);
      doc.text('Invoice', 10, 10);
      if (paymentDetails) {
        doc.text(`User Name: ${paymentDetails.userName}`, 10, 30);
        doc.text(`Plan Name: ${paymentDetails.planName}`, 10, 40);
        doc.text(`Receipt ID: ${paymentDetails.receipt}`, 10, 50);
        const formattedPaymentDate = new Date(paymentDetails.paymentValidity).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',

        });
        doc.text(`Payment Date: ${formattedPaymentDate}`, 10, 60);
        doc.text(`Payment ID: ${paymentDetails.paymentId}`, 10, 70);
        doc.text(`Amount: ${paymentDetails.amount}`, 10, 80);
      }
      const pdfBlob = doc.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${userFileName}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    } catch (error) {
      console.error('Error:', error);

    } finally {

      isDownloading = false; // Reset the flag when download is complete or encounters an error
    }

  };

  const handleUpdateEmail = function (e) {
    let token = localStorage.getItem("accessToken");
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    let data = {
      newEmail:email
    };
    axios
      .post(UPDATE_EMAIL, data, config )
      .then((res) => {
        setSnackbarOpen(true)
        if (res.data.success) {
          setMessage(res.data.message)
          setMessageVariant('success')
          // localStorage.setItem("accessToken", res.data.token);
          // setScreen('verify');
        } 
        else if (res.data.warning) {
          setMessage(res.data.message)
          setMessageVariant('warning')
        } 
        else if (res.data.error) {
          setMessage(res.data.message)
          setMessageVariant('error')
        } 
      })
      .catch((err) => {
      });
      setTimeout(function(){
        setSnackbarOpen(false); 
      }, 5000);
  };

  const handleverifyEmail = function (e) {
    let token = localStorage.getItem("accessToken");
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    let data = {
      newEmail:email,
      otp: otp
    };
    axios
      .post(VERIFY_EMAIL, data, config)
      .then((res) => {
        setSnackbarOpen(true);
        if (res.data.success) {
          setMessage(res.data.message)
          setMessageVariant('success') 
          // localStorage.setItem("accessToken", res.data.token);
          setIsModalOpen(true);         
        } 
        else if (res.data.warning) {
          setMessage(res.data.message)
          setMessageVariant('warning')
        } 
        else if (res.data.error) {
          setMessage(res.data.message)
          setMessageVariant('error')
        } 
      })
      .catch((err) => {
      });
      setTimeout(function(){
        setSnackbarOpen(false); 
      }, 5000);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };  
  

  return (
    <div>
      <Header/>
      <div className="App LoginBg" >
          <Grid container justifyContent="center">
            <Grid item md={8} xs={12} className="profile">              
              <Grid container spacing={3}>
                <Grid item md={4} className="profileBg">
                  <div className="details userpic">
                  <Tooltip title={name} arrow>
                    <p className="name" style={{fontSize: '18px', fontWeight: 600, marginTop: '15px'}}>{name}</p>
                  </Tooltip>

                    {/* <p><small>@James</small></p> */}
                       { selectedImage != ''? (
                          <div>
                            <p className="deleteImg"><i onClick={() => deleteProfilePicture(userId)} ><DeleteIcon style={{fontSize: '14px', cursor: 'pointer'}} /></i></p>
                            <img
                              src={selectedImage}
                              alt=" "
                              style={{ marginTop: '15px'}}
                            />  
                          </div>
                        ) : 
                        (
                          <AccountCircleIcon style={{ marginTop: '20px', width: "100px", height: "100px"}} />
                        )
                      }                   
                    <input
                       type="file"
                       accept="image/*" // Set the "accept" attribute to restrict file types to images
                       style={{ display: 'none' }}
                       onChange={handleFileChange}
                       id="imageInput" // Provide an ID for the input element
                      />
                      <label htmlFor="imageInput">
                        <br/>
                      <Button variant="contained" className="orange" style={{ marginTop: '15px' }} component="span">
                        Upload new Photo
                      </Button>
                      </label>

                    <p className="message">Upload a new avatar. Larger image will be resized automatically.<br/>Maximum upload size is <strong>1MB</strong></p>
                    <p className="note">Member Since: <strong>{date}</strong></p>
                  </div>
                </Grid>
                <Grid item md={8} className="profileBg">            
                  <div className="details" style={{minHeight: '405px'}}>
                      <h1 style={{ margin: "0px", padding: "30px 30px 10px" }}>Edit Profile</h1>   

                        <Box sx={{ width: '100%' }}>
                              <Box sx={{ borderBottom: 1, borderColor: 'divider' }} style={{padding: "0 30px" }}>
                                <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs example">
                                  <Tab label="User Info" {...a11yProps(0)} style={{textTransform: 'capitalize' }} />
                                  <Tab label="Billing Info" {...a11yProps(1)} style={{textTransform: 'capitalize' }} />
                                </Tabs>
                              </Box>
                              <TabPanel value={value} index={0}>
                                <h2 style={{ marginTop: "15px", padding: "0 20px" }}>User Information</h2>
                                {spinner ? (
                                  <span className="align-center mt-40">
                                    <CircularProgress />
                                  </span>
                                ) : (
                                  <Grid container style={{ margin: "0px", padding: "0 20px" }}>
                                    <Grid item md={6} style={{ paddingLeft: "0px", paddingRight: "10px"}}>   
                                      <TextField
                                        style={{ marginTop: "10px" }}
                                        type="text"
                                        label="Name"
                                        variant="filled"
                                        size="small"
                                        fullWidth
                                        value={name}
                                        defaultValue={name}
                                        onChange={(e) => setName(e.target.value)}
                                      /> 
                                      <TextField
                                        style={{ marginTop: "20px" }}
                                        type="text"
                                        label="Phone"
                                        variant="filled"
                                        size="small"
                                        fullWidth
                                        value={phone}
                                        defaultValue={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                      />
                                    </Grid>
                                    <Grid item md={6} style={{ paddingLeft: "0px", paddingRight: "10px"}}>   
                                      <TextField
                                        style={{ marginTop: "10px" }}
                                        type="text"
                                        label="Email Address"
                                        variant="filled"
                                        size="small"
                                        fullWidth
                                        value={email}
                                        defaultValue={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={email.endsWith('@gmail.com')}
                                      />
                                        {/* <TextField
                                        style={{ marginTop: "10px" }}
                                        type="text"
                                        label="Email Address"
                                        variant="filled"
                                        size="small"
                                        fullWidth
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                      />   */}
                                    <Button
                                     size="small"                                    
                                     style={{marginLeft:"125px",
                                     padding: "2px 8px",
                                     fontSize: "10px",
                                     minHeight: "20px"}}
                                     onClick={() => {
                                      handleUpdateEmail();
                                      handleModalOpen();
                                    }}
                                    disabled={email.endsWith('@gmail.com')}
                                     >
                                      Update email
                                    </Button>
                                    <Button variant="contained" className="orange" style={{ marginBlock: "5px"}} onClick={userUpdate}>
                                      Update info
                                    </Button>      
                                    </Grid>                   
                                  </Grid>
                                )}
                           </TabPanel>
                              <TabPanel value={value} index={1}>
                                <h2 style={{ marginTop: "15px", padding: "0 20px", position: "relative", cursor: 'pointer' }}>Billing Information 
                                  <DownloadForOfflineIcon onClick={downloadInvoice} style={{  padding: "0 20px", position: "absolute", right: 0, marginTop: "-3px" }} />
                                 <span onClick={downloadInvoice}  style={{ padding: "0 20px", position: "absolute", right: "26px", fontSize: "11px" }}>Download Invoice</span>
                                </h2>
                                <Grid container style={{ margin: "0px", padding: "0 20px" }}>
                                  <Grid item md={6} style={{ paddingLeft: "0px", paddingRight: "10px"}}>   
                                    <TextField
                                      style={{ marginTop: "10px" }}
                                      type="text"
                                      label="First Name"
                                      variant="filled"
                                      size="small"
                                      fullWidth
                                      value={firstName}
                                      defaultValue={firstName}
                                      onChange={(e) => setFirstName(e.target.value)}
                                    />
                                    <TextField
                                      style={{ marginTop: "10px" }}
                                      type="text"
                                      label="Address"
                                      variant="filled"
                                      size="small"
                                      fullWidth
                                      value={address}
                                      defaultValue={address}
                                      onChange={(e) => setAddress(e.target.value)}
                                    />
                                    {/* <TextField
                                      style={{ marginTop: "10px" }}
                                      type="text"
                                      label="Phone (optional) "
                                      variant="filled"
                                      size="small"
                                      fullWidth
                                      value={phone}
                                      defaultValue={phone}
                                      onChange={(e) => setPhone(e.target.value)}
                                    /> */}
                                    <TextField
                                      style={{ marginTop: "10px" }}
                                      type="text"
                                      label="City"
                                      variant="filled"
                                      size="small"
                                      fullWidth
                                      value={city}
                                      defaultValue={city}
                                      onChange={(e) => setCity(e.target.value)}
                                    />
                                    <TextField
                                      style={{ marginTop: "10px" }}
                                      type="text"
                                      label="Country"
                                      variant="filled"
                                      size="small"
                                      fullWidth
                                      value={country}
                                      defaultValue={country}
                                      onChange={(e) => setCountry(e.target.value)}
                                    />
                                  </Grid>
                                 
                                  <Grid item md={6} style={{ paddingLeft: "0px", paddingRight: "10px"}}>  
                                    <TextField
                                      style={{ marginTop: "10px" }}
                                      type="text"
                                      label="Last Name"
                                      variant="filled"
                                      size="small"
                                      fullWidth
                                      value={lastName}
                                      defaultValue={lastName}
                                      onChange={(e) => setLastName(e.target.value)}
                                    />
                                    {/* <TextField
                                      style={{ marginTop: "10px" }}
                                      type="text"
                                      label="Apartment, Suite, etc. (optional)"
                                      variant="filled"
                                      size="small"
                                      fullWidth
                                      value={apartment}
                                      defaultValue={apartment}
                                      onChange={(e) => setApartment(e.target.value)}
                                    /> */}
                                    <TextField
                                      style={{ marginTop: "10px" }}
                                      type="text"
                                      label="PinCode"
                                      variant="filled"
                                      size="small"
                                      fullWidth
                                      value={pincode}
                                      defaultValue={pincode}
                                      onChange={(e) => setPincode(e.target.value)}
                                    />
                                    <TextField
                                      style={{ marginTop: "10px" }}
                                      type="text"
                                      label="State"
                                      variant="filled"
                                      size="small"
                                      fullWidth
                                      value={state}
                                      defaultValue={state}
                                      onChange={(e) => setState(e.target.value)}
                                    />
                                    <Button variant="contained" className="orange" style={{marginBlock: '15px' }} onClick={saveAddress}>
                                      Update Details
                                    </Button>   
                                  </Grid>
                     
                                </Grid>
                              </TabPanel>
                            </Box>
                </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Modal
           open={isModalOpen} 
           onClose={handleModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <Grid container className="catagoryGrid"> 
                <Grid container item md={12} style={{textTransform: 'capitalise'}}>                
                <p className="align-center">Enter Your<strong>One Time Password </strong>Here</p>
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
                    <Grid item xs={8}>
                      <Button
                        variant="contained"        
                        fullWidth            
                        onClick={handleUpdateEmail}
                        size="small"
                      >
                        RESEND OTP
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                      size="small"
                        variant="contained"        
                                    
                        onClick={handleverifyEmail}
                        disabled={otp.length < 4}
                      >
                        VERIFY OTP
                      </Button>
                    </Grid>
                  </Grid>
                </div>            
                </Grid>
              </Grid>
            </Box>
          </Modal>            
          <CustomSnackbar message={message} variant="success" open={snackbaropen} />
      </div>
      <Footer />
    </div>
  );
}

// export default function Profile();
