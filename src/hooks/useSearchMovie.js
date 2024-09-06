// import { useQuery } from "@tanstack/react-query";
// import api from "../utils/api";

// const fetchSearchMovie = ({ keyword, page }) => {
//   // navbar그냥 클릭(keyword x) 경우, keyword o 경우
//   return keyword
//     ? api.get(`/search/movie?query=${keyword}&page=${page}&language=ko`)
//     : api.get(`/movie/popular?page=${page}&language=ko`);
// };

// export const useSearchMovieQuery = ({ keyword, page }) => {
//   return useQuery({
//     // id와 같이 keyword가 달라지니 고유값을 추가한다.
//     queryKey: ["movie-search", { keyword, page }],
//     queryFn: () => {
//       return fetchSearchMovie({ keyword, page });
//       // ***queryFn은 data가 될 요소이니 매개변수를 가질 경우에는
//       // === 함수자체를 queryFn에 쥐어주자
//     },
//     select: (result) => {
//       return result.data;
//     },
//   });
// };

import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

// 검색 영화 데이터 가져오는 함수
const fetchMovies = async ({ queryKey }) => {
  const [, { keyword, genreId, page, sortOrder }] = queryKey;

  let url = `/discover/movie?page=${page}&sort_by=${sortOrder}&language=ko`;

  // 키워드가 있는 경우
  if (keyword) {
    url = `/search/movie?query=${keyword}&page=${page}&language=ko`;
  }

  // 장르가 있는 경우
  if (genreId) {
    url += `&with_genres=${genreId}`;
  }

  return await api.get(url);
};

// 커스텀 훅 정의
export const useSearchMovieQuery = ({ keyword, genreId, page, sortOrder }) => {
  return useQuery({
    queryKey: ["movie-search", { keyword, genreId, page, sortOrder }],
    queryFn: fetchMovies,
    select: (result) => result.data,
    keepPreviousData: true,
  });
};
