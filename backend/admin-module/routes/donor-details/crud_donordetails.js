var express = require('express');
var router = express.Router();
const donor = require('../../database/models/donor-model')

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

// Find a donor by ID
router.get('/:id', async (req, res) => {
  const donorId = req.params.id;
  try {
    const foundDonor = await donor.findOneById(donorId);
    if (foundDonor) {
      res.json(foundDonor);
    } else {
      res.status(404).json({ message: 'Donor not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching donor' });
  }
});

// Update a donor
router.put('/:id', async (req, res) => {
  const donorId = req.params.id;
  const donorUpdates = req.body;
  try {
    const updatedDonor = await donor.update(donorId, donorUpdates);
    if (updatedDonor) {
      res.res.status(201).json(updatedDonor);
    } else {
      res.status(404).json({ message: 'Donor not found or update failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating donor' });
  }
});

// Delete a donor
router.delete('/:id', async (req, res) => {
  const donorId = req.params.id;
  try {
    const deletionSuccess = await donor.delete(donorId);
    if (deletionSuccess) {
      res.status(204).send(); // No content to return on successful deletion
    } else {
      res.status(404).json({ message: 'Donor not found or deletion failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting donor' });
  }
});


module.exports = router;