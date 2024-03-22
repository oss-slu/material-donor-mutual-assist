var express = require('express');
var router = express.Router();
const donor = require('../../../database/models/donor-model')

router.post('/', async (req, res) => {
    try {
      const newDonor = await donor.create(req.body);
      res.status(201).json(newDonor);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating admin' });
    }
  });

router.get('/', async (req, res) => {
  try {
    const donors = await donor.findAll();
    res.json(donors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching admins' });
  }
});


module.exports = router;