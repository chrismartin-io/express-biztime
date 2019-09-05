const express = require("express");
const router = new express.Router();
const ExpressError = require("../app")


// Connect db
const db = require("../db");



// Return list of companies

router.get('/', async function (req, res, next) {
  try {
    const results = await db.query(
      'SELECT * FROM companies');

    return res.json({
      'companies': results.rows
    });
  } catch (err) {
    return next(err);
  }
});


// Return company

router.get('/:code', async function (req, res, next) {

  try {
    const code = req.params.code;
    const companyResults = await db.query(
      `SELECT * FROM companies 
      WHERE code = $1`, [code]);

    const invoicesResults = await db.query(
      `SELECT * FROM invoices
        WHERE comp_code = $1`, [code]
    )

    if (companyResults.rowCount < 1) {
      return next();
    }

    companyResults.rows[0].invoices = invoicesResults.rows

    return res.json({
      'company': companyResults.rows[0]
    })
  } catch (err) {
    return next(err);
  }
});


// Create new company

router.post('/', async function (req, res, next) {
  try {
    const {
      code,
      name,
      description
    } = req.body;

    const result = await db.query(
      `INSERT INTO companies (code, name, description)
      VALUES ($1, $2, $3)
      RETURNING code, name, description`,
      [code, name, description]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
});


// Update company

router.put('/:code', async function (req, res, next) {

  try {
    const {
      name,
      description
    } = req.body;

    const result = await db.query(
      `UPDATE companies SET
      name=$2, description=$3
      WHERE code=$1
      RETURNING code, name, description`,
      [req.params.code, name, description]
    );

    return res.json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
});


// Delete company

router.delete('/:code', async function (req, res, next) {

  try {
    const result = await db.query(
      `DELETE FROM companies
      WHERE code = $1`,
      [req.params.code]
    );

    return res.json({
      message: 'Deleted'
    });
  } catch (err) {
    return next(err);
  }
});




// Export

module.exports = router;