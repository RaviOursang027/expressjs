const User = require("../models/user");
const TempUser = require("../models/TemporaryStore");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const axios = require("axios");
const jwt1 = require("express-jwt");
const _ = require("lodash");
const { OAuth2Client } = require("google-auth-library");
const fetch = import("node-fetch");
const crypto = require("crypto");
const { sendEmailWithNodemailer } = require("../helpers/email");
const {
  sendEmailWithNodemailerforsuccess_signup,
} = require("../helpers/signup_email");
const fs = require("fs");
const path = require("path");
const uuidv4 = require("uuid").v4; // for generating unique IDs

function toBase64(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, "base64", (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

// exports.signup = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     const user = await User.findOne({ email }).exec();
//     if (user) {
//       return res.status(200).json({
//         warning: "Email is taken",
//       });
//     }

//     const token = jwt.sign(
//       { name, email, password },
//       process.env.JWT_ACCOUNT_ACTIVATION,
//       { expiresIn: "10m" }
//     );

//     const imagePath = path.join(__dirname, "../assets/logo.png");
//     const base64Image = await toBase64(imagePath);

//     fs.readFile(
//       path.join(
//         __dirname,
//         "../assets/emailTemplates/AccountActivationTemplate.html"
//       ),
//       "utf8",
//       (err, data) => {
//         if (err) {
//           console.log("READFILE ERROR", err);
//           return res.status(500).json({ error: "Internal server error" });
//         }
//         // Replace placeholders with actual values
//         const htmlContent = data
//           .replace("{{CLIENT_URL}}", process.env.CLIENT_URL)
//           .replace("{{TOKEN}}", token)
//           .replace("{{BASE64_IMAGE}}", base64Image)
//           .replace("{{EMAIL}}", email) // Add this line
//           .replace("{{EMAILID}}", email); // Add this line

//         const emailData = {
//           from: "noreply@techmega.cloud",
//           to: email,
//           subject: "ACCOUNT  ACTIVATION LINK",
//           html: htmlContent,
//         };
//         // Note: You may need to send this emailData via some email service

//         sendEmailWithNodemailer(req, res, emailData);
//       }
//     );
//   } catch (err) {
//     console.log("SIGNUP ERROR", err);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// const emailData = {
//   from: "noreply@techmega.cloud", // MAKE SURE THIS EMAIL IS YOUR GMAIL FOR WHICH YOU GENERATED APP PASSWORD
//   to: email, // WHO SHOULD BE RECEIVING THIS EMAIL? IT SHOULD BE THE USER EMAIL (VALID EMAIL ADDRESS) WHO IS TRYING TO SIGNUP
//   subject: "ACCOUNT ACTIVATION LINK",
//   html: `
//             Thank you for signing up. Please click on the following link to activate your account:

//             <p>Click <a href="${process.env.CLIENT_URL}/activateUser/${token}">here</a> to activate your account.</p>

//             If the link is not clickable, you can copy and paste it into your browser's address bar.

//             <hr />
//             <p>This email may contain sensitive information</p>
//             <p>http://techmega.cloud</p>
//         `,
// };

// sendEmailWithNodemailer(req, res, emailData);

//   const { token } = req.body;

//   if (token) {
//     jwt.verify(
//       token,
//       process.env.JWT_ACCOUNT_ACTIVATION,
//       function (err, decoded) {
//         if (err) {
//           console.log("JWT VERIFY IN ACCOUNT ERROR", err);
//           return res.status(200).json({
//             warning: "Expired link. SignUP again",
//           });
//         }

//         const { name, email, password } = jwt.decode(token);

//         const user = new User({ name, email, password });

//         user.save((err, user) => {
//           if (err) {
//             console.log("SAVE USER IN ACCOUNT ACTIVATION ERROR", err);
//             return res.json({
//               error: "Error saving user in DB. Try signup again .",
//             });
//           }
//           return res.json({
//             success: "Signup success. Please signin.",
//           });
//         });
//       }
//     );
//   } else {
//     return res.json({
//       error: "Something went wrong. Try again.",
//     });
//   }
// };
// exports.accountActivation = (req, res) => {
//   const { token } = req.body;

//   if (token) {
//     jwt.verify(
//       token,
//       process.env.JWT_ACCOUNT_ACTIVATION,
//       function (err, decoded) {
//         if (err) {
//           console.log("JWT VERIFY IN ACCOUNT ERROR", err);
//           return res.status(200).json({
//             warning: "Expired link. SignUP again",
//           });
//         }

//         const { name, email, password } = jwt.decode(token);

//         // Generate username using email (you can modify this logic)
//         const username = email.split("@")[0];

//         // Check if username already exists
//         User.findOne({ username }, function (err, existingUser) {
//           if (err) {
//             console.log("ERROR FINDING USERNAME", err);
//             return res.json({
//               error: "Error checking username in DB. Try signup again.",
//             });
//           }

//           if (existingUser) {
//             return res.json({
//               error: "Username already exists. Try a different email.",
//             });
//           }

//           // Create user with unique username
//           const user = new User({ name, email, password, username });

//           user.save((err, user) => {
//             if (err) {
//               console.log("SAVE USER IN ACCOUNT ACTIVATION ERROR", err);
//               return res.json({
//                 error: "Error saving user in DB. Try signup again.",
//               });
//             }
//             return res.json({
//               success: "Signup success. Please signin.",
//             });
//           });
//         });
//       }
//     );
//   } else {
//     return res.json({
//       error: "Something went wrong. Try again.",
//     });
//   }
// };
// exports.accountActivation = async (req, res) => {
//   const { token } = req.body;

//   if (!token) {
//     return res.json({
//       error: "Something went wrong. Try again.",
//     });
//   }

//   try {
//     const decoded = await new Promise((resolve, reject) => {
//       jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
//         if (err) reject(err);
//         else resolve(decoded);
//       });
//     });

//     const { name, email, password } = jwt.decode(token);

//     // Create user with unique username
//     const user = new User({ name, email, password });

//     await user.save();

//     const imagePath = path.join(__dirname, "../assets/logo.png");
//     const base64Image = await toBase64(imagePath);

//     const emailData = {
//       from: "noreply@techmega.cloud", // MAKE SURE THIS EMAIL IS YOUR GMAIL FOR WHICH YOU GENERATED APP PASSWORD
//       to: email, // WHO SHOULD BE RECEIVING THIS EMAIL? IT SHOULD BE THE USER EMAIL (VALID EMAIL ADDRESS) WHO IS TRYING TO SIGNUP
//       subject: "Welcome to Our Platform!",
//       html: `
//       <div style="font-family: Arial, Helvetica, sans-serif; border: 1px solid #ccc; padding: 20px;">
//       <img src="data:image/png;base64,${base64Image}" alt="Welcome" style="width: 100px; height: auto;"/>
//       <h1 style="color: #333; font-size: 24px; text-align: center; margin-top: 20px;">Thank you for signing up!</h1>
//         <p style="color: #666; font-size: 16px;">Welcome on board! We're excited to have you.</p>
//         <p style="color: #666; font-size: 16px;">Feel free to explore our platform and let us know if you have any questions.</p>

//         <div style="background-color: #eee; padding: 10px; text-align: center; margin-top: 20px;">
//           <a href="https://techmega.cloud" style="color: #333; text-decoration: none; font-weight: bold;">Visit Our Website</a>
//         </div>

//         <p style="color: #666; font-size: 16px; text-align: right;">Best regards,</p>
//         <p style="color: #666; font-size: 16px; text-align: right;">The Team</p>
//       </div>
//     `,
//     };

//     await sendEmailWithNodemailerforsuccess_signup(req, res, emailData);
//   } catch (err) {
//     console.log("ERROR IN ACCOUNT ACTIVATION", err);

//     if (err.name === "TokenExpiredError") {
//       return res.status(200).json({
//         warning: "Expired link. SignUP again",
//       });
//     }

//     return res.json({
//       error: "Error during account activation. Try signup again.",
//     });
//   }
// };

// const jwt = require("jsonwebtoken");
// No need to require bcrypt

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findOne({ email }).exec();
    if (user) {
      return res.status(409).json({
        warning: "Email is already registered",
      });
    }

    // Generate a temporary ID for the user
    const tempID = uuidv4();
    // No hashing here, store the plaintext password temporarily
    // Using Mongoose model method to save temporary user
    const tempUser = new TempUser({ tempID, name, email, password });
    await tempUser.save();

    // Create the JWT token for account activation
    const token = jwt.sign({ tempID }, process.env.JWT_ACCOUNT_ACTIVATION, {
      expiresIn: "10m",
    });

    // ... (rest of the code for sending the email)

    const imagePath = path.join(__dirname, "../assets/logo.png");
    const base64Image = await toBase64(imagePath);

    fs.readFile(
      path.join(
        __dirname,
        "../assets/emailTemplates/AccountActivationTemplate.html"
      ),
      "utf8",
      (err, data) => {
        if (err) {
          console.log("READFILE ERROR", err);
          return res.status(500).json({ error: "Internal server error" });
        }
        // Replace placeholders with actual values
        const htmlContent = data
          .replace("{{CLIENT_URL}}", process.env.CLIENT_URL)
          .replace("{{TOKEN}}", token)
          .replace("{{BASE64_IMAGE}}", base64Image)
          .replace("{{EMAIL}}", email) // Add this line
          .replace("{{EMAILID}}", email); // Add this line

        const emailData = {
          from: "noreply@techmega.cloud",
          to: email,
          subject: "ACCOUNT  ACTIVATION LINK",
          html: htmlContent,
        };
        // Note: You may need to send this emailData via some email service

        sendEmailWithNodemailer(req, res, emailData);
      }
    );
  } catch (err) {
    console.error("SIGNUP ERROR", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.accountActivation = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION);
    const tempID = decoded.tempID;

    // Using Mongoose's native findOne method
    const tempData = await TempUser.findOne({ tempID }).exec();
    if (!tempData) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const { name, email, hashed_password, salt, isHashed } = tempData;
    const user = new User({
      name,
      email,
      hashed_password: hashed_password,
      salt,
      isHashed,
    });
    await user.save();

    // ... (rest of the code for sending success email or other actions)
    const imagePath = path.join(__dirname, "../assets/logo.png");
    const base64Image = await toBase64(imagePath);

    const emailData = {
      from: "noreply@techmega.cloud", // MAKE SURE THIS EMAIL IS YOUR GMAIL FOR WHICH YOU GENERATED APP PASSWORD
      to: email, // WHO SHOULD BE RECEIVING THIS EMAIL? IT SHOULD BE THE USER EMAIL (VALID EMAIL ADDRESS) WHO IS TRYING TO SIGNUP
      subject: "Welcome to Our Platform!",
      html: `
      <div style="font-family: Arial, Helvetica, sans-serif; border: 1px solid #ccc; padding: 20px;">
      <img src="data:image/png;base64,${base64Image}" alt="Welcome" style="width: 100px; height: auto;"/>
      <h1 style="color: #333; font-size: 24px; text-align: center; margin-top: 20px;">Thank you for signing up!</h1>
        <p style="color: #666; font-size: 16px;">Welcome on board! We're excited to have you.</p>
        <p style="color: #666; font-size: 16px;">Feel free to explore our platform and let us know if you have any questions.</p>
        
        <div style="background-color: #eee; padding: 10px; text-align: center; margin-top: 20px;">
          <a href="https://techmega.cloud" style="color: #333; text-decoration: none; font-weight: bold;">Visit Our Website</a>
        </div>
  
        <p style="color: #666; font-size: 16px; text-align: right;">Best regards,</p>
        <p style="color: #666; font-size: 16px; text-align: right;">The Team</p>
      </div>
    `,
    };

    await sendEmailWithNodemailerforsuccess_signup(req, res, emailData);
  } catch (err) {
    console.error("ACCOUNT ACTIVATION ERROR", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  //check if user exist
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(200).json({
        warning: "User with that email does not exist. Please signup",
      });
    }
    // authenticate
    if (!user.authenticate(password)) {
      console.log(password);
      return res.status(200).json({
        warning: "Email and password do not match",
      });
    }
    // generate a token and send it client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });
    const { _id, name, email, role } = user;

    return res.json({
      message: "Login successful",
      success: true,
      token,
      user: { _id, name, email, role },
    });
  });
};

