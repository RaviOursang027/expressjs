import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Tooltip from '@mui/material/Tooltip';
import CustomSnackbar from "./shared/snackbar";
import Button from "@mui/material/Button";
import Grid from '@mui/material/Grid';
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';
import Header from "./shared/header.js";
import Footer from "./shared/footer.js";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import '../assets/css/responsive.css';
import CircleIcon from '@mui/icons-material/Circle';
import ComputerIcon from '@mui/icons-material/Computer';
import SignalCellular0BarIcon from '@mui/icons-material/SignalCellular0Bar';
import SignalCellular1BarIcon from '@mui/icons-material/SignalCellular1Bar';
import SignalCellular2BarIcon from '@mui/icons-material/SignalCellular2Bar';
import SignalCellular3BarIcon from '@mui/icons-material/SignalCellular3Bar';
import SignalCellular4BarIcon from '@mui/icons-material/SignalCellular4Bar';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import CloseIcon from '@mui/icons-material/Close';

function formatTime(timestamp) {
  const date = new Date(timestamp);
  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  const formattedTime = `${date.getHours()}:${date.getMinutes()}${date.getHours() >= 12 ? 'pm' : 'am'}`;
  return `${formattedDate} ${formattedTime}`;
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

export default function Overview() {
  const SERVER_URI = process.env.REACT_APP_SERVER_URI;
  const GET_USER = `${SERVER_URI}/user`;
  const GET_SUBSCRIPTION_DETAILS = `${SERVER_URI}/userSubscriptionDetails`;
  const GET_STATUS_VM = `${SERVER_URI}/status-vm`;
  const VM_SESSION = `${SERVER_URI}/Vm-session`;
  const NETWORK_STATS = `${SERVER_URI}/network-stats`;
  const PAYMENT = `${SERVER_URI}/user/paymentSuccess`;
  const CREATE_VM=`${SERVER_URI}/user/createVirtualMachine`
  const CREATE_ORDER = `${SERVER_URI}/user/createOrder`;

  //network status related
  const [networkStats, setNetworkStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [networkError, setNetworkError] = useState('');
  const [totalBytes, setTotalBytes] = useState(0);

  //vm session related
  const [sessionData, setSessionData] = useState([]);
  const [error, setError] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  //vm related 
  const [vmButtonColor, setVmButtonColor] = useState("");
  const [tooltipVmStatus, setTooltipVmStatus] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
 
  const [res, setRes] = React.useState([]);
  const [subscription, setSubscription] = React.useState([]);

  // SnackBar
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [variant, setMessageVariant] = React.useState("");
  const [showBackdrop, setShowBackdrop] =React.useState(false);
  const [snackbaropen, setSnackbarOpen] = React.useState(false);
  const [spinner, setSpinner] = React.useState(true);
  const [amount, setAmount] = React.useState('10');
  const [addressList, setAddressList] = React.useState([]);

  const [openexpireDialog, setOpenexpireDialog] = React.useState(false);

  // Modal
  const [modalOpen, setModalOpen] = React.useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

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

    if (subscription.length === 0) {
      axios
        .get(GET_SUBSCRIPTION_DETAILS, config)
        .then((response) => {
          setSubscription(response.data.paymentDetails);
          let date = new Date(response.data.paymentDetails.paymentValidity);
          if (!isNaN(date)) {
            console.log(date.toDateString());
          } else {
            console.log("Invalid date format received from the API");
          }
        })
        .catch((err) => {
          console.log(err);
          setOpenexpireDialog(true);
        });
    }
  }, []);

  
  useEffect(() => {
    let token = localStorage.getItem("accessToken");
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    axios
      .get(GET_STATUS_VM, config)
      .then((response) => {
        const newTooltipVmStatus = response.data.status;
        setTooltipVmStatus(newTooltipVmStatus);

        if (newTooltipVmStatus === "running") {
          setVmButtonColor("success");
        } else if (newTooltipVmStatus === "shut off") {
          setVmButtonColor("error");
        } else if (newTooltipVmStatus === "paused") {
          setVmButtonColor("warning");
        }
      })
      .catch((error) => {
        console.error(error);
        // setOpenexpireDialog(true);
      });
  }, []);



  const fetchvmsession = () => {
    let token = localStorage.getItem('accessToken');
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    axios
      .get(VM_SESSION, config)
      .then((response) => {
        if (response.status === 200) {
          const data = response.data.sessionData.map((session) => ({
            ...session,
            loginTime: formatTime(session.loginTime),
            logoutTime: formatTime(session.logoutTime),
          }));
          setSessionData(data);
        } else if (response.status === 401) {
          setSessionExpired(true);
        } else {
          setError('Failed to fetch session data');
        }
      })
      .catch((error) => {
        setError('Failed to fetch session data');
        // setOpenexpireDialog(true);
      });
  };

  useEffect(() => {
    fetchvmsession();
  }, []);

 

  useEffect(() => {
    if (sessionExpired) {
      setOpenDialog(true);
    }
  }, [sessionExpired]);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };



  const fetchNetworkStats = () => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    axios
      .get(NETWORK_STATS, config)
      .then((response) => {
        if (response.status === 200) {
          const networkStatsData = response.data.stats;
          const rxBytes = parseFloat(networkStatsData['rx_bytes']);
          const txBytes = parseFloat(networkStatsData['tx_bytes']);
          const calculatedTotalBytes = rxBytes + txBytes;
          setNetworkStats(networkStatsData);
          setTotalBytes(calculatedTotalBytes);
          setLoading(false);
        } else {
          setNetworkError('Failed to get network stats');
          setLoading(false);
        }
      })
      .catch((error) => {
        setNetworkError(`Error: ${error.message}`);
        setOpenexpireDialog(true);
        setLoading(false);
      });
  };

  const handleNetworkClick = () => {
    fetchNetworkStats();
  };

  let signalComponent;

  const fontSize = "large";

  if (totalBytes >= 4000000) {
    signalComponent = <SignalCellular4BarIcon fontSize={fontSize} />;
  } else if (totalBytes >= 3000000) {
    signalComponent = <SignalCellular3BarIcon fontSize={fontSize} />;
  } else if (totalBytes >= 2000000) {
    signalComponent = <SignalCellular2BarIcon fontSize={fontSize} />;
  } else if (totalBytes >= 1000000) {
    signalComponent = <SignalCellular1BarIcon fontSize={fontSize} />;
  } else {
    signalComponent = <SignalCellular0BarIcon fontSize={fontSize} />;
  }

  const Renewal = () => {
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
        setOpenexpireDialog(true);
      });      
      setTimeout(function () {
        setSnackbarOpen(false);
      }, 5000);
    };



