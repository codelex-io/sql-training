import _ from "lodash";
import { Database } from "../src/database";
import {
  selectGenreById,
  selectDirectorById,
  selectActorById,
  selectKeywordById,
  selectProductionCompanyById,
  selectMovieById
} from "../src/queries/select";
import { minutes } from "./utils";
import { ACTORS, DIRECTORS, GENRES, KEYWORDS, MOVIES, PRODUCTION_COMPANIES } from "../src/table-names";

describe("Foreign Keys", () => {
  let db: Database;

  beforeAll(async () => {
    db = await Database.fromExisting("07", "08");
    await db.execute("PRAGMA foreign_keys = ON");
  }, minutes(3));

  it(
    "should not be able delete genres if any movie is linked",
    async done => {
      const genreId = 5;
      const query = `delete from ${GENRES} WHERE id = ${genreId}`;
      try {
        await db.delete(query);
      } catch (e) {}

      const row = await db.selectSingleRow(selectGenreById(genreId));
      expect(row).toBeDefined();

      done();
    },
    minutes(10)
  );

  it(
    "should not be able delete director if any movie is linked",
    async done => {
      const directorId = 7;
      const query = `delete from ${DIRECTORS} WHERE id = ${directorId}`;
      try {
        await db.delete(query);
      } catch (e) {}

      const row = await db.selectSingleRow(selectDirectorById(directorId));
      expect(row).toBeDefined();

      done();
    },
    minutes(10)
  );

  it(
    "should not be able delete actor if any movie is linked",
    async done => {
      const actorId = 10;
      const query = `delete from ${ACTORS} WHERE id = ${actorId}`;
      try {
        await db.delete(query);
      } catch (e) {}

      const row = await db.selectSingleRow(selectActorById(actorId));
      expect(row).toBeDefined();

      done();
    },
    minutes(10)
  );

  it(
    "should not be able delete keyword if any movie is linked",
    async done => {
      const keywordId = 12;
      const query = `delete from ${KEYWORDS} WHERE id = ${keywordId}`;
      try {
        await db.delete(query);
      } catch (e) {}

      const row = await db.selectSingleRow(selectKeywordById(keywordId));
      expect(row).toBeDefined();

      done();
    },
    minutes(10)
  );

  it(
    "should not be able delete production company if any movie is linked",
    async done => {
      const companyId = 12;
      const query = `delete from ${PRODUCTION_COMPANIES} WHERE id = ${companyId}`;
      try {
        await db.delete(query);
      } catch (e) {}

      const row = await db.selectSingleRow(
        selectProductionCompanyById(companyId)
      );
      expect(row).toBeDefined();

      done();
    },
    minutes(10)
  );

  it(
    "should not be able delete movie if there are any linked data present",
    async done => {
      const movieId = 100;
      const query = `delete from ${MOVIES} WHERE id = ${movieId}`;
      try {
        await db.delete(query);
      } catch (e) {}

      const row = await db.selectSingleRow(selectMovieById(movieId));
      expect(row).toBeDefined();

      done();
    },
    minutes(10)
  );

  it(
    "should be able to delete movie",
    async done => {
      const movieId = 5915;
      const query = `DELETE FROM ${MOVIES}
      WHERE id = ${movieId}`;

      await db.delete(query);

      const row = await db.selectSingleRow(selectMovieById(movieId));
      expect(row).toBeUndefined();

      done();
    },
    minutes(10)
  );
});
