const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: false,
      max: 32,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    hashed_password: {
      type: String,
      // required: true,
    },
    salt: String,
    role: {
      type: String,
      default: "subscriber",
    },
    mobileNumber: {
      type: String,
      default: "",
    },
    otp: String,
    emailOtp: String,
    resetPasswordLink: {
      type: String,
      default: "",
    },
    // Reference to delivery addresses
    deliveryAddresses: {
      firstname: String,
      lastname: String, // Assuming lastname should be String
      phone: String,
      state: String,
      address: String,
      city: String,
      postalCode: String,
      country: String,
      apartment: String,
    },

    // Reference to user's installed apps
    userApps: [String],
    virtualMachines: [
      {
        vmName: String,
        cpuCount: Number,
        memoryGB: Number,
      },
    ],

    profilePictureUrl: {
      type: String,
      default: null,
    },
    // Reference to user's orders
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    // Payment details and validity
    paymentDetails: {
      planName: String,
      paymentId: String,
      paymentStatus: String,
      paymentValidity: Date,
      receipt: String,
      amount: Number,
    },
    isHashed: {
      type: Boolean,
      default: false,
    },
    // favorites: [{ type: String }], 
    // filenames: [{ type: String }],
  },
  { timestamps: true, versionKey: false } // Corrected line
  
);

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    if (!this.salt) {
      this.salt = this.makeSalt();
    }
    if (!this.isHashed) {
      this.hashed_password = this.encryptPassword(password);
    }
    this.isHashed = true;
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },

  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
};

// Now add a pre-save hook to only hash if isHashed is false
userSchema.pre("save", function (next) {
  if (!this.isHashed) {
    this.hashed_password = this.encryptPassword(this.hashed_password);
    this.isHashed = true;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
// module.exports = User = mongoose.model("User", UserSchema);
