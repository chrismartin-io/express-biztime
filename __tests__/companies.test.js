// connect to right DB --- set before loading db.js
process.env.NODE_ENV = "test";

// npm packages
const request = require("supertest");

// app imports
const app = require("../app");
const db = require("../db");
const companies = require("../routes/companies");

let testCompany;
let testCompanies;



beforeEach(async function () {
  let result = await db.query(`
  SELECT * FROM companies
  `)
//   console.log('HERE IS OUR CONSOLE', result)
  testCompanies = result.rows
  testCompany = result.rows[0];
});


describe("GET /companies", function () {
  test("Gets a list of all companies", async function () {
    const response = await request(app).get('/companies');
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      "companies": testCompanies
    })
  })
})



// afterEach(async function () {
//   // delete any data created by test
//   await db.query("DELETE FROM companies");
// });

afterAll(async function () {
  // close db connection
  await db.end();
});