console.log("JWT_SECRET:", process.env.JWT_SECRET);
exports.requireSignin = jwt1({
  secret: process.env.JWT_SECRET, //req.user
});

exports.adminMiddleware = (req, res, next) => {
  User.findById({ _id: req.user._id }).exec((err, user) => {
    if (err || !user) {
      return res.status(200).json({
        warning: "User with that email does not exist. Please signup",
      });
    }

    if (user.role !== "admin") {
      return res.status(200).json({
        warning: "Admin resource. Access denied.",
      });
    }

    req.profile = user;
    next();
  });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  User.findOne({ email }, async (err, user) => {
    if (err || !user) {
      return res.status(200).json({
        warning: "User with that email does not exist",
      });
    }
    const token = jwt.sign(
      { _id: user._id, name: user.name },
      process.env.JWT_RESET_PASSWORD,
      {
        expiresIn: "10m",
      }
    );

    const imagePath = path.join(__dirname, "../assets/logo.png");
    const base64Image = await toBase64(imagePath);

    fs.readFile(
      path.join(
        __dirname,
        "../assets/emailTemplates/resetPasswordTemplate.html"
      ),
      "utf8",
      (err, data) => {
        if (err) {
          console.log("READFILE ERROR", err);
          return res.status(500).json({ error: "Internal server error" });
        }
        // Replace placeholders with actual values
        const htmlContent = data
          .replace("{{CLIENT_URL}}", process.env.CLIENT_URL)
          .replace("{{TOKEN}}", token)
          .replace("{{BASE64_IMAGE}}", base64Image)
          .replace("{{EMAIL}}", email) // Add this line
          .replace("{{EMAILID}}", email); // Add this line

        const emailData = {
          from: "noreply@techmega.cloud",
          to: email,
          subject: "PASSWORD RESET LINK",
          html: htmlContent,
        };

        return user.updateOne({ resetPasswordLink: token }, (err, success) => {
          if (err) {
            console.log("RESET PASSWORD LINK ERROR", err);
            return res.status(200).json({
              error:
                "Database connection error on user password forgot request",
            });
          } else {
            sendEmailWithNodemailer(req, res, emailData);
          }
        });
      }
    );
  });
};
// exports.resetPassword = (req, res) => {
//   const { resetPasswordLink, newPassword } = req.body;

