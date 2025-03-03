const { User } = require('../models');

exports.updateUserRole = async (req, res) => {
  const { userId, role } = req.body;
  if (!['admin', 'user'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save();
    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

