const fs = require('fs');
const axios = require('axios');
const cloudinary=require('../authontication/cloudniary');


async function downloadImage(url, path) {
    const writer = fs.createWriteStream(`./uploads/${path}.jpg`);

    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

async function deleteLocalFile(filePath) {
    setTimeout(async () => {
        try {
            await fs.promises.unlink(filePath);
            console.log(`File ${filePath} deleted successfully`);
        } catch (error) {
            console.error(`Error deleting file ${filePath}:`, error);
            throw error;
        }
    }, 30000);
}

function deletshedul(public_id){
    cloudinary.uploader.destroy(public_id, function(error, result) {
        if (error) {
            console.error(error);
        } else {
            console.log(result); 
        }
    });
  }

module.exports = {
    downloadImage,
    deleteLocalFile,
    deletshedul
};
