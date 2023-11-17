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
import TextField from "@mui/material/TextField";
import Header from "./shared/header.js";
import Footer from "./shared/footer.js";
import Button from "@mui/material/Button";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import axios from "axios";
import { getIcons } from "./shared/getGraphics";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Modal from '@mui/material/Modal';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import EditIcon from '@mui/icons-material/Edit';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import Backdrop from '@mui/material/Backdrop';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

import { Input } from "@mui/material";
import { isValidFirstName, isValidLastName,isValidMobileNumber } from "./shared/utils";
// import Razorpay from 'razorpay';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const images = getIcons();
const label = { inputProps: { "aria-label": "Checkbox demo" } };
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  padding: theme.spacing(2),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));

export default function Checkout() {
  const SERVER_URI = process.env.REACT_APP_SERVER_URI;
  const USER_APP_LIST = `${SERVER_URI}/getUserApps`;
  const GET_ADDRESS = `${SERVER_URI}/address/getUserDeliveryAddresses`;
  const CREATE_ADDRESS = `${SERVER_URI}/address/createDeliveryAddress`;
  const DELETE_ADDRESS = `${SERVER_URI}/address/deleteDeliveryAddress`;
  const CREATE_ORDER = `${SERVER_URI}/user/createOrder`;
  const PIN_CODE_DETAILS_URL = `${SERVER_URI}/pincode-details`;
  const PAYMENT = `${SERVER_URI}/user/paymentSuccess`;
  const CREATE_VM=`${SERVER_URI}/user/createVirtualMachine`
  const [categoryAPIInvoked, setCategoryAPIInvoked] = React.useState(false);


  const [snackbaropen, setSnackbarOpen] = React.useState(false);
  const [categories, setCategories] = React.useState([]);
  const [spinner, setSpinner] = React.useState(true);
  const [addressList, setAddressList] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [variant, setMessageVariant] = React.useState("");
  const [showBackdrop, setShowBackdrop] =React.useState(false);


  // Shipping Addresss
  const [country, setCountry] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState();
  const [address, setAddress] = React.useState();
  const [apartment, setApartment] = React.useState();
  const [city, setCity] = React.useState();
  const [state, setState] = React.useState();
  const [pincode, setPincode] = React.useState();
  const [phone, setPhone] = React.useState();
  const [saveButtonEnable, setSaveButtonEnable] = React.useState(false);
  const [addressReceived, setAddressReceived] = React.useState({});
  const [selectedPaymentMode, setSelectedPaymentMode] = React.useState("razorpay");
  

  // Modal
  const [modalOpen, setModalOpen] = React.useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => {
    setModalOpen(false);
    setFirstName(addressReceived.firstname)
    setLastName(addressReceived.lastname)
    setAddress(addressReceived.address)
    setApartment(addressReceived.apartment)
    setCity(addressReceived.city)
    setState(addressReceived.state)
    setCountry(addressReceived.country)
    setPhone(addressReceived.phone)
    setPincode(addressReceived.postalCode)
  }
  const [amount, setAmount] = React.useState('10');


  useEffect(() => {
    let token = localStorage.getItem("accessToken");

    if (token == "" || token == undefined) {
      window.location.href = "/";
    }

    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    if (categoryAPIInvoked == false) {
      setCategoryAPIInvoked(true)
      // Get User Selected Apps
      // axios
      //   .get(USER_APP_LIST, config)
      //   .then((response) => {
      //     setCategories(response.data.userApps);
      //     setSpinner(false);
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });

      // Get Delivery Address
      axios
        .get(GET_ADDRESS, config)
        .then((response) => {
          setAddressReceived(response.data)
          let data = response.data
          setAddressList(data);
          setSpinner(false);
          setFirstName(data.firstname)
          setLastName(data.lastname)
          setAddress(data.address)
          setApartment(data.apartment)
          setCity(data.city)
          setState(data.state)
          setCountry(data.country)
          setPhone(data.phone)
          setPincode(data.postalCode)
        })
        .catch((err) => {
          console.log(err);
        });
         
                
        
        // axios
        // .delete(DELETE_ADDRESS + '/64cbab5c34ee091cec17ed6a', config)
        // .then((response) => {
        // })
        


    }
  });

  const saveAddress = () => {
    let token = localStorage.getItem("accessToken");
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    if (country == '' || firstName == '' || firstName == '' || address == '' || city == '' || state == '' || pincode == '') {
      setSaveButtonEnable(true);
      setSnackbarOpen(true);
      setMessage('Fill the mandatory fields');
      setMessageVariant("warning");
    }
      // Validate the first name and last name and Mobile number using the custom validation functions
    else if (!isValidFirstName(firstName) || !isValidLastName(lastName)) {
        setSaveButtonEnable(true);
      setSnackbarOpen(true);
        setMessage("Invalid first name or last name");
        setMessageVariant("warning");
      
      }
    else if (! isValidMobileNumber(phone)) {
        setSaveButtonEnable(true);
        setSnackbarOpen(true);
        setMessage('Invalid phone number');
        setMessageVariant('warning');      
    }
    else {
      let data = {
        "country": country,
        "firstname": firstName,
        "lastname": lastName,
        "address": address,
        "apartment": apartment,
        "city": city,
        "state": state,
        "postalCode": pincode,
        "phone": phone
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
        setModalOpen(false)
    }
    setTimeout(function () {
      setSnackbarOpen(false);
    }, 5000);
  };

  const createOrder = () => {
    let token = localStorage.getItem("accessToken");
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };    
    let data = {
      amount: 100,
      currency: "INR",
    };

      axios
      .post(CREATE_ORDER, data, config)
      .then((response) => {
        setSnackbarOpen(true);
        if (response.data) {
          setMessage('Order Created');
          setMessageVariant("success");
          setShowBackdrop(true);
          setAddressList(response.data);
          setSpinner(false);       
    
          console.log(response.data)
          const { orderCreate } = response.data;
          console.log(orderCreate);
          const order_id = orderCreate?.id;
          console.log(order_id); // Output: "order_MFxDMogILBXShR"
          const receipt_id = orderCreate.receipt;
          console.log(receipt_id);
                   
          // Initialize Razorpay options
          let options = {
            key: 'rzp_test_goMtSCBFmPYXci',
            amount: amount * 100, // Amount in paise or the smallest currency unit
            currency: 'INR',
            name: 'Razor-Pay',
            description: 'For testing purpose',
            order_id: order_id,
            receipt_id:receipt_id,
            handler: function (response) {
              const { razorpay_payment_id, razorpay_signature } = response;
              console.log('Payment ID:', razorpay_payment_id);
              console.log('Signature:', razorpay_signature);
              // console.log('order_id;', order_id);

              // Make a POST request to handle payment success with pdf
              axios.post(PAYMENT, {
                razorpay_payment_id: razorpay_payment_id,
                razorpay_order_id: order_id,
                razorpay_signature: razorpay_signature,
                receipt: receipt_id,
    
              },config)
              .then((response) => {
                  console.log('Payment success:', response.data);
                  setMessage('Payment successful. You will get a mail shortly !!!');
                  setMessageVariant("success");
                  setSnackbarOpen(true);
                  setShowBackdrop(true);
                  window.location.href="/buffer"
                  axios
                  .get(CREATE_VM, config)
                  .then((response) => {
                    // Handle the response from the createVirtualMachine API
                    console.log("Virtual Machine Created:", response.data);
                    if (response.data.message) {
                      setMessage(response.data.message);
                      setMessageVariant("success");
                      setAddressList(response.data);
                      setSpinner(false);
                    } else if (response.data.warning) {
                      setMessage(response.data.warning);
                      setMessageVariant("warning");
                    } else if (response.data.error) {
                      setMessage(response.data.error);
                      setMessageVariant("error");
                    }
                    setShowBackdrop(false);
                  })
                  .catch((vmError) => {
                    console.error("Error creating virtual machine:", vmError);
                    // Handle any errors from the createVirtualMachine API
                    setShowBackdrop(false);
                  });
                  setTimeout(function () {
                    setSnackbarOpen(false);
                  }, 5000);
                })
                .catch((error) => {
                  console.error('Error handling payment success:', error);
                  setShowBackdrop(false);
                });
            }
          };
          // Initialize and open Razorpay payment
          var razorpayInstance = new window.Razorpay(options);
          razorpayInstance.open();
        } 
        else if (response.data.warning) {
          setMessage(response.data.warning);
          setMessageVariant("warning");
        } 
        else if (response.data.error) {
          setMessage(response.data.error);
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

  const setPincodeDetails = (e) => { 
      setPincode(e)
      // Check the pincode length
      if (e.length == 6) {
        let token = localStorage.getItem("accessToken");
        let config = {
          headers: { Authorization: `Bearer ${token}` },
        };
  
        axios
        .get(PIN_CODE_DETAILS_URL + '/' + e, config)
        .then((response) => {
          // Handle the response data here
          const data = response.data;
          setCity(data.city);
          setState(data.state);
          setCountry(data.country);
        })
        .catch((error) => {
          // Handle any errors here
          console.error(error);
          // Clear the city, state, and country fields on error
          setCity("");
          setState("");
          setCountry("");
        });
      } 
      else {
        // If the pincode length is not 6, clear the city, state, and country fields
        setCity("");
        setState("");
        setCountry("");
      }
  };

  const updateButtonState = () => {
    // if (
    //   firstName &&
    //   lastName &&
    //   address &&
    //   city &&
    //   state &&
    //   pincode &&
    //   phone &&
    //   country &&
    //   selectedPaymentMode === "razorpay"
    // ) {
    //   setSaveButtonEnable(true); // If needed
    // } else {
    //   setSaveButtonEnable(false); // If needed
    // }
  };
  const handlePaymentModeChange = (event) => {
    setSelectedPaymentMode(event.target.value);
  };
  
  return (
  <>
  {/* <Header /> */}
  {showBackdrop && (

<Backdrop

  sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}

  open={true} // Show backdrop when showBackdrop is true

  onClick={() => setShowBackdrop(false)} // Close backdrop on click

>

  <CircularProgress color="inherit" />

</Backdrop>

)} 
    <div className="AppBg">
      <Grid container className="catagoryGrid">
        <Grid container item md={4} xs={12}>
          <div className="videoBlock"></div>
        </Grid>

        {/* <Grid container className="catagoryGrid">
            <Grid item xs={12}>
              <h1>User Selected Apps</h1>
            </Grid>
            <Grid container spacing={{ xs: 2, md: 3 }}>
              {categories.map((list, index) => (
                <Grid item xs={3} sm={1} md={1} key={index}> 
                    <img
                      src={images[list]}
                      alt={list}
                      className="pic"
                    />
                    <p style={{minHeight: '60px'}}>{list}</p>
                </Grid>
              ))}
            </Grid>        
          </Grid> */}

        <Grid container item md={8}>
          <Grid container className="catagoryGrid">
            <Grid container item md={12}>
              <h1>Product Summary</h1>
            </Grid>
            <Grid container item md={3}>
              { Object.entries(addressReceived).length == 0 && 
                <div className="addAddress" onClick={handleModalOpen}>
                  <span>+</span>
                  <p>Add Address</p>
                </div>
              }
              { Object.entries(addressReceived).length != 0 && 
                <div className="addAddress details">
                  <p style={{fontSize: '14px', margin: '0 0 10px 0'}}>
                      <strong>Shipping Address </strong> 
                    <EditIcon sx={{ fontSize: 13 }} style={{position: 'relative', top: '5px', left: '5px', borderRadius: '20px', border: '2px solid #000', padding: '2px 2.5px'}} onClick={handleModalOpen}/>
                  </p>
                  <p>{firstName} {lastName}</p>
                  <p>
                    {address}, {apartment}, {city}, {state}, {country}
                  </p>
                  <p>PinCode: {pincode}</p>
                  <p>Phone: {phone}</p>
                </div>
              }  
            </Grid>

            <Grid container item md={8} className="addressContainer">
              <Grid container>
                <Grid item md={6}>
                  <h4 style={{ margin: 0 }}>Price Details</h4>
                  <p style={{borderBottom: '1px dotted #bbb'}}>Total Product Price 
                    <span style={{float: 'right'}}>+<CurrencyRupeeIcon  style={{fontSize: '12px', position: 'relative', top: '1px',}} />1099</span>
                  </p>
                  <p style={{fontWeight: 600}}>Order Total 
                    <span style={{float: 'right'}}><CurrencyRupeeIcon  style={{fontSize: '12px', position: 'relative', top: '1px',}} />1099</span>
                  </p>
                  
                  {/* <Button variant="contained" className="theme" style={{ marginRight: "15px" }} onClick={createOrder}>
                    Create Order
                  </Button> */}

                </Grid>
                <Grid item md={6}>
                <Link to="/packages">
                  <h4 className="viewPlan">VIEW PLAN & PACKAGE DETAILS</h4>
                  </Link>
                </Grid>
              </Grid>
              <Grid container>               
             
              </Grid>
            </Grid>
          </Grid>

          <hr style={{ width: "100%", marginTop: "30px" }} />

          <Grid container>
            <Grid container item md={12}>
              <p style={{fontSize: '32px', width: '100%'}}>Select any Payment mode to pay</p>

              <FormControl>
                <RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue="razorpay"  name="radio-buttons-group"
                onChange={(e)=>{
                handlePaymentModeChange(e);
                updateButtonState()
                }}>
                  <FormControlLabel value="razorpay" control={<Radio />} label="Razorpay" />
                  <FormControlLabel value="cashfree" control={<Radio />} label="Cashfree" />
                  <FormControlLabel value="wallet" control={<Radio />} label="Wallet" />
                </RadioGroup>
              </FormControl>

              {/* <AccountBalanceIcon style={{fontSize: '20px', position: 'relative', top: '2px',}} /> */}
              
            </Grid>
          </Grid>

        </Grid>
      </Grid>

      {/* Buttons  */}
      <Box style={{ textAlign: "right", marginTop: "25px" }}>
        {/* <Link to="/home">
          <Button variant="contained" className="skip">
            SKIP
          </Button>
        </Link> */}

        <Button
          variant="contained"
          className="theme"
          style={{ marginRight: "15px" }}  
          onClick={createOrder}
          disabled={
            !(firstName && lastName && address && city && state && pincode && phone && country) ||
            selectedPaymentMode !== "razorpay"
          }
        >
          Pay (1099)
        </Button>
      </Box>

      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Grid container className="catagoryGrid">
            <Grid container item md={12}>
              <h1>Shipping Address</h1>
              <TextField
                style={{ marginTop: "10px" }}
                type="text"
                label={<span>First Name<span style={{ color: 'red' }}>*</span></span>}
                variant="filled"
                size="small"
                fullWidth
                value={firstName}
                defaultValue={firstName}
                onChange={(e) => {setFirstName(e.target.value);
                updateButtonState();}}
              />
              <TextField
                style={{ marginTop: "10px" }}
                type="text"
                label={<span>Last Name<span style={{ color: 'red' }}>*</span></span>}
                variant="filled"
                size="small"
                fullWidth
                value={lastName}
                defaultValue={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <TextField
                style={{ marginTop: "10px" }}
                type="text"
                label={<span>Address<span style={{ color: 'red' }}>*</span></span>}
                variant="filled"
                size="small"
                fullWidth
                value={address}
                defaultValue={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <TextField
                style={{ marginTop: "10px" }}
                type="text"
                label="Apartment, Suite, etc. (optional)"
                variant="filled"
                size="small"
                fullWidth
                value={apartment}
                defaultValue={apartment}
                onChange={(e) => setApartment(e.target.value)}
              />
              <TextField
                style={{ marginTop: "10px" }}
                type="text"
                label={<span>Phone<span style={{ color: 'red' }}>*</span></span>}
                variant="filled"
                size="small"
                fullWidth
                value={phone}
                defaultValue={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <TextField
                style={{ marginTop: "10px" }}
                type="text"
                label={<span>PinCode<span style={{ color: 'red' }}>*</span></span>}
                variant="filled"
                size="small"
                fullWidth
                value={pincode}
                defaultValue={pincode}
                onChange={(e) => setPincodeDetails(e.target.value)}
              />
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
                disabled
                InputLabelProps={{
                  shrink: city !== '', // Shrink the label only if the city has a value
                }}
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
                disabled
                InputLabelProps={{
                  shrink: state !== '', // Shrink the label only if the state has a value
                }}
              />
              <FormControl variant="filled" sx={{ minWidth: "100%"}}style={{ marginTop: "10px" }}>
                {/* <InputLabel id="demo-simple-select-filled-label">
                  Country/Region
                </InputLabel> */}
                <TextField
                  labelId="demo-simple-select-filled-label"
                  id="demo-simple-select-filled"
                  variant="filled"
                  size="small"
                  label="Country/Region"
                  fullWidth
                  value={country}
                  defaultValue={country}
                  onChange={(e) => setCountry(e.target.value)}
                  disabled
                  InputLabelProps={{
                    shrink: country !== '', // Shrink the label only if the country has a value
                  }}
                >
                  {/* <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={"India"}>India</MenuItem>
                  <MenuItem value={"Australia"}>Australia</MenuItem>
                  <MenuItem value={"Germany"}>Germany</MenuItem> */}
                </TextField>
              </FormControl>
              <div style={{ textAlign: 'right', width: "100%" }}>
                <Button
                  variant="contained"
                  className="theme"
                  style={{ marginTop: "15px", marginRight: "15px" }}
                  onClick={handleModalClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  className="theme"
                  style={{ marginTop: "15px" }}
                  onClick={saveAddress}
                >
                  Save
                </Button>
              </div>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      <CustomSnackbar message={message} variant={variant} open={snackbaropen} />
    </div>
    <Footer />
    </>
  );
}

// export default function Checkout();
