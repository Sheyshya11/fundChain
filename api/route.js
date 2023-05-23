// routes.js
const express=require('express')
const {encryptFile} = require('./encryptAndDecrypt')
const {decryptFile}=require('./encryptAndDecrypt').dec


const router = express.Router()

const multer = require('multer')

var storageUpload = multer.diskStorage({
  destination: function (req, file, callback) {
      /* callback(null, './outputfiles/'); */
      callback(null, 'public/EncryptedFiles');
  },
  filename: function (req, file, callback) {
      callback(null, "Encrypted_"+file.originalname);
  }
});

var storageDownload = multer.diskStorage({
  destination: function (req, file, callback) {
      callback(null, 'public/DecryptedFiles');
     

  },
  filename: function (req, file, callback) {
    var str=file.originalname;
      callback(null, str.replace("Encrypted_",""));
  }
});


const upload = multer({ storage: storageUpload })
const download=multer({storage: storageDownload})



router.post('/encrypt', upload.single('encrypted_file'), async (req, res) => {
  const filepath = req.file.path;


  try {
    const encryptedData = await encryptFile(filepath);
    res.setHeader('Content-Type', 'application/json');
  
    res.json(encryptedData );
  } catch (error) {
    console.error(error);
    res.status(500).send('Error encrypting file');
  }
});

router.post('/decrypt', download.single('decrypt_file'), async(req, res) => {
  const filepath = req.file.path;

  try {
    const decryptedData = await decryptFile(filepath);
    res.setHeader('Content-Type', 'application/json');
 
    res.json(decryptedData );
  } catch (error) {
    console.error(error);
    res.status(500).send('Error encrypting file');
  }
 
})

router.get('/',(req,res)=>{
  res.json('Heu im fundChain server')
})



module.exports=router