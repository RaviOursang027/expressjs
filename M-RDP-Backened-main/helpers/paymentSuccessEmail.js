// /helpers/email.js
const nodeMailerPayment = require("nodemailer");

exports.sendEmailWithNodemailerforPayment = (req, res, emailDataPayment) => {
  const transporter = nodeMailerPayment.createTransport({
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

  return transporter.sendMail(emailDataPayment);
  // .then((info) => {
  //   console.log("Email sent:", info.response);
  //   res.json({ success: true, message: "Payment successful" });
  // })
  // .catch((error) => {
  //   console.error("Error sending email:", error);
  //   res.json({ success: false, message: "Error sending email" });
  // });
};
