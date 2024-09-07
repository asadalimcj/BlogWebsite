//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
var _ = require("lodash");
const ejs = require("ejs");
const mongoose = require("mongoose");


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const app = express();
var AllPost;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/blogDb");


const blogschema = new mongoose.Schema({
  title: String,
  content: String
});

const blog = mongoose.model("blog", blogschema);

app.get("/", function(req, res){
  blog.find({})
    .then(posts => {
      AllPost = posts;
      res.render("home", { content: homeStartingContent, postdata: posts });
    })
    .catch(err => {
      console.error('Error fetching posts:', err);
      res.status(500).send('Error fetching posts');
    });
});


app.get("/about", function(req, res){
  res.render("about", {aboutcontent:aboutContent})
});

app.get("/contact", function(req, res){
  res.render("contact", {contactc:contactContent})
});


app.get("/compose", function(req, res){
  res.render("compose");
});


app.get("/posts/:postname",function(req, res){
  var postname = _.lowerCase(req.params.postname);
  AllPost.forEach(function(element){
    if(_.lowerCase(element._id) === postname)
      {
        res.render("post", {postname:element.title, postcontent:element.content});
      }
  });
});


app.post("/compose", function(req, res){
  const postdata = {
    title: req.body.postTitle,
    content: req.body.postcontent
  };
  var newblog = blog(postdata);
  newblog.save();
  res.redirect("/");
});










app.listen(8500, function() {
  console.log("Server started on port 3000");
});
