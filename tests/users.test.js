const request = require("supertest");

const app = require("../src/app");

const database = require("../database")

afterAll(() => database.end());

describe("GET /api/users", () => {
  it("should return all users", async () => {
    const response = await request(app).get("/api/users");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });
});

describe("GET /api/users/:id", () => {
  it("should return one user", async () => {
    const response = await request(app).get("/api/users/1");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });

  it("should return no user", async () => {
    const response = await request(app).get("/api/users/0");

    expect(response.status).toEqual(404);
  });
});

const crypto = require("node:crypto");

describe("POST /api/users", () => {
  it("should return created user", async () => {
    const newUser = {
      firstname: "Harry",
      lastname: "Potter",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Hogwarts",
      language: "English",
    };

    const response = await request(app).post("/api/users").send(newUser);

    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty("id");
    expect(typeof response.body.id).toBe("number");

    const [result] = await database.query(
      "SELECT * FROM users WHERE id=?",
      response.body.id
    );

    const [userInDatabase] = result;

    expect(userInDatabase).toHaveProperty("id");

    expect(userInDatabase).toHaveProperty("firstname");
    expect(userInDatabase).toHaveProperty("lastname");
    expect(userInDatabase).toHaveProperty("email");
    expect(userInDatabase).toHaveProperty("city");
    expect(userInDatabase).toHaveProperty("language");

    expect(userInDatabase.firstname).toStrictEqual(newUser.firstname);
    expect(userInDatabase.lastname).toStrictEqual(newUser.lastname);
    expect(userInDatabase.email).toStrictEqual(newUser.email);
    expect(userInDatabase.city).toStrictEqual(newUser.city);
    expect(userInDatabase.language).toStrictEqual(newUser.language);

  });


  it("should return an error", async () => {
    const userWithMissingProps = { firstname: "Harry" };

    const response = await request(app)
      .post("/api/users")
      .send(userWithMissingProps);

    expect(response.status).toEqual(422);
  });

  it("should return an error", async () => {
    const userWithMissingProps = { lastname: "Potter" };

    const response = await request(app)
      .post("/api/users")
      .send(userWithMissingProps);

    expect(response.status).toEqual(422);
  });

  it("should return an error", async () => {
    const userWithMissingProps = { email: `${crypto.randomUUID()}@wild.co` };

    const response = await request(app)
      .post("/api/users")
      .send(userWithMissingProps);

    expect(response.status).toEqual(422);
  });

  it("should return an error", async () => {
    const userWithMissingProps = { city: "London" };

    const response = await request(app)
      .post("/api/users")
      .send(userWithMissingProps);

    expect(response.status).toEqual(422);
  });

  it("should return an error", async () => {
    const userWithMissingProps = { language: "Spanish" };

    const response = await request(app)
      .post("/api/users")
      .send(userWithMissingProps);

    expect(response.status).toEqual(422);
  });

});

describe("PUT /api/users", () => {
  it("should edit user", async () => {
    const newUser = {
      firstname: "Harry",
      lastname: "Potter",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Hogwarts",
      language: "English",
    };

const [resultUser] = await database.query("INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
[newUser.firstname, newUser.lastname, newUser.email, newUser.city, newUser.language])

const id = resultUser.insertId;

const updateUser = {
  firstname: "Maria",
  lastname: "Porter",
  email: `${crypto.randomUUID()}@wild.co`,
  city: "Los Angeles",
  language: "Spanish",
}
const response = await request(app)
.put(`/api/users/${id}`)
.send(updateUser);

expect(response.status).toEqual(204);

const [result] = await database.query("SELECT * FROM users WHERE id=?", id);

    const [userInDatabase] = result;

    expect(userInDatabase).toHaveProperty("id");

    expect(userInDatabase).toHaveProperty("firstname");
    expect(userInDatabase.firstname).toStrictEqual(updateUser.firstname);

    expect(userInDatabase).toHaveProperty("lastname");
    expect(userInDatabase.lastname).toStrictEqual(updateUser.lastname);

    expect(userInDatabase).toHaveProperty("email");
    expect(userInDatabase.email).toStrictEqual(updateUser.email);

    expect(userInDatabase).toHaveProperty("city");
    expect(userInDatabase.city).toStrictEqual(updateUser.city);

    expect(userInDatabase).toHaveProperty("language");
    expect(userInDatabase.language).toStrictEqual(updateUser.language);

  });

  it("should return an error", async () => {
    const userWithMissingProps = { firstname: "Arthur" };

    const response = await request(app)
      .put(`/api/users/1`)
      .send(userWithMissingProps);

    expect(response.status).toEqual(422);
  });

  it("should return an error", async () => {
    const userWithMissingProps = { lastname: "James" };

    const response = await request(app)
      .put(`/api/users/1`)
      .send(userWithMissingProps);

    expect(response.status).toEqual(422);
  });

  it("should return an error", async () => {
    const userWithMissingProps = { email:`${crypto.randomUUID()}@wild.co`};

    const response = await request(app)
      .put(`/api/users/1`)
      .send(userWithMissingProps);

    expect(response.status).toEqual(422);
  });

  it("should return an error", async () => {
    const userWithMissingProps = { city: "Paris" };

    const response = await request(app)
      .put(`/api/users/1`)
      .send(userWithMissingProps);

    expect(response.status).toEqual(422);
  });

  it("should return an error", async () => {
    const userWithMissingProps = { language: "French" };

    const response = await request(app)
      .put(`/api/users/1`)
      .send(userWithMissingProps);

    expect(response.status).toEqual(422);
  });

  it("should return no user", async () => {
    const newUser = {
      firstname: "Maria",
  lastname: "Porter",
  email: `${crypto.randomUUID()}@wild.co`,
  city: "Los Angeles",
  language: "Spanish",
    };

    const response = await request(app).put("/api/users/0").send(newUser);

    expect(response.status).toEqual(404);
  });
  
});