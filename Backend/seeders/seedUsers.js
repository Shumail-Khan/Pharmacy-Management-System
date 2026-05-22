const mongoose = require("mongoose");

const dotenv = require("dotenv");

const User = require("../src/models/User");

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const seedUsers = async () => {
  try {
    await User.deleteMany();

    await User.create([
      {
        name: "System Admin",
        email: "admin@pharmacy.com",
        password: "Admin123",
        role: "admin",
      },

      {
        name: "Reception Desk",
        email: "reception@pharmacy.com",
        password: "Reception123",
        role: "receptionist",
      },

      {
        name: "Manager",
        email: "manager@pharmacy.com",
        password: "Manager123",
        role: "manager",
      },
    ]);

    console.log("Users seeded");

    process.exit();
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};

seedUsers();