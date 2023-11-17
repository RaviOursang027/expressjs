import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import Grid from "@mui/material/Grid";
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import FileList from '../filefolder/FileList'
import { useAppStore } from '../appStore';
import WbCloudyOutlinedIcon from '@mui/icons-material/WbCloudyOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShareIcon from '@mui/icons-material/Share';
import HomeIcon from '@mui/icons-material/Home';
import DeleteIcon from '@mui/icons-material/Delete';



const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));



const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ed' : '#308fe8',
  },
}));

export default function Sidenav() {
  const theme = useTheme();
  // const [open, setOpen] = React.useState(true);
  // const setOpen=useAppStore((state)=>state.updateOpen)
  const open=useAppStore((state)=>state.dopen)
   const navigate=useNavigate()
   const SERVER_URI = process.env.REACT_APP_SERVER_URI;
  const FILE_LIST = `${SERVER_URI}/list`;
  const [totalBucketStorage, setTotalBucketStorage] = React.useState(null);
 

  // Function to fetch file list and total bucket storage from the API
  const fetchFileListAndStorage = async () => {
    try {
      let token = localStorage.getItem("accessToken");
      const response = await fetch(FILE_LIST, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      // Extract total bucket storage from the API response
      const totalStorage = parseFloat(data.totalBucketSize.replace(' MB', ''));// Convert to a floating-point number
      setTotalBucketStorage(totalStorage); // Update state with total bucket storage
    } catch (error) {
      console.error('Error fetching file list:', error);
    }
  };

  // Fetch file list and total bucket storage when the component mounts
  React.useEffect(() => {
    const fetchData = async () => {
      await fetchFileListAndStorage();
    };
    fetchData();
  }, []);


  return (
    
    <Box sx={{ display: 'flex'}}>
      <CssBaseline />
     <Box height={30}>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton> 
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
       
        <List>
          
            <ListItem  disablePadding sx={{ display: 'block' }}  onClick={()=>navigate("/overview")}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                 <HomeIcon /> 
                </ListItemIcon>
                <ListItemText primary="Overview" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>

            
            <ListItem  disablePadding sx={{ display: 'block' }}  onClick={()=>navigate("/overview")}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                 <SettingsOutlinedIcon /> 
                </ListItemIcon>
                <ListItemText primary="Settings" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>

            
            <ListItem  disablePadding sx={{ display: 'block' }} onClick={()=>navigate("/support")}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                 <SupportAgentOutlinedIcon /> 
                </ListItemIcon>
                <ListItemText primary="Support" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
    
            <ListItem  disablePadding sx={{ display: 'block' }} onClick={()=>navigate("/profile")}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                 <AccountCircleIcon  /> 
                </ListItemIcon>
                <ListItemText primary="Profile" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
            
            <ListItem  disablePadding sx={{ display: 'block' }} >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                 <ShareIcon/> 
                </ListItemIcon>
                <ListItemText primary="Refer & Earn" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
            <ListItem  disablePadding sx={{ display: 'block' }} onClick={()=>navigate("")}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                 <DeleteIcon /> 
                </ListItemIcon>
                <ListItemText primary="Trash" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
            <ListItem  disablePadding sx={{ display: 'block' }} >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                 <WbCloudyOutlinedIcon /> 
                </ListItemIcon>
                <ListItemText primary="Storage" sx={{ opacity: open ? 1 : 0 }} />
                
              </ListItemButton>
              <Grid
                  item
                  xs={2}
                  style={{ textAlign: "center", marginTop: "10px", padding:"10px" }}
                >
                 <BorderLinearProgress variant="determinate" value={(totalBucketStorage / 1000) * 100}  />
                <p>
                  <small>{`${totalBucketStorage}MB of 500MB`}</small>
                </p>
              </Grid>
            </ListItem>
          
    
        </List>
        <Divider/>
       
        
      </Drawer>
      </Box>
    </Box>
  );
}