//   console.log("Received reset password request with link:", resetPasswordLink);

//   if (resetPasswordLink) {
//     jwt.verify(
//       resetPasswordLink,
//       process.env.JWT_RESET_PASSWORD,
//       function (err, decoded) {
//         if (err) {
//           console.error("Error verifying JWT token:", err);
//           return res.status(200).json({
//             warning: "Expired link. Try again",
//           });
//         }

//         console.log("Decoded JWT token:", decoded);

//         User.findOne({ resetPasswordLink }, (err, user) => {
//           if (err || !user) {
//             console.error("Error finding user:", err);
//             return res.status(200).json({
//               warning: "Something went wrong. Try later",
//             });
//           }

//           const updatedFields = {
//             password: newPassword,
//             resetPasswordLink: "",
//           };

//           user = _.extend(user, updatedFields);
//           console.log("Updated user object:", user); // Debug line

//           user.save((err, result) => {
//             if (err) {
//               console.error("Error saving updated user data:", err);
//               return res.status(200).json({
//                 error: "Error resetting user password",
//               });
//             }
//             res.json({
//               success: `Great! Now you can login with your new password`,
//             });
//           });
//         });
//       }
//     );
//   }
// };
exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  if (resetPasswordLink) {
    jwt.verify(
      resetPasswordLink,
      process.env.JWT_RESET_PASSWORD,
      function (err, decoded) {
        if (err) {
          return res.status(400).json({
            warning: "Expired link. Try again",
          });
        }

        User.findOne({ resetPasswordLink }, (err, user) => {
          if (err || !user) {
            return res.status(400).json({
              warning: "Something went wrong. Try later",
            });
          }

          const updatedFields = {
            hashed_password: newPassword,
            resetPasswordLink: "",
            isHashed: false,
          };

          user.set(updatedFields); // Use Mongoose's document#set

          // console.log(updatedFields);
          // console.log(user);

          user.save((err, result) => {
            if (err) {
              return res.status(400).json({
                error: "Error resetting user password",
              });
            }
            // console.log("User saved:", result);
            res.json({
              success: `Great! Now you can login with your new password`,
            });
          });
        });
      }
    );
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
exports.googleLogin = (req, res) => {
  const { credential } = req.body;
  console.log(credential);
  console.log("Expected GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);

  client
    .verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    .then((response) => {
      // console.log('GOOGLE LOGIN RESPONSE',response)
      const { email_verified, name, email } = response.payload;
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "7d",
            });
            const { _id, email, name, role } = user;
            return res.json({
              token,
              user: { _id, email, name, role },
            });
          } else {
            let password = email + process.env.JWT_SECRET;
            user = new User({ name, email, password });
            user.save((err, data) => {
              if (err) {
                console.log("ERROR GOOGLE LOGIN ON USER SAVE", err);
                return res.status(200).json({
                  error: "User signup failed with google",
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
              );
              const { _id, email, name, role } = data;
              return res.json({
                token,
                user: { _id, email, name, role },
              });
            });
          }
        });
      } else {
        return res.status(200).json({
          error: "Google login failed. Try again",
        });
      }
    })
    .catch((error) => {
      console.log("ERROR DURING GOOGLE LOGIN", error);
      const decodedToken = jwt.decode(credential, { complete: true });
      console.log("Token Audience:", decodedToken.payload.aud);
      return res.status(401).json({ error: "ERROR DURING GOOGLE LOGIN" });
    });
};

