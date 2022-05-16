require('dotenv').config();
const express = require("express");
var crypto = require('./lib/cryptDes');
var aes256 = require('./aes')
const path = require("path");
const ejs = require("ejs");
const cors = require("cors");

const app = express();
const RSA = require('./rsa');
const DES = require('./des')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home");
});
app.post("/display", (req, res) => {
  const obj = JSON.parse(JSON.stringify(req.body));
  console.log(obj.algo);
  if (obj.algo === 'RSA') {
    
    const encoded_message = RSA.encode(obj.secret);
    const encrypted_message = RSA.encrypt(
      encoded_message,
      process.env.RSA_KEY_N,
      process.env.RSA_KEY_E
    );
    const decrypted_message = RSA.decrypt(encrypted_message, process.env.RSA_KEY_D, process.env.RSA_KEY_N);
    const decoded_message = RSA.decode(decrypted_message);
    obj.n = process.env.RSA_KEY_N
    obj.e =process.env.RSA_KEY_E
    obj.d = process.env.RSA_KEY_D
    obj.e_msg = encrypted_message
    obj.d_msg = decoded_message
    obj.org = obj.secret
    console.log(obj)
  }
  else if (obj.algo === 'AES')
  {
    var key = 'Heisenberg';
    ciphertext = aes256.encrypt(key, obj.secret);
    var decrypted = aes256.decrypt(key, ciphertext);
    obj.e_msg = ciphertext;
    obj.d_msg = decrypted;
    obj.org = obj.secret;

  }
  else if(obj.algo === 'DES')
  {
    var KEY = 'Qssdsdsd';
    var IV = [0x12, 0x34, 0x56, 0x78, 0x90, 0xAB, 0xCD, 0xEF];
    var message = obj.secret;
    obj.org = message;
    var en = crypto.encryptDes(message,KEY,IV);
    obj.e_msg = en;
    var de = crypto.decryptDes(en,KEY,IV);
    obj.d_msg = de;
  }
  res.render("result", {obj: obj});
  //res.send("Success")
  res.end();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(PORT));
