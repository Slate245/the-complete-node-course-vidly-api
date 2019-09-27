const request = require("supertest");
const { User } = require("../../models/user");
const { Customer } = require("../../models/customer");

describe("/api/customers", () => {
  let server;
  let token;
  let customer;

  beforeEach(() => {
    server = require("../../index");
    token = new User().generateAuthToken();

    customer = new Customer({
      name: "12",
      phone: "12345"
    });
  });
  afterEach(async () => {
    await server.close();
    await Customer.deleteMany({});
  });

  const exec = () => {
    return request(server)
      .post("/api/customers")
      .set("x-auth-token", token)
      .send(customer);
  };

  describe("POST /", () => {
    it("should return 400 if customer has no name", async () => {
      customer.name = "";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if customer has no phone", async () => {
      customer.phone = "";
      const res = await exec();

      expect(res.status).toBe(400);
    });
  });

  describe("DELETE /:id", () => {});
});
