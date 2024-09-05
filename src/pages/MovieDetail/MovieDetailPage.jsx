import React, { useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Col,
  Container,
  Modal,
  Row,
  Tab,
  Tabs,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useMovieDetailQuery } from "../../hooks/useMovieDetail";
import LoadingSpinner from "../../common/LoadingSpinner/LoadingSpinner";
import "./MovieDetailPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faUser } from "@fortawesome/free-solid-svg-icons";
import { useMovieReviewsQuery } from "../../hooks/useMovieReviews";
import { useMovieRecommendsQuery } from "../../hooks/useMovieRecommendations";
import MovieCard from "../../common/MovieCard/MovieCard";
import ReactShowMoreText from "react-show-more-text";
import { useMovieTrailerQuery } from "../../hooks/useMovieTrailer";
import YouTube from "react-youtube";

const MovieDetailPage = () => {
  let { id } = useParams();
  // console.log(id)
  const {
    data: detailData,
    isLoading: isLoadingDetail,
    isError: isErrorDetail,
    error: detailError,
  } = useMovieDetailQuery({ id });

  const { data: reviewsData, isLoading: isLoadingReviews } =
    useMovieReviewsQuery({ id });
  // console.log("rrr", reviewsData);

  const { data: recommendationsData, isLoading: isLoadingRecommendations } =
    useMovieRecommendsQuery({ id });
  // console.log("recommend", recommendationsData);

  const {
    data: trailerData,
    isLoading: isLoadingTrailer,
    isError: isErrorTrailer,
  } = useMovieTrailerQuery({ id });
  console.log("ttt", trailerData);

  // tab
  const [activeTab, setActiveTab] = useState("reviews");

  // modal
  const [showTrailer, setShowTrailer] = useState(false); // 예고편 모달의 상태
  const handleTrailerOpen = () => setShowTrailer(true); // 모달 열기
  const handleTrailerClose = () => setShowTrailer(false); // 모달 닫기

  const trailerKey = trailerData?.results.find(
    (video) => video.type === "Trailer"
  )?.key;

  if (isLoadingDetail) {
    return <LoadingSpinner color={"#e50914"} size={250} />;
  }

  if (isErrorDetail) {
    <Alert variant="danger">{detailError.message}</Alert>;
  }

  return (
    <Container className="MovieDetail text-white">
      <div className="movie-wrap">
        <div className="movie-poster">
          <img
            src={`https://www.themoviedb.org/t/p/w300_and_h450_bestv2${detailData?.poster_path}`}
            alt={`${detailData?.title}_poster`}
          />
        </div>
        <div className="movie-details">
          <h1 className="movie-title">{detailData?.title}</h1>
          <p className="movie-tagline">{detailData?.tagline}</p>
          <div className="movie-genres">
            {detailData?.genres.map((genre, idx) => {
              return (
                <Badge key={idx} bg="danger" className="genre">
                  {genre.name}
                </Badge>
              );
            })}
          </div>
          <div className="movie-rating">
            <span className="rating-score">
              <FontAwesomeIcon icon={faStar} style={{ color: "gold" }} />
              {detailData?.vote_average}
            </span>
            <span className="rating-count">
              <FontAwesomeIcon icon={faUser} />
              {detailData?.vote_count}
            </span>
            {detailData?.adult ? (
              <div className="rating-adult">18+</div>
            ) : (
              <div className="rating-all">All</div>
            )}
          </div>

          <p className="movie-description">{detailData?.overview}</p>

          <div className="movie-info-wrapper">
            <div className="movie-info">
              <div className="info-item">
                <span className="label">Budget:</span>
                <span className="value">
                  ${" "}
                  {detailData
                    ? new Intl.NumberFormat("en-US").format(detailData.budget)
                    : "No Data"}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Revenue:</span>
                <span className="value">
                  ${" "}
                  {detailData
                    ? new Intl.NumberFormat("en-US").format(detailData.revenue)
                    : "No Data"}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Release Date:</span>
                <span className="value">{detailData?.release_date}</span>
              </div>
              <div className="info-item">
                <span className="label">Run time:</span>
                <span className="value">{detailData?.runtime} min</span>
              </div>
            </div>

            <div className="trailer-button-wrapper">
              <Button variant="danger" onClick={handleTrailerOpen}>
                예고편 보기
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal show={showTrailer} onHide={handleTrailerClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>예고편 보기</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* 예고편 로딩 상태 */}
          {isLoadingTrailer ? (
            <LoadingSpinner color={"#e50914"} size={100} />
          ) : isErrorTrailer ? (
            <Alert variant="danger">
              예고편을 가져오는 중 문제가 발생했습니다.
            </Alert>
          ) : trailerKey ? (
            <YouTube
              videoId={trailerKey}
              opts={{
                playerVars: {
                  autoplay: 1,
                  controls: 1,
                  modestbranding: 1,
                },
              }}
            />
          ) : (
            <p>예고편을 찾을 수 없습니다.</p>
          )}
        </Modal.Body>
      </Modal>

      {/* Tabs for Reviews and Recommendations Movies */}
      <Tabs
        id="movie-detail-tabs"
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3"
      >
        <Tab eventKey="reviews" title="리뷰">
          {isLoadingReviews ? (
            <LoadingSpinner color={"#e50914"} size={100} />
          ) : (
            <div className="reviews">
              {reviewsData?.results.length > 0 ? (
                reviewsData.results.map((review, idx) => (
                  <div key={idx} className="review-item">
                    <h5>{review.author}</h5>
                    <ReactShowMoreText
                      /* Default options */
                      lines={3}
                      more="더보기"
                      less="접기"
                      className="content-css"
                      anchorClass="my-anchor-css-class"
                      expanded={false}
                      width={0}
                    >
                      {review.content}
                    </ReactShowMoreText>
                  </div>
                ))
              ) : (
                <p>리뷰가 없습니다.</p>
              )}
            </div>
          )}
        </Tab>
        <Tab eventKey="Recommendations" title="추천 영화">
          {isLoadingRecommendations ? (
            <LoadingSpinner color={"#e50914"} size={100} />
          ) : (
            <div className="recommendations-movies">
              <Row className="recommendations-movies-wrapper">
                {recommendationsData?.results.map((movie, idx) => {
                  return (
                    <Col
                      className="movie-card-wrapper"
                      key={idx}
                      lg={3}
                      md={4}
                      xs={6}
                    >
                      <MovieCard movie={movie} />
                    </Col>
                  );
                })}
              </Row>
            </div>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default MovieDetailPage;
