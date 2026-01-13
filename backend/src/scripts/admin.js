const User = require("../models/user");

const createAdminAccount = async () => {
    try {
        const adminEmail = "admin@gmail.com";
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (!existingAdmin) {
            const admin = new User({
                name: "Admin",
                email: "2305mayurigaikwad@gmail.com",
                firebaseUid: "2NbZXw5iOoawxjuYhP64uhwfLkP2", // Ensure this field is present
                role: "admin",
                isApproved: true // Admin is pre-approved
            });

            await admin.save();
            console.log("Admin account created successfully.");
        } else {
            console.log("Admin already exists.");
        }
    } catch (error) {
        console.error("Error creating admin account:", error.message);
    }
};

module.exports = createAdminAccount;