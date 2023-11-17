// /helpers/email.js
const nodeMailer = require("nodemailer");

exports.sendEmailWithNodemailerforsuccess_signup = (req, res, emailData) => {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    requireTLS: false,
    auth: {
      user: "noreply@megaconnect.cloud", // MAKE SURE THIS EMAIL IS YOUR GMAIL FOR WHICH YOU GENERATED APP PASSWORD
      pass: "cohpfnpgdccmzvdp", // MAKE SURE THIS PASSWORD IS YOUR GMAIL APP PASSWORD WHICH YOU GENERATED EARLIER
    },
    // tls: {
    //   ciphers: "SSLv3",
    // },
  });

  return transporter
    .sendMail(emailData)
    .then((info) => {
      console.log(`Message sent: ${info.response}`);
      return res.json({
        message: `Thank you for sign up`,
      });
    })
    .catch((err) => console.log(`Problem sending email: ${err}`));
};
