const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require('method-override');
const mongoose = require("mongoose");
const { title } = require("process");
const { type } = require("os");

app.set("view engine", "ejs");
app.set("VIEWS", path.join(__dirname, "VIEWS"));
app.use(express.static(path.join(__dirname, "PUBLIC")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));


app.listen(3071, (req, res)=>{
    console.log("connected");
});

const MONOGO_URL = "mongodb://localhost:27017/new";

main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
   console.log(err);
})

async function main(){
    await mongoose.connect(MONOGO_URL);
};

const postschema = new mongoose.Schema({
    title:{
        type:String
    },
    content:{
        type:String
    }

});

const posts = mongoose.model("post", postschema);

app.get("/", async (req, res)=>{
    const post = await posts.find({});
    res.render("index.ejs",{post});
});

app.delete("/post/:id", async (req, res)=>{
      const {id} = req.params;
      await posts.findByIdAndDelete(id)
      console.log("post deleted")
      res.redirect("/");
})
app.get("/post/:id/edit", async (req, res)=>{
    const {id} = req.params;
   const post = await posts.findById(id);
   res.render("edit.ejs", {post});
});
app.put("/post/:id", async(req, res)=>{
    const {id} = req.params;
    await posts.findByIdAndUpdate(id,{...req.body.postss});
    res.redirect("/") 
});

app.get("/post/new",(req, res)=>{

    res.render("new.ejs");

})

app.post("/post", async(req, res)=>{
    const p1 = await new posts({...req.body.posts});
    p1.save();
    res.redirect("/");
})

