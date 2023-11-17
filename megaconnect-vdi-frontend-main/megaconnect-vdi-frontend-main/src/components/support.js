import * as React from "react";
import { useEffect } from "react";
import axios from "axios";
import CustomSnackbar from "./shared/snackbar";
import Button from "@mui/material/Button";
import Grid from '@mui/material/Grid';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Header from "./shared/header.js";
import Footer from "./shared/footer.js";

export default function Support() {
  const SERVER_URI = process.env.REACT_APP_SERVER_URI;
  // const GET_FAQ = `${SERVER_URI}/getFaqs`;
  // const [faq, setFaq] = React.useState([]);

  // SnackBar 
  const [snackbaropen, setSnackbarOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  // const [variant, setMessageVariant] = React.useState("");

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

  // useEffect(() => {
  //   let token = localStorage.getItem("accessToken");
  //   let config = {
  //     headers: { Authorization: `Bearer ${token}` },
  //   };
  //   if (faq.length === 0) {
  //     axios
  //       .get(GET_FAQ, config)
  //       .then((response) => {
  //         setFaq(response.data.FAQ);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // }, []);

  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : '');
  };
  
  return (
    <div>
      <Header />
      <div className="App LoginBg">
        <Grid container spacing={3}>
          <Grid item md={8} xs={12}>
            <div className="supportBg">
              <h1 style={{ margin: '0 0 1px 0' }}>FAQ</h1>  
              <Accordion style={{ margin: '0 0 1px 0' }} expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>
                    1. What Kind of OS can I use?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    - Astra PC supports Windows 10 because this OS delivers very good performance and load balancing.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion style={{ margin: '0 0 1px 0' }} expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>
                    2. How about Online Games?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    - Yes, you can play games.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion style={{ margin: '0 0 1px 0' }} expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>
                    3. Can I play Videos or Movies with it?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    - Yes, Astra PC are simply plug-and-play products designed for durable, high performance. The hardware accelerator reduces peaks in CPU utilization. By creating virtual CPU headroom, the accelerator allows CPU-intensive applications like videos to continue running smoothly.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion style={{ margin: '0 0 1px 0' }} expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>
                    4. What kind of customer support do you provide?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    - You don’t have to worry about customer support. Just contact us directly on the phone or email us, we will inspect your network and Astra PC and immediately provide solutions to any Astra PC-related problems..! Over calls or through RDP application by login to server PC remotely, and if you need local support, we have Astra PC support team.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </div>
          </Grid>
          <Grid item md={4} xs={12}>
            <div className="supportBg">
              <h1 style={{ margin: "0px"}}>Call Us:</h1>  
              <h3 style={{ marginTop: "25px"}}>For Sales:</h3>  
              <p style={{ fontSize: '16px', marginTop: "-10px"}}>+91 00000-00000</p>
              <h3 style={{ marginTop: "25px"}}>For Technical Support:</h3>  
              <p style={{ fontSize: '16px', marginTop: "-10px"}}>+91 00000-00000</p>
            </div>
            <div className="supportBg">
              <h1 style={{ margin: "0px"}}>Live Chat:</h1>  
              <Button variant="contained" className="orange" style={{marginTop: '15px' }}>
                Start Chat
              </Button>  
            </div>
          </Grid>
        </Grid>
        <CustomSnackbar message={message} variant="success" open={snackbaropen} />
      </div>
      <Footer />
    </div>
  );
}
