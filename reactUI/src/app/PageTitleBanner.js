import React from "react";
import { Container } from "react-bootstrap";

const bannerWrapperStyle = {
  position: "relative",
  background: "linear-gradient(135deg, rgba(0, 123, 255, 0.5), rgba(255, 0, 150, 0.5))",
  height: "300px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
};

const bannerContentStyle = {
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)", // for Safari support
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  borderRadius: "12px",
  padding: "2rem",
  color: "white", // text color
  textAlign: "center",
};

const PageTitleBanner = () => {
  return (
    <div style={bannerWrapperStyle}>
      <Container style={bannerContentStyle}>
        <h1>Welcome to My App</h1>
        <p>This is a beautiful banner with a gradient and blur effect.</p>
      </Container>
    </div>
  );
};

export default PageTitleBanner;