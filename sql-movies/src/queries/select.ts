import { ACTORS, DIRECTORS, GENRES, KEYWORDS, MOVIES, MOVIE_ACTORS, MOVIE_DIRECTORS, MOVIE_GENRES, MOVIE_KEYWORDS, MOVIE_PRODUCTION_COMPANIES, MOVIE_RATINGS, PRODUCTION_COMPANIES } from "../table-names";

export const selectActorByName = (fullName: string): string => {
  return `select id, full_name from ${ACTORS} where full_name = '${fullName}'`
};

export const selectKeyword = (keyword: string): string => {
  return `select id, keyword from ${KEYWORDS} where keyword = '${keyword}'`
};

export const selectDirector = (director: string): string => {
  return `select id, full_name from ${DIRECTORS} where full_name = '${director}'`
};

export const selectGenre = (genre: string): string => {
  return `select id, genre from ${GENRES} where genre = '${genre}'`
};

export const selectProductionCompany = (company: string): string => {
  return `select id, company_name from ${PRODUCTION_COMPANIES} where company_name = '${company}'`
};

export const selectMovieById = (id: number): string => {
  return `select * from ${MOVIES} where id = ${id}`
};

export const selectGenreById = (id: number): string => {
  return `select * from ${GENRES} where id = ${id}`
};

export const selectDirectorById = (id: number): string => {
  return `select * from ${DIRECTORS} where  id = ${id}`
};

export const selectActorById = (id: number): string => {
  return `select * from ${ACTORS} where  id = ${id}`
};

export const selectKeywordById = (id: number): string => {
  return `select * from ${KEYWORDS} where id = ${id}`
};

export const selectProductionCompanyById = (id: number): string => {
  return `select * from ${PRODUCTION_COMPANIES} where id = ${id}`
};

export const selectMovie = (imdbId: string): string => {
  return `SELECT * FROM ${MOVIES} WHERE imdb_id = '${imdbId}'`;
};

export const selectMovieId = (imdbId: string): string => {
  return `select id FROM ${MOVIES} where imdb_id = '${imdbId}'`
};

export const selectRatingsByUserID = (userId: number): string => {
  return `select * FROM ${MOVIE_RATINGS} where user_id = ${userId}`
};

export const selectGenresByMovieId = (movieId: number): string => {
  return `select g.genre from movie_genres mg join genres g on g.id = mg.genre_id where mg.movie_id = ${movieId}`;
};

export const selectActorsByMovieId = (movieId: number): string => {
  return `select a.full_name from movie_actors ma join actors a on a.id = ma.actor_id where ma.movie_id = ${movieId}`;
};

export const selectDirectorsByMovieId = (movieId: number): string => {
  return `select d.full_name from movie_directors md join directors d on d.id = md.director_id where md.movie_id = ${movieId}`;
};

export const selectKeywordsByMovieId = (movieId: number): string => {
  return `select k.keyword from movie_keywords mk join keywords k on k.id = mk.keyword_id where mk.movie_id = ${movieId}`;
};

export const selectProductionCompaniesByMovieId = (movieId: number): string => {
  return `select pc.company_name from movie_production_companies mpc join production_companies pc on pc.id = mpc.company_id where mpc.movie_id = ${movieId}`;
};

export const selectCount = (table: string): string => {
  return `SELECT COUNT(*) as c FROM ${table}`;
};
