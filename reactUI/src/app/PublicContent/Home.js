import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';

const Home = () => {
  const user = useSelector((state) => state.userReducer.user)
  return (
    <>
      <h4> this will become the report home page with demographic breakdowns, watchlist, and data vis.</h4>
      <h5>Username: {user.username}</h5>
    </>
  );
};

export default Home;
