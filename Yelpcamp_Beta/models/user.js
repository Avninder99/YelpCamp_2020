var mongoose              = require("mongoose"),
	passportLocalMongoose = require("passport-local-mongoose");

UserSchema = new mongoose.Schema({
	username: String,
	password: String,
	firstName: String,
	lastName: String,
	email: String,
	resetPasswordToken: String,
	resetPasswordExpires: Date,
	avatar: String,
	isAdmin: {type: Boolean ,default: false}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);