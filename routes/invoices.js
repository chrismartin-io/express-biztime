const express = require("express");
const router = new express.Router();
const ExpressError = require("../app")


// Connect db
const db = require("../db");



router.get('/', async function (req, res, next) {
  try {
    const results = await db.query(
      'SELECT * FROM invoices');

    return res.json({
      'invoices': results.rows
    });
  } catch (err) {
    return next(err);
  }
});



router.get('/:id', async function (req, res, next) {

  try {

    const invoiceId = req.params.id;
    const invoiceResult = await db.query(
      `SELECT * FROM invoices 
      WHERE id = $1`, [invoiceId]);
      
    const companyResult = await db.query(
      `SELECT * FROM companies
      WHERE code = $1`, [invoiceResult.rows[0].comp_code]);
  
    console.log(companyResult)

    if (companyResult.rowCount < 1) {
      return next();
    }

    invoiceResult.rows[0].company = companyResult.rows[0]
    delete invoiceResult.rows[0].comp_code 

    return res.json({
      'invoice': invoiceResult.rows[0]
    })
  } catch (err) {
    return next(err);
  }
});



router.post('/', async function (req, res, next) {

  try {
    const {
      comp_code,
      amt
    } = req.body;
    
    const result = await db.query(
      `INSERT INTO invoices (comp_code, amt)
      VALUES ($1, $2)
      RETURNING id, comp_code, amt, paid, add_date, paid_date`,
      [comp_code, amt]
    );
    console.log(result)
    return res.status(201).json(result.rows[0]);

  } catch (err) {
    return next(err);
  }
});

router.put('/:id', async function (req, res, next) {

  try {
    const {
     amt
    } = req.body;

    const {
      id
    } = req.params

    const result = await db.query(
      `UPDATE invoices SET
      amt=$2
      WHERE id=$1
      RETURNING id, comp_code, amt, paid, add_date, paid_date`,
      [id, amt]
    );

    return res.json(result.rows[0]);
    
  } catch (err) {
    return next(err);
  }
});


router.delete('/:id', async function (req, res, next) {

  try {
    const result = await db.query(
      `DELETE FROM invoices
      WHERE id = $1`,
      [req.params.id]
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