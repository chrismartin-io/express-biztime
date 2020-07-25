// connect to right DB --- set before loading db.js
process.env.NODE_ENV = "test";

// npm packages
const request = require("supertest");

// app imports
const app = require("../app");
const db = require("../db");
const companies = require("../routes/companies");

// let testCompany;
let testCompanies;


beforeEach(async function (done) {
  // let result = await db.query(`
  // INSERT INTO
  // companies (code) VALUES ('rithm')
  // RETURNING code`);

  let companies = await db.query(`
  SELECT * FROM companies`);

  testCompanies = companies.rows;
  // testCompany = result.rows[0];
  done();
});


describe("GET /companies", function () {
  test("Gets a list of all companies", async function () {
    const response = await request(app).get('/companies');
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      "companies": testCompanies
    });
  })
})

describe("CREATE /companies", function() {
  test("Creates a new company", async function() {
    const response = await request(app)
    .post('/companies')
    .send({
      code: "new",
      name: "new company",
      description: "terrible new company"
    });

    console.log('RESPONSE IS', response);

    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual({
      company: { code: "new", name: "new company", description: "terrible new company" }
    });
  });
});


// afterEach(async function () {
//   // delete any data created by test
//   await db.query("DELETE rithm FROM companies");
// });

afterAll(async function () {
  // close db connection
  await db.end();
});