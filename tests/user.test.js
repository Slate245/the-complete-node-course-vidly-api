const { User } = require("../models/user");
const jwt = require("jsonwebtoken");

describe("generateAuthToken", () => {
  it("should generate a valid json web token with given payload", () => {
    jwt.sign = jest.fn().mockReturnValue("a");

    const user = new User();
    const token = user.generateAuthToken();

    expect(jwt.sign).toHaveBeenCalled();
  });
});
