import * as React from 'react';

import { useState, useEffect } from 'react';

import Paper from '@mui/material/Paper';

import Table from '@mui/material/Table';

import TableBody from '@mui/material/TableBody';

import TableCell from '@mui/material/TableCell';

import FileOpenOutlinedIcon from '@mui/icons-material/FileOpenOutlined';

import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

import TableContainer from '@mui/material/TableContainer';

import TableHead from '@mui/material/TableHead';

import TablePagination from '@mui/material/TablePagination';

import StarIcon from '@mui/icons-material/Star';

import TableRow from '@mui/material/TableRow';

import { Typography, Divider, Grid } from '@mui/material';

import AddCircleIcon from "@mui/icons-material/AddCircle";

import DownloadIcon from '@mui/icons-material/Download';

import Button from "@mui/material/Button";

import { useNavigate } from 'react-router-dom';

import Box from "@mui/material/Box";

import { Chip, Avatar } from '@mui/material';

import Stack from "@mui/material/Stack";

import axios from 'axios';

import DeleteIcon from "@mui/icons-material/Delete";

import Swal from "sweetalert2";

import TextField from "@mui/material/TextField";

import Autocomplete from "@mui/material/Autocomplete";

import Modal from '@mui/material/Modal';

import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';

import Sidenav from '../files/Sidenav';

import Navbar from '../files/Navbar';

import MenuItem from '@mui/material/MenuItem';

import Menu from '@mui/material/Menu';

import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';

import UploadFileIcon from '@mui/icons-material/UploadFile';

import NewFolder from './NewFolder';

import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'; // Default icon for unknown file types

import ImageIcon from '@mui/icons-material/Image';

import Checkbox from '@mui/material/Checkbox';

import DescriptionIcon from '@mui/icons-material/Description';

import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';

import CustomSnackbar from "../shared/snackbar";

import Dialog from "@mui/material/Dialog";

import DialogActions from "@mui/material/DialogActions";

import DialogContent from "@mui/material/DialogContent";

import DialogContentText from "@mui/material/DialogContentText";

import CloseIcon from '@mui/icons-material/Close';

import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

// import ContextMenu from './ContextMenu';

import '../../assets/css/styles.css'

import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';

// import WordIcon from '../../assets/images/word.png'; // Import your Word icon PNG

// import ExcelIcon from '../../assets/images/excel1.png'; // Import your Excel icon PNG

// import PdfIcon from '../../assets/images/pdf3.png';

// import FolderIcon from '../../assets/images/folder3.png';

// import mp4Icon from '../../assets/images/mp4.png'

// import jpgIcon from '../../assets/images/jpg.png'

// import pngIcon from '../../assets/images/png2.png'

// import defaultIcon from '../../assets/images/deafault.png'

// import zipIcon from '../../assets/images/zip1.png'

// import TextIcon from '../../assets/images/default.png'/

// import jsonIcon from '../../assets/images/json.png'

import RefreshIcon from "@mui/icons-material/Refresh";

import SortIcon from "@mui/icons-material/Sort";

import ListIcon from "@mui/icons-material/List";

import InfoIcon from "@mui/icons-material/Info";

import ViewListIcon from "@mui/icons-material/ViewList";

import ViewModuleIcon from "@mui/icons-material/ViewModule";

import ViewComfyIcon from "@mui/icons-material/ViewComfy";

import IconButton from '@mui/material/IconButton';

import Tooltip from '@mui/material/Tooltip';

import Rename from './Rename';

import StarBorderIcon from '@mui/icons-material/StarBorder';

 

 

 

 

 

 

const style = {

  position: 'absolute',

  top: '50%',

  left: '50%',

  transform: 'translate(-50%, -50%)',

  width: 400,

  bgcolor: 'background.paper',

  border: '2px solid #000',

  boxShadow: 24,

  p: 4,

};

const imageStyle = {

  maxWidth: '32px',  // Set a maximum width for the image

  maxHeight: '32px', // Set a maximum height for the image

};

const monthNames = [

  'January', 'February', 'March', 'April',

  'May', 'June', 'July', 'August',

  'September', 'October', 'November', 'December'

];

// const fileIconMapping = {

//   pdf:<img src={PdfIcon} alt="Word" style={imageStyle} /> , // Example: PDF files

//   doc:<img src={WordIcon} alt="Word" style={imageStyle} />, // Example: Word documents

//   docx:<img src={WordIcon} alt="Word" style={imageStyle} />, // Example: Word documents

