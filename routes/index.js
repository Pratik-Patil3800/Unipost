const express = require('express');
const router = express.Router();
const multer=require('multer');
const {ensureAuthenticated}=require('../authontication/auth');
const { User, Post }=require('../authontication/user');
const cron=require("node-cron");
const bcrypt = require('bcryptjs');
const fbpost=require('../mediaexcess/facebook');
const twipost=require('../mediaexcess/twitter');
const instapost=require('../mediaexcess/insta');
const cloudinary=require('../authontication/cloudniary');
const {downloadImage , deleteLocalFile , deletshedul}=require('./downloadImage');
router.use(express.json());

router.get('/home',ensureAuthenticated, (req, res) => {
    
    res.render('home', { title: 'home' });
    
  });

router.get('/posts',ensureAuthenticated, async(req, res) => {
    try {
        const scheduledPosts = await Post.find({ scheduledTime: { $gte: new Date() } }).sort({ scheduledTime: 1 });
        res.render('setpost', { title: 'Shedul Post', scheduledPosts }); 
    } catch (error) {
        console.error('Error fetching scheduled posts:', error);
        res.status(500).send('Internal Server Error');
    }
    
  });
router.get('/setting',ensureAuthenticated, (req, res) => {
    res.render('setting', { title: 'setting' });
});

router.post('/setting',ensureAuthenticated, async(req, res)=>{
    try {
        console.log(req.body);
        const user =await req.user;
        
        const { instaid, instapass, fbid, fbpass, twiid, twipass, oldpass, newpass, confirmpass,} = req.body;
        
        if (instaid) {
            user.instaid = instaid;
        }
        if (instapass) {
            user.instapass = instapass;
        }
        if (fbid) {
            user.fbid = fbid;
        }
        if (fbpass) {
            user.fbpass = fbpass;
        }
        if (twiid) {
            user.twiid = twiid;
        }
        if (twipass) {
            user.twipass = twipass;
        }
        let errors=[];
        let shouldRender = true;
        if(oldpass){
            bcrypt.compare(oldpass,user.password,(err,ismatch)=>{
                if(err) throw err;
                if(ismatch){
                    if(newpass !== confirmpass){
                        errors.push({msg:'confermation Password do not match'});
                        shouldRender=false;
                        
                    }
                    if(newpass.length<6){
                        errors.push({msg:'Password should be at list 6 characters'});
                        shouldRender=false;
                    }
                }
                else{
                    errors.push({msg:'Old Password do not match'});
                    shouldRender=false;
                }
                if(errors.length>0){
                    res.render('setting',{
                        errors,
                        oldpass,
                        newpass,
                        confirmpass,
                        title:'setting'
                    });
                    
                    
                }
                else{
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newpass, salt, (err, hash) => {
                          if (err) throw err;
                          user.password = hash;
                          user
                            .save()
                            .then(user => {
                                res.render('setting', { title: 'setting' });
                            })
                            .catch(err => console.log(err));
                        });
                      });
                    
                }
            })
            
        }
        else{
            await user.save();
            res.render('setting', { title: 'setting' });
        }
        
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const storage=multer.diskStorage({
    filename:function(req,file,cb){
        return cb(null,`${Date.now()}-${file.originalname}`);
    }
})

const upload=multer({storage});

router.post('/home',ensureAuthenticated,upload.single("postimg"),(req,res)=>{
    try {
        cloudinary.uploader.upload(req.file.path, async (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: "Error"
                });
            }
            const imgpath = result.public_id;
            const content = req.body.postcomment;
            const fb = req.body.fbCheckbox;
            const insta = req.body.instaCheckbox;
            const twi = req.body.twiCheckbox;
            const user = await req.user;
            const mail = user.email;
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const scheduledTime = `${year}-${month}-${day}`;
            const post = new Post({ content, scheduledTime, imgpath, fb, insta, twi, mail });
            await post.save();
            console.log(imgpath);
            // res.send('Post scheduled successfully!');
            res.render('home', { title: 'home' });
        });
    } catch (error) {
        console.error('Error scheduling post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/posts',ensureAuthenticated,upload.single("postimg"),async(req,res)=>{
    try {
    cloudinary.uploader.upload(req.file.path, async (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: "Error"
                });
            }
            const imgpath = result.public_id;
            const content = req.body.postcomment;
            const fb = req.body.fbCheckbox;
            const insta = req.body.instaCheckbox;
            const twi = req.body.twiCheckbox;
            const User = await req.user;
            const mail = User.email;
            var scheduledTime = req.body.scheduledDate;
            const [year, month, day] = scheduledTime.split('-');
            scheduledTime = `${year}-${month}-${day}`;
            const post = new Post({ content, scheduledTime, imgpath, fb, insta, twi, mail, });
            await post.save();
            // res.send('Post scheduled successfully!');
            const scheduledPosts = await Post.find({ scheduledTime: { $gte: new Date() } }).sort({ scheduledTime: 1 });
            res.render('setpost', { title: 'Shedul Post', scheduledPosts }); 
        });
    } catch (error) {
        console.error('Error scheduling post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/posts/:id', ensureAuthenticated, async (req, res) => {
    Post.findById(req.params.id)
        .then(user => {
            if (user) {
                cloudinary.uploader.destroy(user.imgpath, function(error, result) {
                    if (error) {
                        console.error(error);
                    } else {
                        console.log(result); 
                    }
                });
                
            } else {
            console.log('User not found');
            }
        })
        .catch(error => {
            console.error('Error finding user:', error);
        });
        await Post.findByIdAndDelete(req.params.id);
        
});

cron.schedule('* * * * *', async () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const shortDateString = `${year}-${month}-${day}`;
    const scheduledPosts = await Post.find({ scheduledTime: { $lte: shortDateString } });
    scheduledPosts.forEach(async (post) => {
        const imageUrl = cloudinary.url(post.imgpath);;
        downloadImage(imageUrl,post.imgpath).then(() => {
            console.log('Image downloaded successfully');
            const img=`./uploads/${post.imgpath}.jpg`;
            const caption=post.content;
            if(post.fb){
                fbpost(img,caption);
             }
             if(post.twi){
                 twipost(img,caption);
             }
             if(post.insta){
                 instapost(img,caption);
             }
            deletshedul(post.imgpath);
            deleteLocalFile(img);
        })
        .catch(error => {
            console.error('Error downloading image:', error);
        });
        
      await Post.findByIdAndDelete(post._id);
    });
  });

  

 
module.exports=router;