var CampGround = require("../models/campground");
var Comment    = require("../models/comment");
var middlewareObjects = {};

middlewareObjects.campgroundOwnerAuth = function(req,res,next){
	if(req.isAuthenticated()){
		CampGround.findById(req.params.id,function(err,foundCampground){
			if(err){
				req.flash("error","Campground not found")
				res.redirect("back");
			}else{
				if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){    // matching ID's
					next();
				}else{
					req.flash("error","You are not authorized")
					res.redirect("back");
				}
			}
		});
	}else{
		req.flash("error","You need to be logged in first")
		res.redirect("/login");
	}
}


middlewareObjects.commentOwnerAuth = function(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id,function(err,foundComment){
			if(err){
				req.flash("error","Comment not found");
				res.redirect("back");
			}else{
				if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){    // matching ID's
					next();
				}else{
					req.flash("error","You are not authorized");
					res.redirect("back");
				}
			}
		});
	}else{
		req.flash("error","Please Login First");
		res.redirect("/login");
	}
}

middlewareObjects.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","Please Login First !!!");
	res.redirect("/login");
}


module.exports = middlewareObjects;