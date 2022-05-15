require('dotenv').config();
const express = require("express");

const path = require("path");
const ejs = require("ejs");
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://Itsme:nirmit2212@cluster0.j6ww2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
);
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

  }
  else if(obj.algo === 'DES')
  {
      const message = DES.bin(obj.secret)
      const key = DES.bin(process.env.DES_KEY)
      const enc = DES.encode(message, key)
      obj.e_msg=enc;
      const dec = DES.decode(enc,key)
      obj.d_msg= dec;

  }
  res.render("result", {obj: obj});
  //res.send("Success")
  res.end();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(PORT));
