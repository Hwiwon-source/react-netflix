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

const fetchSearchMovie = async ({ keyword, genre, page }) => {
  const language = "ko-KR";

  if (keyword) {
    return api.get(
      `/search/movie?query=${keyword}&page=${page}&language=${language}`
    );
  } else if (genre) {
    return api.get(
      `/discover/movie?with_genres=${genre}&page=${page}&language=${language}`
    );
  }
  return api.get(`/movie/popular?page=${page}&language=${language}`);
};

export const useSearchMovieQuery = ({ keyword, genre, page }) => {
  return useQuery({
    queryKey: ["movie-search", keyword, genre, page],
    queryFn: () => fetchSearchMovie({ keyword, genre, page }),
    select: (result) => result.data,
    enabled: Boolean(page !== null),
  });
};
