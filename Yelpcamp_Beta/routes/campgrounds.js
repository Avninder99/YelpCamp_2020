const express    = require("express"),
	  router     = express.Router(),
	  CampGround = require("../models/campground"),
	  middleware = require("../middleware").default;

// this page is to view all the campgrounds in database  (Home page)
router.get("/campgrounds",function(req,res){
	CampGround.find({},function(err,campGround){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index",{campgrounds:campGround, currentUser: req.user});
		}
	});
});

// this is connected to form for adding new campground to database (NEW CAMPGROUND ADDING ROUTE)
router.post("/campgrounds",middleware.isLoggedIn,function(req,res){
	var name=req.body.name;
	var Image=req.body.image;
	var description=req.body.description;
	var price=req.body.price;
	var author={
		id: req.user._id,
		username: req.user.username
	}
	var newSite= {name:name,Image:Image,description:description,author:author,price:price};
	CampGround.create(newSite,function(err,newcampGround){
		if(err){
			req.flash("error","Something went wrong");
		}else{
			req.flash("success","Campground added successfuly !!!");
			res.redirect("/campgrounds");
		}
	})
});

// this is for rendering form page for entering new campground
router.get("/campgrounds/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
});

// this is for rendering show page for showing extra info of the campground (Show page)
router.get("/campgrounds/:id",function(req,res){
	CampGround.findById(req.params.id).populate("comments likes").exec(function(err,foundcampGround){
		if(err){
			req.flash("error",err.name + ":invalid Campground id");
			res.redirect("/campgrounds");
		}else if(!foundcampGround){
			req.flash("error","Campground not found");
			res.redirect("/campgrounds");
		}else{
			res.render("campgrounds/show",{campground:foundcampGround});
		}
	});
});

// Edit routes

router.get("/campgrounds/:id/edit",middleware.campgroundOwnerAuth,function(req,res){
	CampGround.findById(req.params.id,function(err,foundCampground){
		res.render("campgrounds/edit",{campground:foundCampground});
	});
});



// Update Routes

router.put("/campgrounds/:id",middleware.campgroundOwnerAuth,function(req,res){
	CampGround.findByIdAndUpdate(req.params.id,req.body.data,function(err,updatedCampground){
		if(err){
			req.flash("error","Couldn't update the Campground");
			res.redirect("/campgrounds");
		}else{
			req.flash("success","Campground updated successfully !!!");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// Delete Routes

router.delete("/campgrounds/:id",middleware.campgroundOwnerAuth,function(req,res){
	CampGround.findByIdAndRemove(req.params.id,function(err){
		if(err){
			req.flash("error","Couldn't Delete the Campground");
			res.redirect("back");
		}else{
			req.flash("success","Campground Deleted successfully !!!");
			res.redirect("/campgrounds");
		}
	})
});



router.post("/campgrounds/:id/like",middleware.isLoggedIn,function(req,res){
	CampGround.findById(req.params.id,function(err,foundCampground){
		if(err){
			req.flash("error","Something went wrong");
			req.redirect("back");
		}else if(!foundCampground){
			req.flash("error","Campground you are trying to like is not found");
			req.redirect("back");
		}else{
			if(foundCampground.likes.some(function(like){
				if(like.equals(req.user._id)){
					return true;	
				}
			})){
				foundCampground.likes.pull(req.user);
				foundCampground.save();
				res.redirect("back");
			}
			else{
				foundCampground.likes.push(req.user);
				foundCampground.save();
				res.redirect("back");	
			}
		}
	})
});

module.exports = router;