// App Images
import Netflix from "../../assets/images/apps/Netflix.png";
import Youtube from "../../assets/images/apps/Youtube.png";
import Hotstar from "../../assets/images/apps/Hotstar.png";
import Chrome from "../../assets/images/apps/Chrome.png";
import Telegram from "../../assets/images/apps/Telegram.png";
import Spotify from "../../assets/images/apps/Spotify.png";
import Cultfit from "../../assets/images/apps/Cultfit.png";
import Steam from "../../assets/images/apps/Steam.png";
import EpicGames from "../../assets/images/apps/EpicGames.png";
import MSOffice from "../../assets/images/apps/MSOffice.png";
// import Whatsapp from "../../assets/images/apps/Whatsapp.png";
import Watsapp from "../../assets/images/apps/watsapp.png"

import Category1 from "../../assets/images/category1.png";
import Category2 from "../../assets/images/category2.png";
import Category3 from "../../assets/images/category3.png";
import Category4 from "../../assets/images/category4.png";
import Twitter from "../../assets/images/apps/Twitter.png"
import  Linkedin  from "../../assets/images/apps/Linkedin.png";
// import DailyHunt from "../../assets/images/apps/Daily Hunt.jpg"
import DailyHunt from "../../assets/images/apps/Daily Hunt.png"
import Discord from "../../assets/images/apps/Discord.png"
import KhanAcademy from "../../assets/images/apps/KhanAcademy.png"
import LinkedinLearning from "../../assets/images/apps/Linkedin Learning.png"
import FireFox from "../../assets/images/apps/Fire Fox.png"
import  Vlcmediaplayer from "../../assets/images/apps/VLC media player.png"



const getIcons = function () {
  return {
    Netflix: Netflix,
    Youtube: Youtube,
    Hotstar: Hotstar,
    "Google Chrome": Chrome,
    Spotify: Spotify,
    Telegram: Telegram,
    Twitter:Twitter,
    steam: Steam,
    Linkedin:Linkedin,
    "Daily hunt":DailyHunt,
    Discord:Discord,
    "Khan Academy":KhanAcademy,
    "Linkedin Learning":LinkedinLearning,
    "Fire Fox":FireFox,
    "Epic Games launcher": EpicGames,
    "VLC media player": Vlcmediaplayer,
    "Whatsapp":Watsapp
    // "Cult fit": Cultfit,
    
    // "Epic Games": EpicGames,
    // "MS Office": MSOffice,
    // Whatsapp: Whatsapp,
    // Entertainment : Category1,
    // Productivity : Category2,
    // "Health & Fitness" : Category3,
    // Games : Category4,
    

  };
};

export { getIcons };
