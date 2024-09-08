const { Schema } = require("mongoose");

const userSchema = new Schema({
  firstName: {
    type: String,
    default: "",
    trim: true,
  },
  lastName: {
    type: String,
    default: "",
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  fullName: {
    type: String,
    get: function () {
      return `${this.firstName} ${this.lastName}`;
    },
  },
  options: { timestamps: true },
});

// userSchema.virtual("fullName").get(function () {
//   return `${this.firstName} ${this.lastName}`;
// });

module.exports = mongoose.model("User", userSchema);
