import * as React from "react";
import { useEffect } from "react";
import axios from "axios";
import CustomSnackbar from "./shared/snackbar";
import Button from "@mui/material/Button";
import Grid from '@mui/material/Grid';
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';
import Header from "./shared/header.js";
import Footer from "./shared/footer.js";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

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

export default function Home() {
  const SERVER_URI = process.env.REACT_APP_SERVER_URI;
  const GET_SUBSCRIPTION_DETAILS = `${SERVER_URI}/userSubscriptionDetails`;
  const [subscription, setSubscription] = React.useState([]);

 
  React.useEffect(() => {
    if (
      localStorage.getItem("accessToken") == "" ||
      localStorage.getItem("accessToken") == undefined
    ) {     
      window.location.href = "/login";
    }
  });

  React.useEffect(() => {
    let token = localStorage.getItem("accessToken");
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    if (subscription.length == 0) {
      // GET_SUBSCRIPTION_DETAILS
      axios
      .get(GET_SUBSCRIPTION_DETAILS, config)
      .then((response) => {
        setSubscription(response.data.paymentDetails);
        console.log(subscription.length)
        if(response.data.paymentDetails.planName == undefined){          
          window.location.href = "/packages";
        }
        else {     
          window.location.href = "/overview";
        }
        
      })
      .catch((err) => {
        console.log(err);
      });
    }
  });

  return (
    <div>
      
    </div>
  );
}

// export default function Home();
