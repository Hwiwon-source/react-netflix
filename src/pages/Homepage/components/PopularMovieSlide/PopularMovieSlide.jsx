import React from "react";
import { usePopularMoviesQuery } from "../../../../hooks/usePopularMovies";
import { Alert } from "react-bootstrap";
import MovieSlider from "../../../../common/MovieSlider/MovieSlider";
import { popularResponsive } from "../../../../constants/responsive";
import LoadingSpinner from "../../../../common/LoadingSpinner/LoadingSpinner";

const PopularMovieSlide = () => {
  const { data, isLoading, isError, error } = usePopularMoviesQuery();

  if (isLoading) {
    return <LoadingSpinner color={"#e50914"} size={250} />;
  }

  if (isError) {
    <Alert variant="danger">{error.message}</Alert>;
  }

  return (
    <div className="PopularMovieSlide text-white">
      <MovieSlider
        title="인기 있는 영화"
        movies={data.results}
        responsive={popularResponsive}
      />
    </div>
  );
};

export default PopularMovieSlide;
