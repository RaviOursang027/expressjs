const mongoose = require("mongoose");
const crypto = require("crypto");

const TempUserSchema = new mongoose.Schema({
  tempID: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  hashed_password: {
    // This should be a hashed password
    type: String,
    required: true,
  },
  salt: String,

  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: "10m" }, // this will make sure the data expires after 10 minutes
  },
  isHashed: {
    type: Boolean,
    default: false,
  },
});

TempUserSchema.virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
    this.isHashed = true; // Set isHashed flag to true here
  })
  .get(function () {
    return this._password;
  });

TempUserSchema.methods = {
  // ... (same methods as in your User schema)
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

TempUserSchema.pre("save", function (next) {
  if (!this.isHashed) {
    this.hashed_password = this.encryptPassword(this.hashed_password);
    this.isHashed = true;
  }
  next();
});

const TempUser = mongoose.model("TempUser", TempUserSchema);

module.exports = TempUser;
