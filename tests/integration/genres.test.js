const request = require("supertest");
const { Genre } = require("../../models/genre");
const mongoose = require("mongoose");
let server;

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await Genre.deleteMany({});
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre 1" },
        { name: "genre 2" }
      ]);
      const res = await request(server).get("/api/genres");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.name === "genre 1")).toBeTruthy();
      expect(res.body.some(g => g.name === "genre 2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return 404 when called with invalid genreId", async () => {
      await Genre.collection.insertOne({ name: "genre 1" });
      const res = await request(server).get(
        `/api/genres/${new mongoose.Types.ObjectId()}`
      );
      expect(res.status).toBe(404);
    });

    it("should return a genre with given id", async () => {
      await Genre.collection.insertOne({ name: "genre 1" });
      const genre = await Genre.findOne();
      const res = await request(server).get(`/api/genres/${genre.id}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ name: "genre 1", _id: genre.id });
    });
  });
});
