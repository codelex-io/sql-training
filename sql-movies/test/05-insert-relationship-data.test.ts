import _ from "lodash";
import { Database } from "../src/database";
import { minutes, Log } from "./utils";
import {
  MOVIE_GENRES,
  MOVIE_ACTORS,
  MOVIE_DIRECTORS,
  MOVIE_KEYWORDS,
  MOVIE_PRODUCTION_COMPANIES,
  ACTORS,
  DIRECTORS,
  KEYWORDS,
  PRODUCTION_COMPANIES
} from "../src/table-names";
import {
  selectCount,
  selectMovieId,
  selectMovie,
  selectGenresByMovieId,
  selectActorsByMovieId,
  selectDirectorsByMovieId,
  selectKeywordsByMovieId,
  selectProductionCompaniesByMovieId
} from "../src/queries/select";
import { CsvLoader } from "../src/data/csv-loader";
import {
  GenreRow,
  ActorRow,
  DirectorRow,
  KeywordRow,
  ProductionCompanyRow
} from "../src/types";

const insertMovieGenres = (
  movieId: number,
  genres: string[],
  genreRows: GenreRow[]
): string => {
  const filteredGenres:GenreRow[] = genreRows.filter(g => genres.indexOf(g.genre) != -1)
  
  return (`insert into MOVIE_GENRES (movie_id, genre_id) values` +
  filteredGenres.map( genre => `(${movieId}, ${genre.id})`).join(",")
  );
};

const insertMovieActors = (
  movieId: number,
  actors: string[],
  actorRows: ActorRow[]
): string => {

  const insertStatements: string[] = [];

  for (const actorName of actors) {
    const actorRow = actorRows.find((row) => row.full_name === actorName);
    if (actorRow) {
      insertStatements.push(
        `INSERT INTO ${MOVIE_ACTORS} (movie_id, actor_id) VALUES (${movieId}, ${actorRow.id});`
      );
    }
  }

  return insertStatements.join('\n');
};

const insertMovieDirectors = (
  movieId: number,
  directors: string[],
  directorRows: DirectorRow[]
): string => {
  const insertStatements: string[] = [];

  for (const directorName of directors) {
    const directorRow = directorRows.find((row) => row.full_name === directorName);
    if (directorRow) {
      insertStatements.push(
        `INSERT INTO ${MOVIE_DIRECTORS} (movie_id, director_id) VALUES (${movieId}, ${directorRow.id});`
      );
    }
  }

  return insertStatements.join('\n');
};

const insertMovieKeywords = (
  movieId: number,
  keywords: string[],
  keywordRows: KeywordRow[]
): string => {

  const insertStatements: string[] = [];

  for (const keywordName of keywords) {
    const keywordRow = keywordRows.find((row) => row.keyword === keywordName);
    if (keywordRow) {
      insertStatements.push(
        `INSERT INTO ${MOVIE_KEYWORDS} (movie_id, keyword_id) VALUES (${movieId}, ${keywordRow.id});`
      );
    }
  }
  return insertStatements.join('\n');
};

const insertMovieProductionCompanies = (
  movieId: number,
  productionCompanies: string[],
  productionCompanyRows: ProductionCompanyRow[]
): string => {

  const insertStatements: string[] = [];

  for (const companyName of productionCompanies) {
    const companyRow = productionCompanyRows.find((row) => row.company_name === companyName);
    if (companyRow) {
      insertStatements.push(
        `INSERT INTO ${MOVIE_PRODUCTION_COMPANIES} (movie_id, company_id) VALUES (${movieId}, ${companyRow.id});`
      );
    }
  }
  return insertStatements.join('\n');
};

