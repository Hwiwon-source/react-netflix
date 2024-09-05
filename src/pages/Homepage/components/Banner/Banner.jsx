import React, { useEffect, useState } from "react";
import { usePopularMoviesQuery } from "../../../../hooks/usePopularMovies";
import Alert from "react-bootstrap/Alert";
import "./Banner.css";
import { Container } from "react-bootstrap";
import LoadingSpinner from "../../../../common/LoadingSpinner/LoadingSpinner";

const Banner = () => {
  // useQuery가 리턴하는 값들을 기억하라
  const { data, isLoading, isError, error } = usePopularMoviesQuery();
  const [rndIdx, setRndIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomValue = Math.floor(Math.random() * data.results.length);
      setRndIdx(randomValue);
    }, 8000);

    return () => clearInterval(interval);
  }, [data]);

  if (isLoading) {
    return <LoadingSpinner color={"#e50914"} size={250} />;
  }
  if (isError) {
    return <Alert variant="danger">{error.message}</Alert>;
  }
  return (
    <div
      style={{
        backgroundImage: `url(https://media.themoviedb.org/t/p/original/${data.results[rndIdx].poster_path})`,
      }}
      className="Banner"
    >
      <Container className="Banner-container text-white">
        <div className="Banner-text-area">
          <h1>{data?.results[rndIdx].title}</h1>
          <p>{data?.results[rndIdx].overview}</p>
        </div>
      </Container>
    </div>
  );
};

export default Banner;
