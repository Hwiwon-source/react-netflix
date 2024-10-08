import React from "react";
import Banner from "./components/Banner/Banner";
import PopularMovieSlide from "./components/PopularMovieSlide/PopularMovieSlide";
import TopRatedMovieSlide from "./components/TopRatedMovieSlide/TopRatedMovieSlide";
import UpcomingMoiveSlide from "./components/UpcomingMoiveSlide/UpcomingMoiveSlide";

// 1. 배너 => popular영화를 들고와서 첫번째 아이템을 보여준다.
// 2. popular movie
// 3. top rated movie
// 4. upcoming movie

const Homepage = () => {
  return (
    <div className="Homepage">
      <Banner />
      <PopularMovieSlide />
      <TopRatedMovieSlide />
      <UpcomingMoiveSlide />
    </div>
  );
};

export default Homepage;
