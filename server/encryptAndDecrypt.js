const crypto = require('crypto');
const fs = require('fs');
const config=require('./config')

const { secret_key, secret_iv, ecnryption_method } = config

if (!secret_key || !secret_iv || !ecnryption_method) {
  throw new Error('secretKey, secretIV, and ecnryptionMethod are required')
}

// Generate secret hash with crypto to use for encryption
const key = crypto
  .createHash('sha512')
  .update(secret_key)
  .digest('hex')
  .substring(0, 32)
const encryptionIV = crypto
  .createHash('sha512')
  .update(secret_iv)
  .digest('hex')
  .substring(0, 16)

  const encryptFile = (filePath) => {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }
    
        const cipher = crypto.createCipheriv('aes-256-cbc', key, encryptionIV);
        const encryptedData = Buffer.from(cipher.update(data, 'utf8', 'hex') + cipher.final('hex')).toString('base64');
    
        fs.writeFile(filePath, encryptedData, (err) => {
          if (err) {
            console.log(err);
            reject(err);
            return;
          }
    
          console.log("File written successfully\n");
          console.log("The written has the following contents:");
          console.log(fs.readFileSync(filePath, "utf8"));
    
          resolve(encryptedData);
        });
      });
    });
  };
  


const decryptFile = (filePath) => {
  
  return new Promise((resolve, reject) => {
   fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      const buff = Buffer.from(data, 'base64')
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, encryptionIV)
      const decryptedData=decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
      decipher.final('utf8')
  
  
      fs.writeFile(filePath,decryptedData, (err) => {
          if (err)
            console.log(err);
          else {
            console.log("File written successfully\n");
            console.log("The written has the following contents:");
            console.log(fs.readFileSync(filePath, "utf8"));
            resolve(decryptedData)
          }
        });
       
      })
     /*  console.log(data); */
    });
}


module.exports={encryptFile}
module.exports.dec={decryptFile}