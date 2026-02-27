const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");  

 const MONGO_URL = "mongodb+srv://sonukumar341d_db_user:NwOCslsFx6j8MI6e@cluster0.vkguktk.mongodb.net/wanderlust?retryWrites=true&w=majority";
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  try {

    await Listing.deleteMany({});
    console.log("Old listings deleted");

    let ownerId = "69849c8ebd64ff97b58c87fe"; 
    
    const anyUser = await User.findOne();
    if (anyUser) {
      ownerId = anyUser._id;
      console.log("Found user with ID:", ownerId);
    } else {
      console.log("No user found, using default ID");
    }

    initData.data = initData.data.map((obj) => ({
      ...obj, 
      owner: ownerId
    }));

    await Listing.insertMany(initData.data);
    console.log("data was initialized with", initData.data.length, "listings");
    
    const count = await Listing.countDocuments();
    console.log("Total listings in DB now:", count);
    
    process.exit(0);
    
  } catch (err) {
    console.error("Error initializing data:", err);
    process.exit(1);
  }
};

initDB();