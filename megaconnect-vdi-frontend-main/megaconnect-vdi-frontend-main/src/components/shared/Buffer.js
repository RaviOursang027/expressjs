import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/css/carousel.css';

const videoSources = [
  'https://www.youtube.com/embed/NqgpZ_v4Ne8',
  'https://www.youtube.com/embed/E5yFcdPAGv0',
  'https://www.youtube.com/embed/ad79nYk2keg',
  // Add more video URLs as needed
];

const Buffer = () => {
  const SERVER_URI = process.env.REACT_APP_SERVER_URI;
  const FETCH_VM = `${SERVER_URI}/user/fetchIpVm`;

  const [isLoading, setIsLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(1200); // 10 minutes in seconds
  const [currentVideo, setCurrentVideo] = useState('/videos/video1.mp4');

  // Function to update the current video URL when a new video link is clicked
  const handleVideoClick = (link) => {
    setCurrentVideo(link);
  };

  useEffect(() => {
    let token = localStorage.getItem('accessToken');
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    // Check if there is a stored timestamp for window closure
    const storedTimestamp = localStorage.getItem('windowClosedTimestamp');
    if (storedTimestamp) {
      const now = new Date().getTime();
      const timeDifferenceInSeconds = Math.floor((now - parseInt(storedTimestamp)) / 1000);
      if (timeDifferenceInSeconds < timeRemaining) {
        // Subtract the time that has passed since window closure
        setTimeRemaining(timeRemaining - timeDifferenceInSeconds);
      }
      // Clear the stored timestamp
      localStorage.removeItem('windowClosedTimestamp');
    }

    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 1);
    }, 1000); // Update every second

    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      clearInterval(timer); // Clear the timer when loading is done
      axios
        .get(FETCH_VM, config)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error('An error occurred:', error);
        });
    }, 20 * 60 * 1000); // 10 minutes in milliseconds

    // Store the timestamp when the window is closed
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('windowClosedTimestamp', new Date().getTime().toString());
    });

    return () => {
      clearTimeout(loadingTimer);
      clearInterval(timer);
    };
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}min ${remainingSeconds}sec`;
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100vh',
          justifyContent: 'center',
        }}
      >
        <div className="carousel">
          <div className="container-carousel">
            <video className="slider" controls muted src={currentVideo} type="video/mp4"></video>
            <ul>
              {videoSources.map((source, index) => (
                <li key={index}>
                  <iframe
                    width="560"
                    height="315"
                    src={source}
                    title={`Video ${index + 1}`}
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="vm-text" style={{ display: 'flex', marginTop: '30px' }}>
            <span style={{ '--i': 1 }}>Y</span>
            <span style={{ '--i': 2 }}>o</span>
            {/* ... (similar spans for each character) */}
            <span style={{ '--i': 31 }}>n</span>
            <span style={{ '--i': 32 }}>g</span>
            <div style={{ marginLeft: '1em', display: 'flex', alignItems: 'center' }}>
              <h1 style={{ margin: 0, fontSize: '20px', lineHeight: 1 }}>
                {formatTime(timeRemaining)}..
              </h1>
            </div>
            <h1 style={{ color: 'red', marginLeft: '30px' }}>"Don't close this window"</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Content to display after loading */}
      <p>Check the Email</p>
    </div>
  );
};

export default Buffer;
