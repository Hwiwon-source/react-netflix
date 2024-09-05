import React from "react";
import { Alert } from "react-bootstrap";
import { useUpcomingMoviesQuery } from "../../../../hooks/useUpcomingMovies";
import MovieSlider from "../../../../common/MovieSlider/MovieSlider";
import { upcomingResponsive } from "../../../../constants/responsive";
import LoadingSpinner from "../../../../common/LoadingSpinner/LoadingSpinner";

const UpcomingMoiveSlide = () => {
  const { data, isLoading, isError, error } = useUpcomingMoviesQuery();

  if (isLoading) {
    return <LoadingSpinner color={"#e50914"} size={250} />;
  }

  if (isError) {
    <Alert variant="danger">{error.message}</Alert>;
  }

  return (
    <div className="UpcomingMoiveSlide text-white">
      <MovieSlider
        title={"개봉 예정 영화"}
        movies={data.results}
        responsive={upcomingResponsive}
      />
    </div>
  );
};

export default UpcomingMoiveSlide;