exports.facebookLogin = (req, res) => {
  console.log("FACEBOOK LOGIN REQ BODY", req.body);
  const { userID, accessToken } = req.body;

  const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;

  return (
    fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      // .then(response => console.log(response))
      .then((response) => {
        const { email, name } = response;
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "7d",
            });
            const { _id, email, name, role } = user;
            return res.json({
              token,
              user: { _id, email, name, role },
            });
          } else {
            let password = email + process.env.JWT_SECRET;
            user = new User({ name, email, password });
            user.save((err, data) => {
              if (err) {
                console.log("ERROR FACEBOOK LOGIN ON USER SAVE", err);
                return res.status(200).json({
                  error: "User signup failed with facebook",
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
              );
              const { _id, email, name, role } = data;
              return res.json({
                token,
                user: { _id, email, name, role },
              });
            });
          }
        });
      })
      .catch((error) => {
        res.json({
          error: "Facebook login failed. Try later",
        });
      })
  );
};

exports.sendOtp = async (req, res) => {
  const { mobileNumber } = req.body;
  try {
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const email = `${mobileNumber}@temporary.com`;

    // Update existing user record or create a new one
    await User.updateOne(
      { mobileNumber },
      {
        $set: { otp },
        $setOnInsert: { email, mobileNumber },
      },
      { upsert: true }
    );

    // Send OTP via BulkSMS API
    const apiKey = process.env.BULK_SMS_API_KEY;
    const senderId = process.env.SENDER_ID;
    const message = `${otp} is OTP for verifying your account\n\nALL CONNECT NETWORK SERVICES PVT LTD`;
    const url = `http://bulksms.saakshisoftware.in/api/mt/SendSMS?APIKey=${apiKey}&senderid=${senderId}&channel=trans&DCS=0&flashsms=0&number=${mobileNumber}&text=${message}&route=04&DLTTemplateId=1407167265279992084&PEID=1401418170000053722`;

    await axios.get(url);

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

// exports.verifyOtp = async (req, res) => {
//   const { mobileNumber, otp } = req.body;

//   try {
//     // Find the user in the database
//     const user = await User.findOne({ mobileNumber });

//     // Check if the user exists and the OTP matches
//     if (user && user.otp === otp) {
//       // Delete the OTP from the database
//       await User.findOneAndUpdate({ mobileNumber }, { $unset: { otp: 1 } });

//       // Generate a token
//       const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
//         expiresIn: "7d",
//       });

//       const { _id, name, email, role } = user;

//       res.json({
//         success: true,
//         message: "OTP verification successful",
//         token,
//         user: { _id, name, email, role },
//       });
//     } else {
//       res.json({ success: false, message: "Invalid OTP" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(200).json({ success: false, message: "Failed to verify OTP" });
//   }
// };

exports.verifyOtp = async (req, res) => {
  const { mobileNumber, otp } = req.body;

  try {
    // Find the user in the database and unset the OTP if it is valid
    const user = await User.findOneAndUpdate(
      { mobileNumber, otp },
      { $unset: { otp: 1 } },
      { new: true }
    );

    // Check if the user exists and the OTP matches
    if (user) {
      // Generate a token
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      const { _id, name, email, role } = user;

      res.status(200).json({
        success: true,
        message: "OTP verification successful",
        token,
        user: { _id, name, email, role },
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to verify OTP" });
  }
};
