const mongoose = require("mongoose");

// this will make a default object structure
const campGroundSchema = new mongoose.Schema({
	name: String,
	price: String,
	Image: String,
	description: String,
	likes:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}],
	createdAt: {type: Date,default: Date.now},
	author:{
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments:[
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		} 
	]
});
module.exports = mongoose.model("CampGround", campGroundSchema);