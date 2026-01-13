import React from 'react';
import file from '../../assets/file.png'
const Home = () => {
  return (
    <div
      style={{
        margin: "10px",
        padding: "10px",
        width: "97vw",
        height: "87vh",
        borderRadius: "0", // Remove border radius for full page
        boxShadow: "none", // Remove box shadow for full page
        backgroundImage: `url(${file})`, // Set the background image
        backgroundSize: "cover", // Ensure the image covers the entire div
        backgroundPosition: "center", // Center the image
        backgroundRepeat: "no-repeat", // Prevent tiling of the image
      }}
    ></div>
  );
};

export default Home;