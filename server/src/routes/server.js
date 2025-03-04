const express = require('express');
const userRoutes = require('../routes/userRoutes');
const adminRoutes = require('../routes/adminRoutes');

const app = express();
app.use(express.json());

app.use('/users', userRoutes);
app.use('/admin', adminRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));