describe("Insert Relationship Data", () => {
  let db: Database;

  beforeAll(async () => {
    db = await Database.fromExisting("04", "05");
    await CsvLoader.load();
  }, minutes(333));

  it(
    "should insert genre relationship data",
    async done => {
      const movies = await CsvLoader.movies();
      const genreRows = (await db.selectMultipleRows('SELECT id, genre FROM genres')) as GenreRow[];
      const moviesByImdbId = _.groupBy(await CsvLoader.movies(), "imdbId");

      for (const imdbId of Object.keys(moviesByImdbId)) {
        const movieId = (await db.selectSingleRow(selectMovieId(imdbId)))
          .id as number;
        const genres = movies.find(it => it.imdbId === imdbId)!.genres;
        if (genres.length > 0) {
          await db.insert(insertMovieGenres(movieId, genres, genreRows));
        }
      }

      const count = await db.selectSingleRow(selectCount(MOVIE_GENRES));
      expect(count.c).toBe(7141); 

      const movie = await db.selectSingleRow(selectMovie("tt2908446"));
      expect(movie.original_title).toBe("Insurgent");

      const genres = await db.selectMultipleRows(
        selectGenresByMovieId(movie.id as number)
      );
      expect(genres).toEqual([
        { genre: "Adventure" },
        { genre: "Science Fiction" },
        { genre: "Thriller" }
      ]);

      done();
    },
    minutes(333)
  );

  it(
    "should insert actor relationship data",
    async done => {
      const movies = await CsvLoader.movies();
      const actorRows = (await db.selectMultipleRows(`SELECT * FROM ${ACTORS}`)) as ActorRow[];
      const moviesByImdbId = _.groupBy(await CsvLoader.movies(), "imdbId");

      for (const imdbId of Object.keys(moviesByImdbId)) {
        const movieId = (await db.selectSingleRow(selectMovieId(imdbId)))
          .id as number;
        const actors = movies.find(it => it.imdbId === imdbId)!.cast;
        if (actors.length > 0) {
          await db.insert(insertMovieActors(movieId, actors, actorRows));
        }
      }

      const count = await db.selectSingleRow(selectCount(MOVIE_ACTORS));
      expect(count.c).toBe(14306);

      const movie = await db.selectSingleRow(selectMovie("tt3659388"));
      expect(movie.original_title).toBe("The Martian");

      const actors = await db.selectMultipleRows(
        selectActorsByMovieId(movie.id as number)
      );
      expect(actors).toEqual([
        { full_name: "Matt Damon" },
        { full_name: "Jessica Chastain" },
        { full_name: "Kristen Wiig" },
        { full_name: "Jeff Daniels" },
        { full_name: "Michael PeÃ±a" }
      ]);

      done();
    },
    minutes(333)
  );

  it(
    "should insert director relationship data",
    async done => {
      const movies = await CsvLoader.movies();
      const directorRows = (await db.selectMultipleRows(
        `SELECT * FROM ${DIRECTORS}`
      )) as DirectorRow[];
      const moviesByImdbId = _.groupBy(await CsvLoader.movies(), "imdbId");

      for (const imdbId of Object.keys(moviesByImdbId)) {
        const movieId = (await db.selectSingleRow(selectMovieId(imdbId)))
          .id as number;
        const directors = movies.find(it => it.imdbId === imdbId)!.directors;
        if (directors.length > 0) {
          await db.insert(
            insertMovieDirectors(movieId, directors, directorRows)
          );
        }
      }

      const count = await db.selectSingleRow(selectCount(MOVIE_DIRECTORS));
      expect(count.c).toBe(3340);

      const movie = await db.selectSingleRow(selectMovie("tt2488496"));
      expect(movie.original_title).toBe("Star Wars: The Force Awakens");

      const directors = await db.selectMultipleRows(
        selectDirectorsByMovieId(movie.id as number)
      );
      expect(directors).toEqual([{ full_name: "J.J. Abrams" }]);

      done();
    },
    minutes(333)
  );

  it(
    "should insert keyword relationship data",
    async done => {
      const movies = await CsvLoader.movies();
      const keywordRows = (await db.selectMultipleRows(`SELECT * FROM ${KEYWORDS}`)) as KeywordRow[];
      const moviesByImdbId = _.groupBy(await CsvLoader.movies(), "imdbId");

      for (const imdbId of Object.keys(moviesByImdbId)) {
        const movieId = (await db.selectSingleRow(selectMovieId(imdbId)))
          .id as number;
        const keywords = movies.find(it => it.imdbId === imdbId)!.keywords;
        if (keywords.length > 0) {
          await db.insert(insertMovieKeywords(movieId, keywords, keywordRows));
        }
      }

      const count = await db.selectSingleRow(selectCount(MOVIE_KEYWORDS));
      expect(count.c).toBe(9568);

      const movie = await db.selectSingleRow(selectMovie("tt2820852"));
      expect(movie.original_title).toBe("Furious 7");

      const keywords = await db.selectMultipleRows(
        selectKeywordsByMovieId(movie.id as number)
      );
      expect(keywords).toEqual([
        { keyword: "car race" },
        { keyword: "speed" },
        { keyword: "revenge" },
        { keyword: "suspense" },
        { keyword: "car" }
      ]);

      done();
    },
    minutes(333)
  );

  it(
    "should insert production companies relationship data",
    async done => {
      const movies = await CsvLoader.movies();
      const productionCompanyRows = (await db.selectMultipleRows(
        `SELECT * FROM ${PRODUCTION_COMPANIES}`
      )) as ProductionCompanyRow[];
      const moviesByImdbId = _.groupBy(await CsvLoader.movies(), "imdbId");

      for (const imdbId of Object.keys(moviesByImdbId)) {
        const movieId = (await db.selectSingleRow(selectMovieId(imdbId)))
          .id as number;
        const productionCompanies = movies.find(it => it.imdbId === imdbId)!
          .productionCompanies;
        if (productionCompanies.length > 0) {
          await db.insert(
            insertMovieProductionCompanies(
              movieId,
              productionCompanies,
              productionCompanyRows
            )
          );
        }
      }

      const count = await db.selectSingleRow(
        selectCount(MOVIE_PRODUCTION_COMPANIES)
      );
      expect(count.c).toBe(7017);

      const movie = await db.selectSingleRow(selectMovie("tt0133046"));
      expect(movie.original_title).toBe("Teaching Mrs. Tingle");

      const productionCompanies = await db.selectMultipleRows(
        selectProductionCompaniesByMovieId(movie.id as number)
      );
      expect(productionCompanies).toEqual([
        { company_name: "Dimension Films" },
        { company_name: "Interscope Communications" },
        { company_name: "Konrad Pictures" }
      ]);

      done();
    },
    minutes(333)
  ); 
});