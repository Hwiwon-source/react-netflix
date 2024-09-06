import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Row } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import LoadingSpinner from "../../common/LoadingSpinner/LoadingSpinner";
import MovieCard from "../../common/MovieCard/MovieCard";
import "./MoviePage.css";
import ReactPaginate from "react-paginate";
import { useSearchMovieQuery } from "../../hooks/useSearchMovie";
import { useMovieGenreQuery } from "../../hooks/useMovieGenre";

const MoviePage = () => {
  const [query, setQuery] = useSearchParams();
  const keyword = query.get("q") || "";
  const genre = query.get("genre");
  const page = parseInt(query.get("page"), 10) || 1;
  const sortOrder = query.get("sortOrder") || "popular";

  // 영화 데이터 가져오는 커스텀 훅
  const {
    data: moviesData,
    isLoading,
    isError,
  } = useSearchMovieQuery({ keyword, genreId: genre, page, sortOrder });

  const { data: genres } = useMovieGenreQuery();

  // 정렬 필터
  const [selectedGenre, setSelectedGenre] = useState(genre || null);
  const [sortOption, setSortOption] = useState(sortOrder);

  useEffect(() => {
    setQuery({ q: keyword, genre: selectedGenre, page, sortOrder: sortOption });
  }, [keyword, selectedGenre, page, sortOption, setQuery]);

  const handleGenreClick = (genreId) => {
    setSelectedGenre(genreId);
    setQuery({ q: keyword, genre: genreId, page: 1, sortOrder: sortOption });
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setQuery({
      q: keyword,
      genre: selectedGenre,
      page: 1,
      sortOrder: e.target.value,
    });
  };

  const handlePageClick = ({ selected }) => {
    setQuery({
      q: keyword,
      genre: selectedGenre,
      page: selected + 1,
      sortOrder: sortOption,
    });
  };

  if (isLoading) {
    return <LoadingSpinner color={"#e50914"} size={250} />;
  }
  if (isError) {
    return <Alert variant="danger">{isError.message}</Alert>;
  }

  const movies = moviesData?.results;
  const totalPages = moviesData?.total_pages;

  const hasResults = movies && movies.length > 0;

  return (
    <Container className="MoviePage text-white">
      <Row>
        <Col lg={4} md={3} xs={12} className="filter-area">
          <div className="genre-section">
            <Button
              variant="danger"
              onClick={() => handleGenreClick(null)}
              className={!selectedGenre ? "active" : ""}
            >
              전체
            </Button>
            {genres &&
              genres.map((genre) => (
                <Button
                  variant="danger"
                  key={genre.id}
                  onClick={() => handleGenreClick(genre.id)}
                  className={selectedGenre === genre.id ? "active" : ""}
                >
                  {genre.name}
                </Button>
              ))}
          </div>
          <div className="sort-options-container">
            <select
              className="sort-options"
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="popularity.desc">인기 높은 순</option>
              <option value="vote_average.desc">평점 높은 순</option>
              <option value="release_date.desc">최신 순</option>
            </select>
          </div>
        </Col>
        <Col lg={8} md={9} xs={12} className="movie-area">
          <Row>
            {hasResults ? (
              movies.map((movie, idx) => (
                <Col
                  className="movie-card-wrapper"
                  key={idx}
                  lg={4}
                  md={6}
                  xs={6}
                >
                  <MovieCard movie={movie} />
                </Col>
              ))
            ) : (
              <div className="no-data">검색 결과가 존재하지 않습니다.</div>
            )}
          </Row>
          <div className="page-area">
            <div className={`pagination-container`}>
              <ReactPaginate
                previousLabel={"<"}
                nextLabel={">"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={totalPages}
                marginPagesDisplayed={0}
                pageRangeDisplayed={4}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                nextClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextLinkClassName={"page-link"}
                activeClassName={"active"}
                disabledClassName={"disabled"}
                forcePage={page - 1}
              />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default MoviePage;
