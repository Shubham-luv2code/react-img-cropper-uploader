const mongoose = require('mongoose');
const images = mongoose.model('images');

module.exports = (app) => {

  app.post(`/api/croppedImage`, async (req, res) => {
    let image = await images.create(req.body);
    return res.status(201).send({
      error: false,
      image
    })
  });
  app.get(`/api/getImages/:id`, async (req, res) => {
    var id = req.params.id;
    let fetchedImages = await images.find({'_id':id});
    return res.status(200).send(fetchedImages);
  });

}