//   jpg: <img src={jpgIcon} alt="Word" style={imageStyle}/>, // Example: JPEG images

//   jpeg: <img src={pngIcon} alt="Word" style={imageStyle}/>, // Example: JPEG images

//   png: <img src={pngIcon} alt="Word" style={imageStyle}/>, // Example: PNG images

//   mp4:<img src={mp4Icon} alt="Word" style={imageStyle} />, // Example: MP4 videos

//   txt:<img src={TextIcon} alt="Word" style={imageStyle} />,

//   zip:<img src={zipIcon} alt="Word" style={imageStyle} />,

//   folders:<img src={FolderIcon} alt="Word" style={imageStyle} />,

//   json:<img src={jsonIcon} alt="Word" style={imageStyle} />,

//   // Add more file extensions and icons as needed

//   default:<img src={defaultIcon} alt="Word" style={imageStyle} />

// };

 

export default function FileList() {

  const SERVER_URI = process.env.REACT_APP_SERVER_URI;

  const UPLOAD_FILE = `${SERVER_URI}/upload-file`;

  const FILE_LIST = `${SERVER_URI}/list`;

  const DELETE_FILE = `${SERVER_URI}/multipe-file-delete`;

  const DOWNLOAD_FILE = `${SERVER_URI}/download-multiple-files`;

 

  // const [selectedFile, setSelectedFile] = useState(null);

  const [filename, setFileName] = React.useState();

  const [selectedFileName, setSelectedFileName] = useState('');

  const [selectedFiles, setSelectedFiles] = useState([]);

  // const [selectedFiles, setSelectedFiles] = useState([]);

 

  const [page, setPage] = useState(0);

  const [isHovered, setIsHovered] = useState({});

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [selectedFolder, setSelectedFolder] = useState(null);

 

  const [error, setError] = React.useState(null);

  const [openexpireDialog, setOpenexpireDialog] = React.useState(false);

 

  const navigate = useNavigate();

  const [rows, setRows] = useState([]);

  const [open, setOpen] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const sopen = Boolean(anchorEl);

  const [snackbaropen, setSnackbarOpen] = React.useState(false);

  const [message, setMessage] = React.useState("");

  const [searchQuery, setSearchQuery] = useState('');

  const [selectedRows, setSelectedRows] = useState([]);

  const [contextMenuOpen, setContextMenuOpen] = useState(false);

  const [contextMenuPosition, setContextMenuPosition] = useState({ top: 0, left: 0 });

  const [selectedFileForContextMenu, setSelectedFileForContextMenu] = useState(null);

 

 

 

  React.useEffect(() => {

    if (

      localStorage.getItem("accessToken") === "" ||

      localStorage.getItem("accessToken") === undefined

    ) {

      setMessage("User not logged in");

      setSnackbarOpen(true);

      setTimeout(() => {

        window.location.href = "/login";

        setSnackbarOpen(false);

      }, 100);

    }

  }, []);  

  const [selectedFilter, setSelectedFilter] = React.useState('all');

 

  const handleFilterChange = (filter) => {

      setSelectedFilter(filter);

     

  };

 

  const [filteredRows, setFilteredRows] = useState([]);

 

  const getFileExtension = (filename) => {

    // Check if filename is defined and not null

    if (filename) {

      const parts = filename.split('.');

      // return parts.length > 1 ? parts.pop().toLowerCase() : 'default';

    }

    // Return a default extension or handle the case where filename is undefined or null

    return 'unknown';

  };

 

 

  const handleClick = (event) => {

    setAnchorEl(event.currentTarget);

  };

 

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

 

  const handleClosefile = () => {

    setAnchorEl(null);

  };

 

  const handleChangePage = (event, newPage) => {

    setPage(newPage);

  };

 

  const handleChangeRowsPerPage = (event) => {

    setRowsPerPage(+event.target.value);

    setPage(0);

  };

 

  const deleteUser = (fileName) => {

    Swal.fire({

      title: "Are you sure?",

      text: "You won't be able to revert this!",

      icon: "warning",

      showCancelButton: true,

      confirmButtonColor: "#3085d6",

      cancelButtonColor: "#d33",

      confirmButtonText: "Yes, delete it!",

    }).then((result) => {

      if (result.value) {

        deleteApi(fileName);

      }

    });

  };

 

  const filterData = (query) => {

    setSearchQuery(query);

    if (typeof query === 'string') {

      const filteredFiles = rows.filter((files) =>

        files.filename && typeof files.filename === 'string' &&

        files.filename.toLowerCase().includes(query.toLowerCase())

      );

      setFilteredRows(filteredFiles);

    } else {

      // If the query is empty, reset the filtered data to show all files

      setFilteredRows(rows);

    }

  };

 

 

  const handleOpenFile = () => {

    document.getElementById('fileInput').click();

  };

 

  const handleFolderChange = (event) => {

    const files = event.target.files;

    setSelectedFiles(Array.from(files)); // Convert to an array

    const fileNames = Array.from(files).map((file) => file.name);

    setSelectedFileName(fileNames.join(', '));

  };

 

 

    const handleFolderUpload = async () => {

      if (!selectedFiles || selectedFiles.length === 0) {

        alert('Please select one or more files before uploading.');

        return;

      }

      let token = localStorage.getItem('accessToken');

      let config = {

        headers: { Authorization: `Bearer ${token}` },

      };

   

      // Create an array to store the responses

      // const responses = [];

   

      for (const file of selectedFiles) {

        const formData = new FormData();

        formData.append('file', file);

   

        try {

          const response = await axios.post(UPLOAD_FILE, formData, config);

          console.log("uploaded files:", UPLOAD_FILE)

          // responses.push(response); // Store each response in the array

   

          if (response.data.message === 'File uploaded') {

            console.log(response.data.fileName);

            setFileName(response.data.fileName);

            Swal.fire('Error', response.data.message, 'error');

          } else {

            Swal.fire('Success', 'File uploaded successfully', 'success');

          }

        } catch (error) {

          console.error('Error:', error);

          Swal.fire('Error', error.response.data.message, 'error');

          if (error.response && error.response.status === 401) {    

            // Token is expired or invalid, open the dialog      

            setOpenexpireDialog(true);    

           }

        }

      }

      }

 

  // const handleFileChange = (event) => {

 

  //   setSelectedFile(event.target.files[0]);

  //   console.log(selectedFile)

 

  // };

 

  const clearSelectedFiles = () => {

    setSelectedFiles([]);

    setSelectedFileName('');

  };

  const handleFileUpload = async () => {

    if (!selectedFiles || selectedFiles.length === 0) {

      alert('Please select one or more files before uploading.');

      return;

    }

    let token = localStorage.getItem('accessToken');

    let config = {

      headers: { Authorization: `Bearer ${token}` },

    };

 

    // Create a FormData object to hold all selected files

    const formData = new FormData();

    selectedFiles.forEach((file) => {

      formData.append('file', file);

    });

 

    try {

      const response = await axios.post(UPLOAD_FILE, formData, config);

      console.log("uploaded files:", UPLOAD_FILE);

 

      if (response.data.message === 'File uploaded') {

        console.log(response.data.fileName);

        setFileName(response.data.fileName);

       

        Swal.fire('Error', response.data.message, 'error');

      } else {

       

        Swal.fire('Success', ' files uploaded successfully', 'success');

        // updateFileList()

        fetchDataFromAPI()

        clearSelectedFiles()

      }

    } catch (error) {

      console.error('Error:', error);

      Swal.fire('Error', error.response.data.message, 'error');

      if (error.response && error.response.status === 401) {    

        // Token is expired or invalid, open the dialog      

        setOpenexpireDialog(true);    

       }

    }

  };

 

  const handleFileChange = (event) => {

    const files = event.target.files;

    const newSelectedFiles = [...selectedFiles];

    for (let i = 0; i < files.length; i++) {

      newSelectedFiles.push(files[i]); // Add each selected file to the copy

    }

    setSelectedFiles(newSelectedFiles); // Update the state with the new array

    setSelectedFileName(newSelectedFiles.map((file) => file.name).join(', '));

   

  };

 

 

  // const deleteApi = async (fileName) => {

  //   try {

  //     const token = localStorage.getItem('accessToken');

  //     const config = {

  //       headers: { Authorization: `Bearer ${token}` },

  //     };

 

  //     const response = await axios.delete(DELETE_FILE + fileName, config);

  //     if (response.data.message === 'File deleted') {

  //       setRows((prevRows) => prevRows.filter((files) => files.filename !== fileName));

  //       selectedRows.forEach((fileName) => {

  //         deleteApi(fileName);

  //       });

  //       setSelectedRows([]);

  //       Swal.fire('Success', response.data.message, 'success');

  //     } else {

  //       Swal.fire('Error', response.data.message, 'error');

  //     }

  //   } catch (error) {

  //     console.error("Error deleting file:", error);

  //     Swal.fire("Error", "An error occurred while deleting the file", "error");

  //     if (error.response && error.response.status === 401) {    

  //       // Token is expired or invalid, open the dialog      

  //       setOpenexpireDialog(true);    

  //      }

  //   }

  // };

  const deleteApi = async (filesToDelete) => {

    try {

      const token = localStorage.getItem('accessToken');

      const headers = {

        Authorization: `Bearer ${token}`,

      };

      const response = await axios.delete(DELETE_FILE, {

        headers,

        data: {

          files: filesToDelete,

        },

      });

      if (response.status === 200 && response.data) {

        const { message, deletedFiles } = response.data;

        console.log(message); // Message: "2 files deleted successfully."

        console.log(deletedFiles); // List of deleted files

        Swal.fire({

          icon: 'success',

          title: 'Success',

          text: message,

        });

        setTimeout(() => {

          window.location.reload();

        }, 3000);

      } else {

        console.error('Failed to delete files.');

        Swal.fire({

          icon: 'error',

          title: 'Error',

          text: response.data.message,

        });

      }

    } catch (error) {

      console.error('Error deleting files:', error);

      if (error.response && error.response.status === 401) {    

              // Token is expired or invalid, open the dialog      

              setOpenexpireDialog(true);    

             }

      Swal.fire({

        icon: 'error',

        title: 'Error',

        text: 'An error occurred while deleting files.',

      });

    }

  };

 

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

          const modifiedDate = new Date(file.modifiedDate);

          const formattedDate = `${modifiedDate.getDate()}-${monthNames[modifiedDate.getMonth()]}-${modifiedDate.getFullYear()}`;

 

          return {

            filename: file.fileName, // Correctly extract the filename from the API response

            modifiedDate: formattedDate,

            size: file.size,

          };

        });

     

        setRows(fileData);

      } else {

        console.error('Failed to fetch data from the API');

      }

    } catch (error) {

      console.error('Error fetching data from API:', error);

      if (error.response && error.response.status === 401) {    

        // Token is expired or invalid, open the dialog      

        setOpenexpireDialog(true);    

       }

    }

  };

 

 

  useEffect(() => {

    fetchDataFromAPI();  

  },[]);

 

  // const downloadFile = (fileName) => {

  //   let token = localStorage.getItem('accessToken');

  //   let config = {

  //     headers: {

  //       Authorization: `Bearer ${token}`,

  //     },

  //     responseType: 'blob',

  //   };

 

  //   axios

  //     .get(DOWNLOAD_FILE + fileName , config)

  //     .then((response) => {

  //       const blob = new Blob([response.data], { type: response.headers['content-type'] });

  //       const url = window.URL.createObjectURL(blob);

 

  //       const a = document.createElement('a');

  //       a.href = url;

  //       a.download = fileName;

 

  //       a.click();

 

  //       window.URL.revokeObjectURL(url);

  //     })

  //     .catch((error) => {

  //       console.error('Error downloading file:', error);

  //       Swal.fire('Error', 'Failed to download file', 'error');

  //       if (error.response && error.response.status === 401) {    

  //         // Token is expired or invalid, open the dialog      

  //         setOpenexpireDialog(true);    

  //        }

  //     });

  // };

  //  Multiple files download

 

  const downloadFile = async () => {

    if (selectedFiles.length === 0) {

      return; // No files selected, do nothing

    }

 

    try {

      const token = localStorage.getItem('accessToken');

 

      // Make a POST request to the server to get download links

      const response = await axios.post(DOWNLOAD_FILE, { files: selectedFiles }, {

        headers: {

          Authorization: `Bearer ${token}`,

        },

      });

 

      if (response.data && Array.isArray(response.data) && response.data.length > 0) {

        const fileLink = response.data[0]; // Get the first file link

 

        const fileName = fileLink.split('/').pop();

        const blob = new Blob([fileLink], { type: response.headers['content-type'] });

 

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');

        a.href = url;

        a.download = fileName;

        a.style.display = 'none';

 

        document.body.appendChild(a);

        a.click();

 

        document.body.removeChild(a);

      } else {

        console.error('Invalid response from the server');

      }

    } catch (error) {

      console.error('Error downloading files:', error);

      Swal.fire('Error', 'Failed to download files', 'error');

      if (error.response && error.response.status === 401) {

        // Token is expired or invalid, handle accordingly

        setOpenexpireDialog(true);

      }

    }

  };

 

 

 

 

