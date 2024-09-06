import React, { useEffect, useState } from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import LoadingSpinner from "../../common/LoadingSpinner/LoadingSpinner";
import MovieCard from "../../common/MovieCard/MovieCard";
import "./MoviePage.css";
import ReactPaginate from "react-paginate";
import { useDiscoverGenreQuery } from "../../hooks/useDiscoverGenre";
import { useSearchMovieQuery } from "../../hooks/useSearchMovie";
import { useMovieGenreQuery } from "../../hooks/useMovieGenre";

const MoviePage = () => {
  const [query, setQuery] = useSearchParams();
  const keyword = query.get("q") || "";
  const genre = query.get("genre");
  const page = parseInt(query.get("page"), 10) || 1;
  const sortOrder = query.get("sortOrder") || "popular";

  // 장르별 영화 목록을 가져오는 커스텀 훅
  const {
    data: genreMovies,
    isLoading: genreLoading,
    isError: genreError,
  } = useDiscoverGenreQuery({ genreId: genre, page, sortOrder });
  const {
    data: searchMovies,
    isLoading: searchLoading,
    isError: searchError,
  } = useSearchMovieQuery({ keyword, page, sortOrder });
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

  if (genreLoading || searchLoading) {
    return <LoadingSpinner color={"#e50914"} size={250} />;
  }
  if (genreError || searchError) {
    return (
      <Alert variant="danger">{(genreError || searchError).message}</Alert>
    );
  }

  const movies = selectedGenre ? genreMovies?.results : searchMovies?.results;
  const totalPages = selectedGenre
    ? genreMovies?.total_pages
    : searchMovies?.total_pages;

  const hasResults = movies && movies.length > 0;

  return (
    <Container className="MoviePage text-white">
      <Row>
        <Col lg={4} md={3} xs={12}>
          <div className="genre-section">
            <button
              onClick={() => handleGenreClick(null)}
              className={!selectedGenre ? "active" : ""}
            >
              전체
            </button>
            {genres &&
              genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => handleGenreClick(genre.id)}
                  className={selectedGenre === genre.id ? "active" : ""}
                >
                  {genre.name}
                </button>
              ))}
          </div>
          <div className="sort-options-container">
            <select
              className="sort-options"
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="popular">인기 높은 순</option>
              <option value="least-popular">인기 낮은 순</option>
              <option value="release">최신순</option>
            </select>
          </div>
        </Col>
        <Col lg={8} md={9} xs={12}>
          <Row>
            {hasResults ? (
              movies.map((movie, idx) => (
                <Col
                  className="movie-card-wrapper"
                  key={idx}
                  lg={4}
                  md={6}
                  xs={12}
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
