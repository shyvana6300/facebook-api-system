const request = require('supertest');
const app = require('../../app');
const connectDB = require("../../dbconnector");

describe("Test the root path", () => {
    test("It should response the GET method", done => {
      request(app)
        .get("/")
        .then(response => {
          expect(response.statusCode).toBe(200);
          done();
        });
    });
  });

  describe("Test the register path", () => {
    beforeAll(() => {
        connectDB();
    });
    test("It should response the account created", done => {
      request(app)
        .post("/account/register").send({ 
            email: "testgma1il@gmail.com", 
            password: "testpassword" 
          })
        .then(response => {
          expect(response.statusCode).toBe(201);
          done();
        });
    });
  });