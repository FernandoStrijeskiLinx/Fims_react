import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { FiLink, FiPlus, FiCameraOff, FiCheck } from "react-icons/fi";
import { IMovieRequestProps } from "../interfaces/Movie";

import { Button } from "../components/Button";
import { ButtonVariants } from "../components/Button/types";

import api from "../services/api";

//import { movie } from "../mocks/movie";

import * as Styles from "../styles/pages/Movie";

import { Loading } from "../components/Loading";
import { Link } from "../components/Link";

export function Movie() {
  const { id } = useParams();
  const currentUrl = window.location.href;

  const [movie, setMovie] = useState<IMovieRequestProps>();
  const [isLoading, setIsLoading] = useState(true);

  const [isLinkCopiedToClipboard, setIsLinkCopiedToClipboard] = useState(false);

  const movieYearRelease = movie && new Date(movie.release_date).getFullYear();
  const movieHours = movie && Number(Math.trunc(movie.runtime / 60).toFixed(0));
  const movieMinutes =
    movie && movieHours && (movie.runtime - movieHours * 60).toFixed(0);

  function handleCopyLinkToClipboard() {
    setIsLinkCopiedToClipboard(true);

    navigator.clipboard.writeText(currentUrl);
  }

  useEffect(() => {
    api
      .get<IMovieRequestProps>(`/movie/${id}`)
      .then((response) => {
        setMovie(response.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (isLinkCopiedToClipboard) {
      setTimeout(() => {
        setIsLinkCopiedToClipboard(false);
      }, 2500);
    }
  }, [isLinkCopiedToClipboard]);

  return (
    <Styles.Container>
      {isLoading ? (
        <Loading />
      ) : (
        <section id="presentation">
          <div className="movie-poster-wrapper">
            {movie?.poster_path ? (
              <Link to={movie?.homepage}>
                <img
                  src={`${import.meta.env.VITE_THE_MOVIE_DB_IMAGES_URL}${
                    movie?.poster_path
                  }`}
                  alt={`Capa do filme ${movie?.title}`}
                />
              </Link>
            ) : (
              <>
                <FiCameraOff />
                <p>Capa indisponível</p>
              </>
            )}
          </div>

          <div className="about">
            <div>
              <Link to={movie?.homepage}>
                <h1>{movie?.title}</h1>
              </Link>
              <h4>
                {movie?.genres
                  .map((genre) => genre.name)
                  .toString()
                  .replace(",", ", ")}
                <span>•</span>
                {movieYearRelease}
                <span>•</span>
                {`${movieHours}h `}
                {movieMinutes}m
              </h4>

              <p>{movie?.overview}</p>
            </div>

            <footer>
              <p>
                Avaliação geral: <span>{movie?.vote_average.toFixed(1)}</span>
              </p>

              <div className="actions">
                <Button
                  variant={ButtonVariants.Secondary}
                  onClick={handleCopyLinkToClipboard}
                  disabled={isLinkCopiedToClipboard}
                >
                  {isLinkCopiedToClipboard ? (
                    <>
                      Link copiado
                      <FiCheck />
                    </>
                  ) : (
                    <>
                      Copiar link
                      <FiLink />
                    </>
                  )}
                </Button>

                <Button type="button" variant={ButtonVariants.Secondary}>
                  Adicionar à minha lista
                  <FiPlus />
                </Button>
              </div>
            </footer>
          </div>
        </section>
      )}
    </Styles.Container>
  );
}
