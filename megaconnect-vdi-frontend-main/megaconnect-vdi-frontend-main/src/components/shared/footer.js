import * as React from "react";
import "./../../assets/css/header.css";
import Grid from '@mui/material/Grid';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

export default function Footer() {
  
  
  return <div className="footerBg" >    
      <div className="App LoginBg" >   
      <Grid container spacing={3}>
        <Grid item md={6} xs={12} sx={{textAlign:{xs:'center' }}}>
          <a href="https://www.facebook.com/profile.php?id=100091442790464" target="_blank"><FacebookIcon /></a>
          <a href="https://www.linkedin.com/company/techmegacloud/" target="_blank"><LinkedInIcon /></a>
          <a href="https://twitter.com/MegaConnectTech" target="_blank"><TwitterIcon /></a>
          <a href="https://www.instagram.com/megaconnecttechnologies/" target="_blank"><InstagramIcon /></a>
        </Grid>
        <Grid item md={6} xs={12} sx={{textAlign:{xs:'center', md:'right'}}}>
          <p >All Right Reserved by Megaconnect Technologies | Copyright © 2023 </p>          
        </Grid>
      </Grid>
      </div>
    </div>;
}