// Call the downloadMultipleFiles function when needed, e.g., on a button click

// downloadMultipleFiles();

 

 

const [isSelectAll, setIsSelectAll] = useState(false);

  const handleSearch = (e) => {

    const query = e.target.value; // Get the input value

 

    if (typeof query === 'string') {

      // Convert the query to lowercase for case-insensitive search

      const lowerCaseQuery = query.toLowerCase();

 

      // Filter the rows based on the search query

      const filteredRows = rows.filter((file) =>

        file.filename.toLowerCase().includes(lowerCaseQuery)

      );

 

      setFilteredRows(filteredRows);

    }

  };

  const handleSelectAllClick = (event) => {

    const checked = event.target.checked;

 

    if (checked) {

      // Select all files

      setSelectedFiles(rows.map((file) => file.filename));

    } else {

      // Deselect all files

      setSelectedFiles([]);

    }

 

    setIsSelectAll(checked);

  };

  // const handleRowSelect = (event, filename) => {

  //   if (event.target.checked) {

  //     setSelectedRows([...selectedRows, filename]);

  //   } else {

  //     setSelectedRows(selectedRows.filter((row) => row !== filename));

  //   }

  // };

  const handleRowSelect = (event, fileName) => {

    const checked = event.target.checked;

 

    if (checked) {

      // Add the filename to the selectedFiles array

      setSelectedFiles((prevSelectedFiles) => [...prevSelectedFiles, fileName]);

    } else {

      // Remove the filename from the selectedFiles array

      setSelectedFiles((prevSelectedFiles) =>

        prevSelectedFiles.filter((file) => file !== fileName)

      );

    }

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

 

const handleDeleteSelected = () => {

  if (selectedFiles.length === 0) {

    return; // No files selected, do nothing

  }

 

  // Call the deleteMultipleFiles function with selectedFiles

  deleteApi(selectedFiles);

};

 

const handleRefresh = () => {

  window.location.reload();

};

const [sortAnchorEl, setSortAnchorEl] = useState(null);

const [sortMenuOpen, setSortMenuOpen] = useState(false);

 

// For list views menu

const [viewAnchorEl, setViewAnchorEl] = useState(null);

const [viewMenuOpen, setViewMenuOpen] = useState(false);

const [selectedView, setSelectedView] = useState("list"); // Default view

 

const handleSortMenuOpen = (event) => {

  setSortAnchorEl(event.currentTarget);

  setSortMenuOpen(true);

};

 

const handleSortMenuClose = () => {

  setSortAnchorEl(null);

  setSortMenuOpen(false);

};

 

const handleViewMenuOpen = (event) => {

  setViewAnchorEl(event.currentTarget);

  setViewMenuOpen(true);

};

 

const handleViewMenuClose = () => {

  setViewAnchorEl(null);

  setViewMenuOpen(false);

};

 

const handleViewChange = (view) => {

  setSelectedView(view);

  handleViewMenuClose();

};

 

const handleFileInfo=()=>{

 

}

const [menuAnchor, setMenuAnchor] = useState(null);

 

const handleContextMenuOpen = (event) => {

  setMenuAnchor(event.currentTarget);

};

 

const handleContextMenuClose = (event) => {

  setMenuAnchor(null);

 

};

 

const [isRenameModalOpen, setRenameModalOpen] = useState(false);

 

const openRenameModal = () => {

  setRenameModalOpen(true);

  handleContextMenuClose();

};

 

const closeModal = () => {

  setRenameModalOpen(false);

};

 

const [isSelected, setIsSelected] = useState(false);

 

const handleFavoritesToggle = () => {

  setIsSelected(!isSelected);

};

const [hoveredRow, setHoveredRow] = useState(null);

 

const handleRowMouseEnter = (fileId) => {

  setHoveredRow(fileId);

};

 

const handleRowMouseLeave = () => {

  setHoveredRow(null);

};

 

  return (

    <>

      <div className='bgcolor'>

        <Navbar />

        <div>

          <Sidenav />          

          <br /><br />

          <Grid item xs={8}>

          <Typography gutterBottom variant="body2" component="div" sx={{ color: "black", fontSize:"20px", position:"relative", bottom:"10px" }}>

            <strong>My Files</strong>

          </Typography>

          </Grid>          

          <Modal

            open={open}

            onClose={handleClose}

            aria-labelledby="modal-modal-title"

            aria-describedby="modal-modal-description"

          >

            <Box sx={style}>

              <NewFolder />

            </Box>

          </Modal>

        </div>

       

        {/* <Box  sx={{ display: "flex", alignItems: "center", position:"absolute", left:"502px", top:"152px" }}> */}

  <Grid item xs={8} sm={12}>

  <Stack spacing={2} direction='row'>  

      <Chip

          label="All"

          variant={selectedFilter === 'all' ? 'filled' : 'outlined'}

          onClick={() => handleFilterChange('all')}

          sx={{

              width: '150px',

              height: '40px',

              border: '2px solid transparent',

              transition: 'border 0.3s ease-in-out',

              border: '2px solid grey',

              '&:hover': {

                  border: '2px solid black',

              },

              '&:active': {

                  border: '2px solid black',

              },

          }}

      />

 

      <Chip

          label="Folders"

          variant={selectedFilter === 'folders' ? 'filled' : 'outlined'}

          onClick={() => handleFilterChange('folders')}

          // icon={<Avatar alt="" src={FolderIcon} />}

          sx={{

              width: '150px',

              height: '40px',

              border: '2px solid transparent',

              transition: 'border 0.3s ease-in-out',

              border: '2px solid grey',

              '&:hover': {

                  border: '2px solid black',

              },

              '&:active': {

                  border: '2px solid black',

              },

          }}

      />

      <Chip

          label="Word"

          variant={selectedFilter === 'word' ? 'filled' : 'outlined'}

          onClick={() => handleFilterChange('word')}

          // icon={<Avatar alt="" src={WordIcon} />}

          sx={{

              width: '150px',

              height: '40px',

              border: '2px solid transparent',

              transition: 'border 0.3s ease-in-out',

              border: '2px solid grey',

              '&:hover': {

                  border: '2px solid black',

              },

              '&:active': {

                  border: '2px solid black',

              },

          }}

      />

      <Chip

          label="PDF"

          variant={selectedFilter === 'pdf' ? 'filled' : 'outlined'}

          onClick={() => handleFilterChange('pdf')}

          // icon={<Avatar alt="PDF Icon" src={PdfIcon} />}

          sx={{

              width: '150px',

              height: '40px',

              border: '2px solid transparent',

              transition: 'border 0.3s ease-in-out',

              border: '2px solid grey',

              '&:hover': {

                  border: '2px solid black',

              },

              '&:active': {

                  border: '2px solid black',

              },

          }}

      />

      <Chip

          label="Excel"

          variant={selectedFilter === 'excel' ? 'filled' : 'outlined'}

          onClick={() => handleFilterChange('excel')}

          // icon={<Avatar alt="" src={ExcelIcon} />}

          sx={{

              width: '150px',

              height: '40px',

              border: '2px solid transparent',

              transition: 'border 0.3s ease-in-out',

              border: '2px solid grey',

              '&:hover': {

                  border: '2px solid black',

              },

              '&:active': {

                  border: '2px solid black',

              },

          }}

      />

  </Stack>

 

                           

                        </Grid>

      <Grid container spacing={2}  sx={{paddingLeft:"1000px"}}> {/* Add spacing as needed */}

      <Grid item xs={4} sm={8} md={12}>

        <IconButton onClick={handleRefresh} color="primary">

          <RefreshIcon />

          <Typography>Refresh</Typography>

        </IconButton>

     

     

        <Tooltip title="Sort">

          <IconButton onClick={handleSortMenuOpen} color="primary">

            <SortIcon />

          </IconButton>

        </Tooltip>

     

      <Menu

        anchorEl={sortAnchorEl}

        open={sortMenuOpen}

        onClose={handleSortMenuClose}

        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}

        transformOrigin={{ vertical: "top", horizontal: "right" }}

      >

        <MenuItem onClick={handleSortMenuClose}>File Type</MenuItem>

        <MenuItem onClick={handleSortMenuClose}>Name</MenuItem>

        <MenuItem onClick={handleSortMenuClose}>Modified</MenuItem>

        <MenuItem onClick={handleSortMenuClose}>File Size</MenuItem>

      </Menu>

     

      <Tooltip title="List views">

      <IconButton onClick={handleViewMenuOpen} color="primary">

        {selectedView === "list" && <ViewListIcon />}

        {selectedView === "compactList" && <ViewComfyIcon />}

        {selectedView === "tiles" && <ViewModuleIcon />}

      </IconButton>

      </Tooltip>

       <Menu

        anchorEl={viewAnchorEl}

        open={viewMenuOpen}

        onClose={handleViewMenuOpen}

        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}

        transformOrigin={{ vertical: "top", horizontal: "right" }}

      >

        <MenuItem onClick={() => handleViewChange("list")}><ViewListIcon /> List</MenuItem>

        <MenuItem onClick={() => handleViewChange("compactList")}><ViewComfyIcon /> Compact List</MenuItem>

        <MenuItem onClick={() => handleViewChange("tiles")}><ViewModuleIcon /> Tiles </MenuItem>

      </Menu>

       

     

