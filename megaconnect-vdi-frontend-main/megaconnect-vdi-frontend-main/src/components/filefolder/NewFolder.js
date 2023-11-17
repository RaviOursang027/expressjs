import React from 'react'
import Button from "@mui/material/Button";
import Grid from '@mui/material/Grid';
import { Modal, TextField } from "@mui/material";
import Box from '@mui/material/Box';
import { useEffect, useState } from "react";
import CustomSnackbar from "../shared/snackbar";
import axios from "axios";

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
  const SERVER_URI = process.env.REACT_APP_SERVER_URI;
  const CREATE_FOLDER = `${SERVER_URI}/create-folder`;
  

export default function NewFolder() {
  const [folderName, setFolderName] = useState(""); // Use meaningful variable names
  const [error, setError] = useState(null);

  const [snackbaropen, setSnackbarOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [variant, setMessageVariant] = React.useState("");

 const handleCreateFolder = async () => {
  try {
    const token = localStorage.getItem('accessToken'); // Get the JWT token

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    setSnackbarOpen(true);

    // Send a POST request to create a folder with the specified name
    const res = await axios.post(CREATE_FOLDER, { folderName }, config);

    if (res.data.message) {
      setMessage(res.data.message);
      setMessageVariant("success");  
      setTimeout(() => {
        window.location.href = "/files";
      }, 2000);
    } else if (res.data.warning) {
      setMessage(res.data.warning);
      setMessageVariant("warning");
    } else if (res.data.message) {
      setMessage("this folder already exists");
      setMessageVariant("error");
    }

    setTimeout(function () {
      setSnackbarOpen(false);
    }, 5000);
  } catch (err) {
    console.error(err);
  }
};

const handleCancel = () => {
  window.location.href="/files"
};
  
  return (
    <>
  <div>
      <h1>New Folder</h1>
      <div>
        <TextField
          style={{ marginTop: "10px" }}
          type="text"
          label="Folder Name" // Use a clear label
          variant="filled"
          size="small"
          fullWidth
          value={folderName} // Bind the input value to state
          onChange={(e) => setFolderName(e.target.value)} // Update the folderName state
        />
        <div style={{ textAlign: 'right', width: "100%" }}>
          <Button
            variant="contained"
            className="theme"
            style={{ marginTop: "15px", marginRight: "15px" }}
            onClick={handleCancel} // Clear the input field on Cancel
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            className="theme"
            style={{ marginTop: "15px" }}
            onClick={handleCreateFolder} // Call the create folder function on Create button click
          >
            Create
          </Button>
          <CustomSnackbar message={message} variant={variant} open={snackbaropen} />
        </div>       

        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message if there's an error */}
      </div>
     
    </div>

    </>
  )
}
