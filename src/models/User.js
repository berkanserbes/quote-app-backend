const { Schema, default: mongoose } = require("mongoose"); // mongoose'ü doğru bir şekilde içe aktarın

const userSchema = new Schema(
  {
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
    image: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    favoriteQuotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Quote",
      },
    ],
    fullName: {
      type: String,
      get: function () {
        return `${this.firstName} ${this.lastName}`;
      },
    },
  },
  { timestamps: true }
);

// userSchema.virtual("fullName").get(function () {
//   return `${this.firstName} ${this.lastName}`;
// });

module.exports = mongoose.model("User", userSchema);
