import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

// 장르별 영화 목록을 가져오는 함수
const fetchMoviesByGenre = async ({ queryKey }) => {
  const [_, genreId, page] = queryKey;
  return await api.get(
    `/discover/movie?with_genres=${genreId}&page=${page}&language=ko`
  );
};

// 커스텀 훅 정의
export const useDiscoverGenreQuery = ({ genreId, page }) => {
  return useQuery({
    queryKey: ["discover-genre", genreId, page],
    queryFn: fetchMoviesByGenre,
    select: (results) => results.data,
    keepPreviousData: true,
  });
};
