import React, { useState } from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import { useSearchMovieQuery } from "../../hooks/useSearchMovie";
import { useSearchParams } from "react-router-dom";
import LoadingSpinner from "../../common/LoadingSpinner/LoadingSpinner";
import MovieCard from "../../common/MovieCard/MovieCard";
import "./MoviePage.css";
import ReactPaginate from "react-paginate";

// 경로 2가지
// 1. navbar에서 클릭 => keyword x => popularMovie
// 2. keyword를 입력 => keyword와 관련된 영화들을 보여줌

// MoviePage의 url을 변경한 것은,
// url에서 keyword를 가져오기 위함이다.

// 페이지네이션 설치
// page state 만들기
// 페이지네이션 클릭할 때마다 page 바꿔주기
// page 값이 바뀔 때 마다 useSearchMovie에 page까지 넣어서 fetch

const MoviePage = () => {
  const [query] = useSearchParams();
  const keyword = query.get("q");

  // pagination
  const [page, setPage] = useState(1);

  const handlePageClick = ({ selected }) => {
    setPage(selected + 1);
  };

  const { data, isLoading, isError, error } = useSearchMovieQuery({
    keyword,
    page,
  });
  console.log(data); // 데이터 확인 완료

  if (isLoading) {
    return <LoadingSpinner color={"#e50914"} size={250} />;
  }
  if (isError) {
    return <Alert variant="danger">{error.message}</Alert>;
  }

  const hasResults = data?.results.length > 0;

  return (
    <Container className="MoviePage text-white">
      <Row>
        <Col lg={4} md={3} xs={12}>
          filter
        </Col>
        <Col lg={8} md={9} xs={12}>
          <Row>
            {hasResults ? (
              data?.results.map((movie, idx) => {
                return (
                  <Col
                    className="movie-card-wrapper"
                    key={idx}
                    lg={4}
                    md={6}
                    xs={12}
                  >
                    <MovieCard movie={movie} />
                  </Col>
                );
              })
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
                pageCount={data?.total_pages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
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