const handleSignIn = () => {
  window.location.href = "/login";
};

const checkout = function () {

  localStorage.setItem("accessToken", "");

  setTimeout(() => {

    window.location.href = "/login";

  }, 100);

};

console.log("openexpireDialog:", openexpireDialog);
  return (
    <div>
      <Header />
      <div className="App LoginBg" >
        <Grid container justifyContent="center">
          <Grid item md={10} >
            <Grid container spacing={3} className="column-layout">
              <Grid item md={4} >
                <div className="overviewBg" >
                  <PhotoCameraBackIcon style={{ fontSize: '70px', position: 'relative', top: '15px' }} />
                  <p style={{ marginLeft: '80px', marginTop: '-35px', fontSize: '18px' }}>Storage Details</p>
                  <span style={{ marginTop: '15px' }}>Comming Soon</span>
                </div>
              </Grid>
              <Grid item md={4}  >
                <div className="overviewBg">
                  <PhotoCameraBackIcon style={{ fontSize: '70px', position: 'relative', top: '15px' }} />
                  <p style={{ marginLeft: '80px', marginTop: '-45px', fontSize: '18px' }}>Network Strength</p>
                  <h2 style={{ marginLeft: '80px', marginTop: '-6px', fontSize: '12px', fontWeight: 600 }}>Network Status</h2>
                  <div style={{ marginLeft: '120px', marginTop: '0px' }}  >
                    {signalComponent}
                  </div>
                  <span className="active" style={{ marginTop: '15px', width: '132px', left: '28%' }} onClick={handleNetworkClick}>
                    Check network status
                  </span>
                </div>
              </Grid>
              <Grid item md={4}>
                <div className="overviewBg" >
                  <PhotoCameraBackIcon style={{ fontSize: '70px', position: 'relative', top: '15px' }} />
                  <p style={{ marginLeft: '80px', marginTop: '-45px', fontSize: '18px' }}>Subscription Details</p>
                  <p style={{ marginLeft: '80px', marginTop: '-2px', fontSize: '10px', fontWeight: 600 }}>Plan Name</p>
                  <p style={{ marginLeft: '80px', marginTop: '-6px', fontSize: '12px', fontWeight: 600 }}>{subscription.planName}</p>
                  <span className="active" style={{ marginTop: '15px' }} onClick={handleModalOpen}>View Details</span>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item md={12}>
              <div className="banner">
                <div style={{ float: 'right', position: 'relative', bottom: '40px', display: 'flex', alignItems: 'center' }}>
                  <Tooltip title={`Virtual Machine  is ${tooltipVmStatus}`} placement="top" arrow>
                    <ComputerIcon sx={{ fontSize: '50px' }} color={vmButtonColor} />
                  </Tooltip>
                  <Typography variant="h6"> <strong>: {tooltipVmStatus === "running" ? "Active" : "Not Active"}{" "}</strong></Typography>
                </div>
                <h1>Your session</h1>
                {sessionData && sessionData.length > 0 ? (
                  <TableContainer style={{ maxHeight: '200px', overflowY: 'auto' }} component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Login Time</strong></TableCell>
                          <TableCell><strong>Logout Time</strong></TableCell>
                          <TableCell><strong>Duration</strong></TableCell>
                          <TableCell><strong>Plan Name</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sessionData.map((session, index) => (
                          <TableRow key={index}>
                            <TableCell>{session.loginTime}</TableCell>
                            <TableCell>{session.logoutTime}</TableCell>
                            <TableCell>{session.duration}</TableCell>
                            <TableCell>{session.planName}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <p>No session data available.</p>
                )}
                {/* <Button variant="outlined" sx={{ backgroundColor: 'white' }} style={{ float: 'right', position: 'relative', top: '10px' }}>View session chart</Button> */}
              </div>
            
            </Grid>
            <Grid item md={4}>
              {/* Content for the third part */}
            </Grid>
          </Grid>
        </Grid>
        <Modal
          open={modalOpen}
          onClose={handleModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Grid container className="catagoryGrid">
              <Grid container item xs={12}  style={{textTransform: 'capitalize'}}>
                <p style={{marginLeft: '0px', marginTop: '15px', fontSize: '24px', width: '100%', fontWeight: 600, color: '#2d9bf0'}}>Subscription Details</p>
                <p style={{marginLeft: '0px', marginTop: '15px', fontSize: '18px', width: '100%'}}><strong>Plan Name:</strong> {subscription.planName}</p>
                <p style={{marginLeft: '0px', marginTop: '15px', fontSize: '18px', width: '100%'}}><strong>Amount:</strong> {subscription.amount}</p>
                <p style={{marginLeft: '0px', marginTop: '15px', fontSize: '18px', width: '100%'}}><strong>Valid Till:</strong> {subscription.paymentValidity}</p>
                <p style={{marginLeft: '0px', marginTop: '15px', fontSize: '18px', width: '100%'}}><strong>Payment Status:</strong> {subscription.paymentStatus}</p>
                <p style={{marginLeft: '0px', marginTop: '15px', fontSize: '18px', width: '100%'}}><strong>Payment ID:</strong> {subscription.paymentId}</p>
                <p style={{marginLeft: '0px', marginTop: '15px', fontSize: '18px', width: '100%'}}><strong>Receipt:</strong> {subscription.receipt}</p>
              </Grid>
            </Grid>
            <Grid item md={2} style={{textAlign: 'right'}}  >
              <Button variant="contained" className="theme" onClick={Renewal}>
                RENEWAL
              </Button>
            </Grid>
          </Box>
        </Modal>
        <CustomSnackbar message={message} variant="success" open={open} />
      </div>
      <Footer />
    <Dialog
    open={openexpireDialog}
    // onClose={() => setOpenexpireDialog(false)}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <div style={{ display: 'flex', flexDirection: 'column', padding: '10px 10px' }}>
      <Button
        style={{
          alignSelf: 'flex-end',
        }}
        variant="contained"
        color="error"
        onClick={() => setOpenexpireDialog(false)}
      >
        <CloseIcon />
      </Button>
      <DialogContent>
        <DialogContentText>
          Session has expired, please sign in again.
        </DialogContentText>
      </DialogContent>
    </div>
    <DialogActions>
      <Button variant="contained" color="success" onClick={handleSignIn}>
        Sign in
      </Button>
      <Button variant="contained" color="error" onClick={checkout}>
        Sign out
      </Button>
    </DialogActions>
  </Dialog>

    </div>
  );
}
