import React from 'react'

import Button from "@mui/material/Button";

import Grid from '@mui/material/Grid';

import { Modal, TextField } from "@mui/material";

import Box from '@mui/material/Box';

import { useEffect, useState } from "react";

import CustomSnackbar from "../shared/snackbar";

import axios from "axios";

import { useParams } from "react-router-dom";

 

 

 

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

  const RENAME = `${SERVER_URI}/renameFile`;

  const FILE_LIST = `${SERVER_URI}/list`;

 

 

  export default function Rename() {

    const [currentName, setCurrentName] = useState('');

    const [newName, setNewName] = useState('');

    const [error, setError] = useState(null);

    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const [message, setMessage] = useState('');

    const [variant, setMessageVariant] = useState('');

 

    const handleRename = async () => {

      try {

        const token = localStorage.getItem('accessToken');

        const requestData = { currentName, newName };

 

        const response = await axios.post(RENAME, requestData, {

          headers: {

            Authorization: `Bearer ${token}`,

          },

        });

 

        if (response.status === 200) {

          setMessage('File renamed successfully');

          setMessageVariant('success');

          setSnackbarOpen(true);

          setCurrentName(newName); // Update the current name to the new name

          setNewName('');

        } else {

          setError('Failed to rename file');

        }

      } catch (error) {

        setError('Failed to rename file');

      }

    };

 

    const handleCancel = () => {

      // Handle the cancel action, for example, navigate back to the fileshome page

      window.location.href = '/files';

    };

    const [selectedFile, setSelectedFile] = useState(null); // State to hold the selected file name

  const [selectedFileNames, setSelectedFiles] = useState([]); // State to hold selected file names

 

  const handleSelectFile = (file) => {

    setSelectedFile(file);

  };

  useEffect(() => {

    const fetchDataFromAPI = async () => {

      let token = localStorage.getItem('accessToken');

      let config = {

        headers: { Authorization: `Bearer ${token}` },

      };

 

      try {

        const response = await axios.get(FILE_LIST, config); // Replace with the correct API URL

        if (response.status === 200) {

          const responseData = response.data;

          console.log(responseData);

 

          const fileData = responseData.files.map((file) => {

            const filename = file.fileName;

            console.log("file:", filename);

            setSelectedFiles((prevSelectedFiles) => [...prevSelectedFiles, filename]); // Update selectedFiles

            return {

              filename: filename,

            };

          });

        } else {

          console.error('Failed to fetch data from the API');

        }

      } catch (error) {

        console.error('Error fetching data from API:', error);

      }

    };

 

    fetchDataFromAPI();

  }, []);

   

   

 

 

 

    return (

      <div>

        <h1>RENAME</h1>

        <TextField

          style={{ marginTop: '10px' }}

          type="text"

          label="Current Name"

          variant="filled"

          size="small"

          fullWidth

          value={selectedFileNames}

          // onChange={(e) => setCurrentName(e.target.value)}

        />

        <TextField

          style={{ marginTop: '10px' }}

          type="text"

          label="New Name"

          variant="filled"

          size="small"

          fullWidth

          value={newName}

          onChange={(e) => setNewName(e.target.value)}

        />

        <div style={{ textAlign: 'right', width: '100%' }}>

          <Button

            variant="contained"

            className="theme"

            style={{ marginTop: '15px', marginRight: '15px' }}

            onClick={handleCancel}

          >

            Cancel

          </Button>

          <Button

            variant="contained"

            className="theme"

            style={{ marginTop: '15px' }}

            onClick={handleRename}

          >

            Rename

          </Button>

          <CustomSnackbar message={message} variant={variant} open={snackbarOpen} />

        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

      </div>

    );

  }

 