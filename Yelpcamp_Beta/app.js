var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
	mongoose       = require("mongoose"),
	CampGround     = require("./models/campground"),
	passport       = require("passport"),
	flash          = require("connect-flash"),
	LocalStrategy  = require("passport-local"),
	methodOverride = require("method-override"),
	User           = require("./models/user"),
	Comment        = require("./models/comment");

var commentRoutes    = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes      = require("./routes/index");

//var	seedDB        = require("./seeds");        // for seeding database
//seedDB();




mongoose.connect("mongodb://localhost:27017/yelp_camp_beta_v2",{ useNewUrlParser: true,useUnifiedTopology: true,useFindAndModify:false});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(flash());
app.use(express.static("public"));
app.use(methodOverride("_method"));


// passport configration

app.use(require("express-session")({
	secret: "Dragon Armament",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
	app.locals.moment = require("moment");
	res.locals.msg = req.flash("msg");
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	res.locals.currentUser = req.user;
	next();
});

app.use(commentRoutes);
app.use(campgroundRoutes);
app.use(indexRoutes);

app.listen(3000,function(){
	console.log("yelpcamp server started at port 3000");
});