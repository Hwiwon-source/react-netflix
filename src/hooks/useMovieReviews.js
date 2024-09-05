import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

const fetchMovieReviews = async ({ id }) => {
  return await api.get(`/movie/${id}/reviews`);
};

export const useMovieReviewsQuery = ({ id }) => {
  return useQuery({
    queryKey: ["movie-reviews", { id }],
    queryFn: () => fetchMovieReviews({ id }),
    select: (result) => result.data,
  });
};
