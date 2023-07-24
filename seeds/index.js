const mongoose = require("mongoose");
const axios = require("axios");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

try {
  mongoose.connect("mongodb://127.0.0.1:27017/yelpcamp");
} catch (error) {
  handleError(error);
}

const db = mongoose.connection;
db.on("error", (err) => {
  logError(err);
});
db.once("open", () => {
  console.log("database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

// call unsplash and return small image
async function seedImg() {
  try {
    const resp = await axios.get("https://api.unsplash.com/photos/random", {
      params: {
        client_id: "API_KEY",
        collections: 1114848,
      },
    });
    return resp.data.urls.small;
  } catch (err) {
    console.error(err);
  }
}

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 2; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      image: await seedImg(),
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam, ipsum a. Doloremque velit quos beatae, exercitationem porro quisquam voluptas? Quisquam quo tenetur deserunt iusto, perferendis placeat maxime officia aliquid quidem!",
      price: `${price}`,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
