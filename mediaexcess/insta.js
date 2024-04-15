const Instagram = require("instagram-web-api");
const cron=require("node-cron");
const FileCookiStore=require("tough-cookie-filestore2");


const instapost = async (imagePath,caption) => {
        const cookistor=new FileCookiStore("./cookies.json");
        const client=new Instagram({
        username:'pratik_patil_026',
        password:'djp1223qq',
        cookistor,
        },{language:"en-US",});


    const instalogin= async()=>{
        await client
            .login()
            .then(()=>{
                console.log('login successfull');
            })
            .catch ((error) =>{
                console.error('Error during loading:' ,error);
            }) 
        try{
            const { media } = await client.uploadPhoto({ photo: imagePath, caption: caption, post: 'feed' });
            console.log(`https://www.instagram.com/p/${media.code}/`);
        }catch (error) {
            console.error('Error during upload:');
        } 
        
    };
    instalogin();
};
module.exports = instapost;