const mongoose = require('mongoose');
require('dotenv').config();
const uri = process.env.MONGO_URI;
console.log('MONGO_URI set:', !!uri);

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => mongoose.connection.db.listCollections().toArray())
  .then(cols => {
    console.log('Collections:', cols.map(c => c.name));
    process.exit(0);
  })
  .catch(err => {
    console.error('Connect error:', err.message);
    process.exit(1);
  });
