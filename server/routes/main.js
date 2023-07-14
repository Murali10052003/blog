const express=require('express');
const router = express.Router();
const Post =require("../models/Post");




router.get('',async(req,res) =>{
  try {
    const locals ={
        title: "Mals Blog",
        description:"Blog created using mongodb express and nodejs"
    }


    let perPage=5;
    let page= req.query.page || 1;

    const data=await Post.aggregate([{ $sort :{ createAt : -1}}])
    .skip(perPage * page -perPage)
    .limit(perPage)
    .exec();
    const count =await Post.count();
    const nextPage = parseInt(page) +1;
    const hasNextpage =nextPage <=Math.ceil(count /perPage);


      
      res.render('index',{
        locals,
        data,
        current: page,
        nextPage : hasNextpage ? nextPage : null
      });
    } catch (error) {
      console.log(error);
      
      
    }




   
})

router.get('/post/:id', async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    const locals = {
      title: "data.title",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    }
    

    res.render('Post', { 
      locals,
      data,
      currentRoute: `/post/${slug}`
      
    });
  } catch (error) {
    console.log(error);
  }

});  
router.post('/search', async (req, res) => {
  try {
    const locals = {
      title: "Seach",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
        { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
      ]
    });

    res.render("search", {
      data,
      
    });

  } catch (error) {
    console.log(error);
  }

});





router.get('about', (req,res) =>{
    res.render("about");
})



module.exports = router;