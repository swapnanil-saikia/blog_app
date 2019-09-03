var methodOverride=require("method-override");
var express=require("express");
var expressSanitizer=require("express-sanitizer");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
mongoose.connect("mongodb://localhost/restful_blog_app")
    .then(console.log("database connected"));
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
var blogSchema=new mongoose.Schema(
    {
        title:String,
        image:String,
        body:String,
        created:{type:Date,default:Date.now}

    }
);
var Blog=mongoose.model("Blog",blogSchema);
// Blog.create({
//     title: "cricket",
//     image: "https://media.gettyimages.com/photos/cricket-batsman-hitting-ball-during-cricket-match-in-stadium-picture-id518022060?s=612x612",
//     body: "cricket is a sports"
// });
app.get("/",function(req,res)
{
    
    res.redirect("/blogs");
});
app.get("/blogs",function(req,res)
{
    Blog.find({},function(err,blogs){
        if(err){
            console.log("err");
        }else{
            
        
    
     res.render("index.ejs",{blogs:blogs});}});});

    app.get("/blogs/new",function(req,res)
    {
        res.render("new.ejs");
    });
    app.post("/blogs",function(req,res){
        
        Blog.create(req.body.blog,function(err,newBlog){
            if(err)
            {
                res.render("new.ejs");
            }
            else{
                res.redirect("/blogs");
            }
        });
    });
    app.get("/blogs/:id",function(req,res){
        Blog.findById(req.params.id,function(err,foundBlog)
        {
            if(err){
                res.redirect("/blogs");
            }else{
                res.render("show",{blog:foundBlog});
            }
        });
    });
    app.get("/blogs/:id/old",function(req,res)
    {
        Blog.findById(req.params.id,function(err,foundBlog)
        {
            if(err)
            {
                res.redirect("/blogs");
            }else
            {
                res.render("old.ejs",{blog:foundBlog});
            }
        });
    

    });
    app.put("/blogs/:id",function(req,res){
        // req.body.blog.body=req.sanitizer(req.body.blog.body);
        Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog)
        {
            if(err)
            {
                res.redirect("/blogs");
            }
            else{
                res.redirect("/blogs/" + req.params.id);
            }
        });
    });
    app.delete("/blogs/:id",function(req,res){
        Blog.findByIdAndRemove(req.params.id,function(err)
        {
            if(err)
            {
                res.redirect("/blogs");
            }else{
                res.redirect("/blogs");
            }
        });
    });
     app.listen(9000,function(){
         console.log("hi there");
     });