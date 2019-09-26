const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");
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
      const res = await request(server).get("/api/genres/1");
      expect(res.status).toBe(404);
    });

    it("should return 404 if no genre with the given ID exists", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get(`/api/genres/${id}`);
      expect(res.status).toBe(404);
    });

    it("should return a genre if valid id is passed", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();
      const res = await request(server).get(`/api/genres/${genre._id}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });
  });

  describe("POST /", () => {
    let token;
    let name;

    const exec = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "genre1";
    });

    it("should reutrn 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should reutrn 400 if genre name is less than 5 characters", async () => {
      name = "1234";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should reutrn 400 if genre name is more than 50 characters", async () => {
      name = new Array(52).join("a");
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save the genre if it is valid", async () => {
      await exec();

      const genre = await Genre.findOne({ name: "genre1" });

      expect(genre).not.toBeNull();
    });

    it("should return the genre if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });

  describe("PUT /:id", () => {
    let token;
    let updatedGenre;
    let genre;
    let id;
    beforeEach(async () => {
      token = new User().generateAuthToken();
      genre = new Genre({ name: "genre1" });
      id = genre._id;
      await genre.save();
      updatedGenre = { name: "updated" };
    });

    afterEach(async () => {
      await Genre.collection.deleteMany({});
    });

    const exec = () => {
      return request(server)
        .put(`/api/genres/${id}`)
        .set("x-auth-token", token)
        .send(updatedGenre);
    };

    it("should update genre if it is valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", updatedGenre.name);
    });

    it("should return 400 if genre is invalid", async () => {
      updatedGenre = {};

      const res = await exec();
      genre = await Genre.findOne();

      expect(res.status).toBe(400);
      expect(genre.name).toBe("genre1");
    });

    it("should return 404 if no genre with a given ID is found", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();
      genre = await Genre.findOne();

      expect(res.status).toBe(404);
      expect(genre.name).toBe("genre1");
    });
  });

  describe("DELETE /:id", () => {
    let token;
    let genre;
    let id;
    beforeEach(async () => {
      token = new User({ isAdmin: true }).generateAuthToken();
      genre = new Genre({ name: "genre1" });
      id = genre._id;
      await genre.save();
    });
    afterEach(async () => {
      await Genre.collection.deleteMany({});
    });

    const exec = () => {
      return request(server)
        .delete(`/api/genres/${id}`)
        .set("x-auth-token", token);
    };

    it("should delete genre if it is valid", async () => {
      const res = await exec();

      genre = await Genre.findOne();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
      expect(genre).toBeNull();
    });

    it("should should return 404 if genre with a given ID is not found", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();
      genre = await Genre.findOne();

      expect(res.status).toBe(404);
      expect(genre).toHaveProperty("_id");
      expect(genre).toHaveProperty("name", "genre1");
    });
  });
});
