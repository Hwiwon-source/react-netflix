import React from "react";
import { Alert } from "react-bootstrap";
import { useTopRatedMoviesQuery } from "../../../../hooks/useTopRatedMovies";
import MovieSlider from "../../../../common/MovieSlider/MovieSlider";
import { topRatedResponsive } from "../../../../constants/responsive";
import LoadingSpinner from "../../../../common/LoadingSpinner/LoadingSpinner";

const TopRatedMovieSlide = () => {
  const { data, isLoading, isError, error } = useTopRatedMoviesQuery();
  // console.log(data);

  if (isLoading) {
    return <LoadingSpinner color={"#e50914"} size={250} />;
  }

  if (isError) {
    <Alert variant="danger">{error.message}</Alert>;
  }

  return (
    <div className="TopRatedMovieSlide text-white">
      <MovieSlider
        title={"최고 평점 영화"}
        movies={data.results}
        responsive={topRatedResponsive}
      />
    </div>
  );
};

export default TopRatedMovieSlide;
