const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// IMPORT MODELS
require('./models/ImagesSchema');

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || `mongodb://localhost:27017/server-app`);

app.use(bodyParser.json());
//IMPORT ROUTES
require('./routes/imageRoutes')(app);
const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`)
});
