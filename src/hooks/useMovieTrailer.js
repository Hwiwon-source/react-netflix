import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

const fetchMovieTrailer = async ({ id }) => {
  return await api.get(`/movie/${id}/videos`);
};

export const useMovieTrailerQuery = ({ id }) => {
  return useQuery({
    queryKey: ["movie-Trailer", { id }],
    queryFn: () => fetchMovieTrailer({ id }),
    select: (result) => result.data,
  });
};
