var express = require('express');
var router = express.Router();
const admin = require('../../database/models/admin-model');

router.post('/', async (req, res) => {
    try {
      const newAdmin = await admin.create(req.body);
      res.status(201).json(newAdmin);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating admin' });
    }
  });

router.get('/', async (req, res) => {
  try {
    const admins = await admin.findAll();
    res.json(admins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching admins' });
  }
});


module.exports = router;