<Tooltip title="Info">

      <IconButton onClick={handleFileInfo} color="primary">

        <InfoIcon />

      </IconButton>

      </Tooltip>

      </Grid>

    </Grid>

      {/* </Box> */}

          <Paper

           sx={{

            width: '98%',

            overflow: 'hidden',

            padding: "10px",

            position: "relative",

            bottom:"1px",

            borderRadius: '20px'

          }}>

            <Typography

              gutterBottom

              variant="h5"

              component="div"

              sx={{ padding: "20px" }}

            >

              <strong>Upload List</strong>

            </Typography>

            <Divider />

            <Box height={10}  />

            <Stack direction="row" spacing={2} className="my-2 mb-2">

            <Autocomplete

              disablePortal

              id="combo-box-demo"

              options={rows}

              sx={{ width: 300}}

              // onChange={(e, v) => filterData(v)}

              getOptionLabel={(rows) => rows.filename || ""}

              renderInput={(params) => (

                // <TextField {...params} size="small" label="Search Files" />

                <TextField {...params} size="small" label="Search Files" variant="filled"/>

              )}

            />

            <div>          

            <Typography

              variant="h6"

              component="div"

              sx={{ flexGrow: 1 }}

            ></Typography>

            <input

              type="file"

              id="fileInput"

              style={{ display: 'none' }}

              onChange={handleFileChange}

              multiple

            />

             

            <Button

            className="filesButton"

              sx={{                              

               position:"absolute",

               top:"45px",

               right:"225px"

               

              }}

              variant="contained"

              endIcon={<AddCircleIcon />}

              id="basic-button"

              aria-controls={open ? 'basic-menu' : undefined}

              aria-haspopup="true"

              aria-expanded={open ? 'true' : undefined}

              onClick={handleClick}

            >

              Add

            </Button>

            <Typography variant="body1" component="div" sx={{ padding: "3px 196px",position:"relative"}}>

              {selectedFileName}

             </Typography>

             <Button variant="contained" className="filesButton"  endIcon={<DriveFolderUploadIcon />} onClick={handleFileUpload}

                sx={{position:"absolute",top:"45px",right:"94px"}}>

                Upload

              </Button>

            <Menu

              id="basic-menu"

              anchorEl={anchorEl}

              open={sopen}

              onClose={handleClosefile}

              PaperProps={{

                elevation: 0,

             

                sx: {

                  overflow: 'visible',

                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',

                  mt: 1.5,

                  '& .MuiAvatar-root': {

                    width: 32,

                    height: 32,

                    ml: -0.5,

                    mr: 1,

                  },

                  '&:before': {

                    content: '""',

                    display: 'block',

                    position: 'absolute',

                    top: 0,

                    right: 14,

                    width: 10,

                    height: 10,

                    bgcolor: 'background.paper',

                    transform: 'translateY(-50%) rotate(45deg)',

                    zIndex: 0,

                  },

                },

              }}

              transformOrigin={{ horizontal: 'right', vertical: 'top' }}

              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}

              MenuListProps={{

                'aria-labelledby': 'basic-button',

              }}

            >

              <MenuItem onClick={handleOpen}>

                <CreateNewFolderIcon />New Folder

              </MenuItem>

              <Divider />

              <MenuItem onClick={() => document.getElementById('fileInput').click()}>

                <UploadFileIcon />File upload

              </MenuItem>

              <input

                type="file"

                id="folderInput"

                webkitdirectory="true"

                directory

                multiple

                style={{ display: 'none' }}

                onChange={handleFileChange}

              />

              <MenuItem onClick={() => document.getElementById('folderInput').click()}>

                <DriveFolderUploadIcon />Folder upload

              </MenuItem>

            </Menu>

       

              <Typography

                variant="h6"

                component="div"

                sx={{ flexGrow: 1 }}

              ></Typography>

             

              </div>

            </Stack>

           

    <Box height={10} />

    <TableContainer sx={{ maxHeight: 440, borderRadius: '20px' }}>

      <Table stickyHeader aria-label="sticky table">

        <TableHead>      

          <TableRow>

          <TableCell align="left" style={{ minWidth: "100px" }}>

          <Tooltip title="Select All">

          <Checkbox

            checked={isSelectAll}

            onChange={handleSelectAllClick}

          />

        </Tooltip>

            <strong>Name</strong>

          </TableCell>

                <TableCell align="left" style={{ minWidth: "100px" }}>

                  <strong>Last Modified</strong>

                </TableCell>

                <TableCell align="left" style={{ minWidth: "100px" }}>

                  <strong>File Size</strong>

                </TableCell>

                <TableCell align="left" style={{ minWidth: "100px" }}>

                <Button

              variant="contained"

              color="primary"

              style={{ marginRight: "10px" }}

              onClick={downloadFile}

              disabled={selectedFiles.length === 0}

            >

              <CloudDownloadIcon /> {/* Icon for Download Selected */}

            </Button>

            <Button

              variant="contained"

              color="secondary"

              onClick={handleDeleteSelected}

              disabled={selectedFiles.length === 0}

            >

              <DeleteIcon /> {/* Icon for Delete Selected */}

            </Button>

                </TableCell>

              </TableRow>

            </TableHead>

            <TableBody>

 

          {rows.length > 0 || filteredRows.length > 0 ? (

          rows

          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

          .map((file) => (

            <TableRow

            hover

            role="checkbox"

            tabIndex={-1}

            key={file.filename}

            // onContextMenu={(event) => handleContextMenuOpen(event, file)}

            onMouseEnter={() => handleRowMouseEnter(file.filename)}

            onMouseLeave={handleRowMouseLeave}

           

            >

 

              <TableCell align="left" style={{ padding: '8px' }} >

              <Checkbox

                      checked={selectedFiles.includes(file.filename)}

                      onChange={(event) => handleRowSelect(event, file.filename)}

                    />

               {fileIconMapping[getFileExtension(file.filename)] || <InsertDriveFileIcon/>}

               

                {file.filename}

               

                {hoveredRow === file.filename && (

              <div>

                <IconButton

                  style={{

                    position: 'relative',

                    top: '45%',

                    left: '65%',

                    transform: 'translate(-50%, -50%)',

                  }}

                  onClick={handleContextMenuOpen}

                >

                  <MoreHorizOutlinedIcon />

                </IconButton>

                <IconButton

                  style={{

                    position: 'relative',

                    top: '45%',

                    left: '65%',

                    transform: 'translate(-50%, -50%)',

                  }}

                  onClick={handleFavoritesToggle}

                >

                  {isSelected ? <StarIcon /> : <StarBorderIcon />}

                </IconButton>

             

                   

                <Menu

                  anchorEl={menuAnchor}

                  open={Boolean(menuAnchor)}

                  onClose={handleContextMenuClose}

                >

                  <MenuItem>

                    <FileOpenOutlinedIcon />Open

                  </MenuItem>

                  <MenuItem>

                    <FileDownloadOutlinedIcon />Download

                  </MenuItem>

                  <MenuItem onClick={openRenameModal}>

                    <DriveFileRenameOutlineOutlinedIcon />Rename

                  </MenuItem>

                  <MenuItem>

                    <FileDownloadOutlinedIcon />

                    <DeleteOutlineOutlinedIcon />Delete

                  </MenuItem>

                  {/* Add more menu items as needed */}

                </Menu>

                </div>

                )}

              </TableCell>

         

     

 

 

           

              <TableCell align="left">{file.modifiedDate}</TableCell>

              <TableCell align="left">{file.size}</TableCell>

              <TableCell align="left">

 

</TableCell>

 

            </TableRow>

           

          ))

          ) : (

            <TableRow>

              <TableCell colSpan={4} align="center">

                No data available

              </TableCell>

            </TableRow>

          )}

        </TableBody>

       

      </Table>

    </TableContainer>

            <TablePagination

              className='tablepagenition'

              rowsPerPageOptions={[5,25,100]}

              component="div"

              count={rows.length}

              rowsPerPage={rowsPerPage}

              page={page}

              onPageChange={handleChangePage}

              onRowsPerPageChange={handleChangeRowsPerPage}

            />          

          </Paper>    

      </div>

       

      {/* <CustomSnackbar message={message} variant="success" open={snackbaropen} /> */}

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

  <Modal

          open={isRenameModalOpen}

          onClose={closeModal}

          aria-labelledby="modal-modal-title"

          aria-describedby="modal-modal-description"

        >

          <Box sx={style}>

            <Rename />

          </Box>

        </Modal>

       

    </>

  );

}

 

