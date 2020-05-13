var express    = require("express");
var router     = express.Router();
var CampGround = require("../models/campground");
var Comment    = require("../models/comment");
var middleware = require("../middleware");

router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn,function(req,res){
	
	
	CampGround.findById(req.params.id,function(err,foundcampGround){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new",{campground:foundcampGround});
		}
	});	
});


router.post("/campgrounds/:id/comments",middleware.isLoggedIn,function(req,res){
	CampGround.findById(req.params.id,function(err,campground){
		if(err){
			req.flash("error","Campground not found");
			res.redirect("/campgrounds");
		}else{
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					console.log(err);
				}else{
					// for associating comment and user
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					// pushing comment into the campgrounds database
					campground.comments.push(comment);
					campground.save();
					req.flash("success","Comment added successfully !!!");
					res.redirect("/campgrounds/" + campground._id);
				}
			})
		}
	})
});


// edit comment route (show edit form)
router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.commentOwnerAuth,function(req,res){
	Comment.findById(req.params.comment_id,function(err,foundComment){
		if(err){
			req.flash("error","Comment not found");
			res.redirect("back");
		}else{
			res.render("comments/edit",{campground_id: req.params.id, comment:foundComment});
		}
	});
});

//update the comment which has been editted
router.put("/campgrounds/:id/comments/:comment_id",middleware.commentOwnerAuth,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
		if(err){
			req.flash("error","Couldn't update the comment");
			res.redirect("back");
		}else{
			req.flash("success","Comment updated successfully !!!");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


//delete route for comments
router.delete("/campgrounds/:id/comments/:comment_id",middleware.commentOwnerAuth,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			req.flash("error","Couldn't Delete the comment");
			res.redirect("back");
		}else{
			req.flash("success","Comment Deleted successfully !!!");
			res.redirect("back");
		}
	})
});



module.exports = router;