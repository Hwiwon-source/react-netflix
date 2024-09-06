import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

// 장르별 영화 목록을 가져오는 함수
const fetchMoviesByGenre = async ({ queryKey }) => {
  const [, genreId, page, sortOrder] = queryKey;

  return await api.get(
    `/discover/movie?with_genres=${genreId}&page=${page}&sort_by=${sortOrder}&language=ko`
  );
};

// 커스텀 훅 정의
export const useDiscoverGenreQuery = ({ genreId, page, sortOrder }) => {
  return useQuery({
    queryKey: ["discover-genre", genreId, page, sortOrder],
    queryFn: fetchMoviesByGenre,
    select: (results) => results.data,
    keepPreviousData: true,
  });
};
