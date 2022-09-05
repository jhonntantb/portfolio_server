require("dotenv").config();
const express = require("express");
const router = express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");

// variables used to send emails
const email = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

// server used to send send emails
const app = express();
app.use(cors("*"));
app.use(express.json());
app.use("/", router);

const contactEmail = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: email,
    pass: pass,
  },
});

contactEmail.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready to Send");
  }
});

router.post("/contact", (req, res) => {
  const name = req.body.name;
  const subject = req.body.subject;
  const mailer = req.body.mailer;
  const message = req.body.message;

  const mail = {
    from: name,
    to: email,
    subject: "Contact Form Portfolio",
    html: `<p>Name: ${name}</p>
           <p>Email: ${mailer}</p>
           <p>Subject: ${subject}</p>
           <p>Message: ${message}</p>`,
  };
  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json(error);
    } else {
      res.json({ code: 200, status: "Message Sent" });
    }
  });
});

app.listen(5000, () => console.log("Server Running"));
console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASS);
