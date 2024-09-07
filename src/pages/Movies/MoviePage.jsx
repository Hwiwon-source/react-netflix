import React, { useEffect, useState } from "react";
import {
  DropdownButton,
  Alert,
  Button,
  Col,
  Container,
  Row,
  ButtonGroup,
  Dropdown,
} from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import LoadingSpinner from "../../common/LoadingSpinner/LoadingSpinner";
import MovieCard from "../../common/MovieCard/MovieCard";
import "./MoviePage.css";
import ReactPaginate from "react-paginate";
import { useSearchMovieQuery } from "../../hooks/useSearchMovie";
import { useMovieGenreQuery } from "../../hooks/useMovieGenre";

const MoviePage = () => {
  // 소팅 list 변수지정
  const sortList = {
    popularityDesc: "인기 순",
    ratingDesc: "평점 순",
    releaseDesc: "최신 순",
  };

  const [query, setQuery] = useSearchParams();
  const [page, setPage] = useState(1);
  const [sortTitle, setSortTitle] = useState(sortList.popularityDesc);
  const [genreTitle, setGenreTitle] = useState("전체");
  const [filteredMovieData, setFilteredMovieData] = useState([]);
  // 필터링된 movieData를 따로관리할 것
  const [selectedGenreID, setSelectedGenreID] = useState(0);

  const keyword = query.get("q");

  // 영화 데이터 가져오는 커스텀 훅
  const {
    data: moviesData,
    isLoading,
    isError,
  } = useSearchMovieQuery({ keyword, page });

  const { data: genresData } = useMovieGenreQuery();

  // movieData가 변경되면 따로관리하는 필터리스트에 데이터 관리할 것 (오버라이드 방지)
  useEffect(() => {
    if (moviesData?.results) {
      setFilteredMovieData(moviesData.results);
    }
  }, [moviesData]);

  // 키워드 변경 시 리랜더링...
  // 초기화 대상: 페이지, 장르필터title, 장르ID, 인기순정렬
  useEffect(() => {
    setPage(1);
    setGenreTitle("전체");
    setSelectedGenreID(null);
    setSortTitle(sortList.popularityDesc);
  }, [keyword]);

  // 페이지네이션 페이지번호+1
  const handlePageClick = ({ selected }) => {
    setPage(selected + 1);
  };

  // 장르 핸들러
  const handleGenre = (id, event) => {
    let selectedGenreID = null;
    // 1. 선택장르ID 초기값 지정
    selectedGenreID = parseInt(id);
    console.log(selectedGenreID); // ID확인
    setSelectedGenreID(selectedGenreID);

    const selectedGenreName = event.target.getAttribute("data-name");
    setGenreTitle(selectedGenreName);

    if (selectedGenreID === 0) {
      setFilteredMovieData(moviesData?.results);
      return;
    }

    if (!selectedGenreID) return;

    const filtered = moviesData?.results.filter((movie) =>
      movie.genre_ids.includes(parseInt(selectedGenreID))
    );

    setFilteredMovieData(filtered);
    setPage(1); // 장르선택시 페이지 초기화
    setSortTitle(sortList.popularityDesc); // 소팅 타이틀 초기화
  };

  // 소팅 핸들러
  const handleSort = (event) => {
    let sortedMovies = [...filteredMovieData]; // 데이터 복사

    // 소팅 옵션에 따라 데이터 정렬
    switch (event) {
      case "1": // 인기 순
        setSortTitle(sortList.popularityDesc);
        sortedMovies = sortedMovies.sort((a, b) => b.popularity - a.popularity);
        break;
      case "2": // 평점 순
        setSortTitle(sortList.ratingDesc);
        sortedMovies = sortedMovies.sort(
          (a, b) => b.vote_average - a.vote_average
        );
        break;
      case "3": // 출시일 순 (추가)
        setSortTitle(sortList.releaseDesc);
        sortedMovies = sortedMovies.sort(
          (a, b) => new Date(b.release_date) - new Date(a.release_date)
        );
        break;
      default:
        setSortTitle(sortList.popularityDesc);
        sortedMovies = sortedMovies.sort((a, b) => b.popularity - a.popularity);
    }

    setFilteredMovieData(sortedMovies);
  };

  if (isLoading) {
    return <LoadingSpinner color={"#e50914"} size={250} />;
  }
  if (isError) {
    return <Alert variant="danger">{isError.message}</Alert>;
  }

  return (
    <Container className="MoviePage text-white">
      <Row>
        <Col lg={4} md={12} className="filter-area">
          <div className="genre-section">
            {<h2 className="filter-title">{genreTitle} 장르</h2>}
            <Button
              className={`m-1 ${selectedGenreID === 0 ? "selected-genre" : ""}`}
              variant={"danger"}
              value={0}
              data-name={"전체"}
              onClick={(e) => handleGenre(0, e)}
            >
              전체
            </Button>
            {genresData?.map((genre, idx) => (
              <Button
                className={`m-1 ${
                  selectedGenreID === genre.id ? "selected-genre" : ""
                }`}
                variant={"danger"}
                key={idx}
                value={genre.id}
                data-name={genre.name}
                onClick={(e) => handleGenre(genre.id, e)}
              >
                {genre.name}
              </Button>
            ))}
          </div>
          <div className="sort-section">
            {<h2 className="filter-title">{sortTitle} 정렬</h2>}
            <DropdownButton
              as={ButtonGroup}
              key={"down-centered"}
              id={`dropdown-button-drop-down-centered`}
              drop={"down-centered"}
              variant="danger"
              title={sortTitle}
              onSelect={(e) => handleSort(e)}
            >
              <Dropdown.Item eventKey="1">
                {sortList.popularityDesc}
              </Dropdown.Item>
              <Dropdown.Item eventKey="2">{sortList.ratingDesc}</Dropdown.Item>
              <Dropdown.Item eventKey="3">{sortList.releaseDesc}</Dropdown.Item>
            </DropdownButton>
          </div>
        </Col>
        <Col lg={8} md={12} className="movie-area">
          <Row>
            {filteredMovieData.length > 0 ? (
              filteredMovieData.map((movie, idx) => (
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
                pageCount={moviesData?.total_pages}
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
