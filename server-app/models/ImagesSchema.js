const mongoose = require('mongoose');
const {Schema} = mongoose;

const imageSchema = new Schema({
    imageName: String,
    imageData: String,
    imageObj: Object,
    srcImage: String
})

mongoose.model('images', imageSchema);
