const User = require("../models/user");
const Order = require("../models/order");
const DeliveryAddress = require("../models/delivery_address");
const { AppModel } = require("../models/appdetails");
// const { v4: uuidv4 } = require("uuid");
const PDFDocument = require("pdfkit");
const fs = require("fs");

require("dotenv").config();

const multer = require("multer");
const path = require("path");
const { Client } = require("ssh2");
const SftpClient = require("ssh2-sftp-client");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const axios = require("axios");
const { sendEmailWithNodemailer } = require("../helpers/email");
const Feedback = require("../models/feedback"); // Replace with your actual Feedback model path

const {
  sendEmailWithNodemailerforPayment,
} = require("../helpers/paymentSuccessEmail");

const {
  sendEmailWithNodemailerforfeeback,
} = require("../helpers/feedbackEmail");

const razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

function toBase64(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, "base64", (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

exports.read = (req, res) => {
  const userId = req.user._id;
  User.findOne({ _id: userId })
    .select("name email mobileNumber profilePictureUrl createdAt") // Include only the fields you want
    .exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "User not found",
        });
      }
      res.json(user);
    });
};

// exports.update = (req, res) => {
//   console.log("UPDATE USER- req.user", req.user, "UPDATE DATA", req.body);
//   const { name, password } = req.body;
//   // Email validation regular expression
//   // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   User.findOne({ _id: req.user._id }, (err, user) => {
//     if (err || !user) {
//       return res.status(200).json({
//         message: "User not found",
//       });
//     }
//     if (!name) {
//       return res.status(200).json({
//         message: "Name is required",
//       });
//     } else {
//       user.name = name;
//     }
//     if (password) {
//       if (password.length < 6) {
//         return res.status(200).json({
//           message: "Password should be min 6 characters long",
//         });
//       } else {
//         user.password = password;
//       }
//     }
//     // if (email) {
//     //   if (!emailRegex.test(email)) {
//     //     return res.status(400).json({
//     //       error: "Invalid email format",
//     //     });
//     //   } else {
//     //     user.email = email;
//     //   }
//     // }
//     user.save((err, updatedUser) => {
//       if (err) {
//         return res.status(200).json({
//           message: "user update failed",
//         });
//       }
//       updatedUser.hashed_password = undefined;
//       updatedUser.salt = undefined;
//       res.json(updatedUser);
//     });
//   });
// };
// exports.update = (req, res) => {
//   console.log("UPDATE USER- req.user", req.user, "UPDATE DATA", req.body);
//   const { name, password,confirmpassword, mobileNumber } = req.body;
//   // Phone number validation regular expression, modify as needed
//   const phoneRegex = /^[0-9]{10}$/;

//   User.findOne({ _id: req.user._id }, (err, user) => {
//     if (err || !user) {
//       return res.status(200).json({
//         message: "User not found",
//       });
//     }
//     if (!name) {
//       return res.status(200).json({
//         message: "Name is required",
//       });
//     } else {
//       user.name = name;
//     }
//     if (password) {
//       if (password.length < 6) {
//         return res.status(200).json({
//           message: "Password should be min 6 characters long",
//         });
//       } else {
//         user.password = password;
//       }
//     }
//     if (mobileNumber) {
//       if (!phoneRegex.test(mobileNumber)) {
//         return res.status(400).json({
//           error: "Invalid phone number format",
//         });
//       } else {
//         user.mobileNumber = mobileNumber;
//       }
//     }
//     user.save((err, updatedUser) => {
//       if (err) {
//         return res.status(200).json({
//           message: "User update failed",
//         });
//       }
//       // Select only the required fields for the response
//       res.json({
//         name: updatedUser.name,
//         mobileNumber: updatedUser.mobileNumber,
//         email: updatedUser.email, // assuming email is also a property of the user
//         success: true,
//         message: "Password successfully updated",
//       });
//     });
//   });
// };
exports.update = (req, res) => {
  console.log("UPDATE USER- req.user", req.user, "UPDATE DATA", req.body);
  const { name, password, confirmpassword, mobileNumber } = req.body;
  // Phone number validation regular expression, modify as needed
  const phoneRegex = /^[0-9]{10}$/;

  // Check if the password and confirm password fields are provided and if they match
  if (password && confirmpassword) {
    if (password !== confirmpassword) {
      return res.status(400).json({
        message: "Password and Confirm Password do not match",
      });
    }
  }

  User.findOne({ _id: req.user._id }, (err, user) => {
    if (err || !user) {
      return res.status(200).json({
        message: "User not found",
      });
    }
    if (!name) {
      return res.status(200).json({
        message: "Name is required",
      });
    } else {
      user.name = name;
    }
    if (password) {
      if (password.length < 6) {
        return res.status(200).json({
          message: "Password should be min 6 characters long",
        });
      } else {
        user.password = password;
      }
    }
    if (mobileNumber) {
      if (!phoneRegex.test(mobileNumber)) {
        return res.status(400).json({
          error: "Invalid phone number format",
        });
      } else {
        user.mobileNumber = mobileNumber;
      }
    }
    user.save((err, updatedUser) => {
      if (err) {
        return res.status(200).json({
          message: "User update failed",
        });
      }
      // Select only the required fields for the response
      res.json({
        name: updatedUser.name,
        mobileNumber: updatedUser.mobileNumber,
        email: updatedUser.email, // assuming email is also a property of the user
        success: true,
        message: "User successfully updated",
      });
    });
  });
};

exports.initiateEmailChange = async (req, res) => {
  // const userId=
  const { newEmail } = req.body;

  try {
    const user_id = req.user._id;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.email.endsWith("@temporary.com")) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Save this OTP in the user's document (in a field, say emailOtp)
      await User.updateOne({ _id: user_id }, { $set: { emailOtp: otp } });

      // Send this OTP to the user's new email ID
      const emailData = {
        from: "noreply@techmega.cloud", // MAKE SURE THIS EMAIL IS YOUR GMAIL FOR WHICH YOU GENERATED APP PASSWORD
        to: newEmail, // WHO SHOULD BE RECEIVING THIS EMAIL? IT SHOULD BE THE USER EMAIL (VALID EMAIL ADDRESS) WHO IS TRYING TO SIGNUP
        subject: "Change Temporary email ID",
        html: `
                  Thank you for signing up. Please click on the following link to activate your account:
  
                  <p>Copy this OTP ${otp}  to change  your temporary email id.</p>
  
  
                  <hr />
                  <p>This email may contain sensitive information</p>
                  <p>http://techmega.cloud</p>
              `,
      };

      sendEmailWithNodemailer(req, res, emailData);

      return res.json({ success: true, message: "OTP sent to new email" });
    } else {
      return res
        .status(403)
        .json({ success: false, message: "Cannot change the email ID" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to initiate email change" });
  }
};

exports.verifyAndChangeEmail = async (req, res) => {
  const { otp, newEmail } = req.body;
  const { name } = req.body;
  try {
    const user_id = req.user._id;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.emailOtp === otp) {
      await User.updateOne(
        { _id: user_id },
        {
          $set: { email: newEmail, name: name }, $unset: { emailOtp: 1 }
        }
      );
      return res.json({ success: true, message: "Email updated successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP and change email",
    });
  }
};

const pincodeApiBaseUrl = "https://api.postalpincode.in/pincode/";

exports.pincodedetails = (req, res) => {
  const pincode = req.params.pincode;

  if (!pincode) {
    res.status(400).json({ error: "PIN code is required as a parameter" });
    return;
  }

  const pincodeApiUrl = `${pincodeApiBaseUrl}${pincode}`;

  axios
    .get(pincodeApiUrl)
    .then((response) => {
      const data = response.data;

      if (data[0].Status === "Success") {
        const details = data[0].PostOffice[0];
        res.json({
          state: details.State,
          district: details.District,
          city: details.District,
          country: details.Country,
          pincode: details.Pincode,
        });
      } else {
        res.json({ message: "PIN code not found" });
      }
    })
    .catch((error) => {
      console.error("Error fetching PIN code details:", error);
      res.status(500).json({ error: "Internal server error" });
    });
};

// Route to get all app data
exports.getAllApps = async (req, res) => {
  try {
    const appsData = await AppModel.find();
    res.json(appsData);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// exports.getAppList = async (req, res) => {
//   try {
//     const appsData = await AppModel.find({}, { apps: 1, _id: 0 });
//     const appList = appsData.reduce((accumulator, category) => {
//       return accumulator.concat(category.apps);
//     }, []);
//     res.json(appList);
//   } catch (err) {
//     res.status(500).json({ error: "Server Error" });
//   }
// };
// Function to create a virtual machine with a specific static IP

exports.createVirtualMachine = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(userId);

    // Fetch the user from the database
    const userExisits = await User.findById(userId);
    if (!userExisits) {
      return res.status(404).send({ message: "User not found" });
    }

    // Extract the part before '@gmail.com' from the user's email
    const userEmail = userExisits.email;
    console.log(userEmail);
    const atIndex = userEmail.indexOf("@");
    const vmName =
      atIndex !== -1 ? userEmail.substring(0, atIndex) : "MyVMwin1";

    // Use variables or arguments to pass the virtual machine parameters
    // const vmName = req.body.vmName || "MyVMwin1";
    const cpuCount = 2;
    const memoryGB = 6;
    const diskSizeGB = 100;
    const staticIP = "192.168.0.101" || "103.112.214.102";
    const diskPath = vmName;

    // Send initial response
    res.status(200).send({
      message:
        "Your VM is being created. You will be notified when it is ready.",
      success: true,
      vmName: vmName,
      cpuCount: cpuCount,
      memoryGB: memoryGB,
      diskSizeGB: diskSizeGB,
    });

    // Find user and update virtualMachines field
    const user = await User.findById(userId);
    if (user) {
      user.virtualMachines.push({
        vmName: vmName,
        cpuCount: cpuCount,
        memoryGB: memoryGB,
      });
      await user.save();
    }

    // Connect to the remote server using SSH
    const conn = new Client();

    conn
      .on("ready", () => {
        // console.log("SSH connection ready");

        // Execute the commands to create the virtual machine and configure the static IP
        const commands = `sudo virt-install --name ${vmName} --memory ${memoryGB} --vcpus ${cpuCount} --disk path=/var/lib/libvirt/images/${diskPath},size=${diskSizeGB},format=qcow2 --os-variant win10 --network network=network --cdrom /home/prabhu/Downloads/Windows_10_unattended.iso --boot cdrom`;

        conn.exec(commands, async (err, stream) => {
          if (err) throw err;

          let stdout = "";
          let stderr = "";

          stream
            .on("close", async (code, signal) => {
              console.log(`Command execution completed with code ${code}`);

              if (code === 0) {
                console.log(
                  `Virtual machine '${vmName}' created successfully with static IP '${staticIP}' from the pool.`
                );
              } else {
                console.error(
                  `Virtual machine creation failed with code ${code}`
                );
              }

              // console.log(`STDOUT: ${stdout}`);
              // console.error(`STDERR: ${stderr}`);

              conn.end(); // Close the connection to the server
            })
            .on("data", (data) => {
              stdout += data;
              // console.log(`STDOUT: ${data}`);
            })
            .stderr.on("data", (data) => {
              stderr += data;
              // console.error(`STDERR: ${data}`);
            });
        });
      })

      // Add error handler for connection errors
      .on("error", (err) => {
        console.error("An error occurred:", err);
        conn.end(); // Close the connection to the server
      })
      .connect({
        host: process.env.HOST,
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
        tryKeyboard: process.env.TRYKEYBOARD, // Enable keyboard-interactive authentication
        keyboardInteractiveHandler(
          name,
          instructions,
          instructionsLang,
          prompts,
          finish
        ) {
          // Respond with the password when prompted
          if (
            prompts.length > 0 &&
            prompts[0].prompt.toLowerCase().includes("password")
          ) {
            finish(["AdminTechMega@123#"]);
          } else {
            finish([]);
          }
        },
        // Add timeout value of 10 minutes (in milliseconds)
        // timeout: 200000,
      });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send(error);
  }
};

exports.fetchIpVm = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(userId);

    // Fetch the user from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create an array to store promises for SSH connections
    const sshPromises = [];

    // Iterate over the virtualMachines and fetch IP addresses for each VM
    for (const vm of user.virtualMachines) {
      const vmName = vm.vmName;
      console.log(`Fetching IP address for VM: ${vmName}`);

      // Create a promise for the SSH connection
      const sshPromise = new Promise(async (resolve, reject) => {
        const conn = new Client();

        conn
          .on("ready", () => {
            // Execute the command to fetch the IP address of the VM
            const command = `sudo virsh domifaddr ${vmName}`;

            conn.exec(command, (err, stream) => {
              if (err) {
                console.error("Error executing command:", err);
                conn.end(); // Close the connection to the server
                reject(err);
              }

              let stdout = "";

              stream
                .on("close", async (code, signal) => {
                  console.log(`Command execution completed with code ${code}`);
                  console.log(`VM IP Addresses for ${vmName}: ${stdout}`);

                  // Extract IP addresses from stdout using regular expressions
                  const ipAddresses = (
                    stdout.match(/(\d+\.\d+\.\d+\.\d+)/g) || []
                  ).map((ip) => ip.trim());

                  // Update the user's virtual machine fields with the IP addresses
                  const updatedUser = await User.findOneAndUpdate(
                    {
                      _id: userId,
                      "virtualMachines.vmName": vmName,
                    },
                    { $set: { "virtualMachines.$.ipAddresses": ipAddresses } },
                    { new: true }
                  );

                  conn.end(); // Close the connection to the server
                  resolve({ vmName: vmName, ipAddresses: ipAddresses });
                })
                .on("data", (data) => {
                  stdout += data.toString();
                });
            });
          })

          // Add error handler for connection errors
          .on("error", (err) => {
            console.error("An error occurred:", err);
            conn.end(); // Close the connection to the server
            reject(err);
          })
          .connect({
            host: process.env.HOST, // Replace with the remote server's hostname or IP address
            username: process.env.USERNAME, // Replace with your SSH username
            password: process.env.PASSWORD, // Replace with your SSH password
            tryKeyboard: process.env.TRYKEYBOARD, // Enable keyboard-interactive authentication
            // Add timeout value if needed
            // timeout: 200000,
          });
      });

      sshPromises.push(sshPromise);
    }

    // Wait for all SSH connections to finish and collect the results
    const vmIpAddresses = await Promise.all(sshPromises);

    // Now that you have collected all the data, send the email
    const emailData = {
      from: "noreply@techmega.cloud",
      to: user.email,
      subject: "VM IP Addresses",
      html: `
        <p>Here are the IP addresses and virtual machine data for your VMs:</p>
        <ul>
          ${vmIpAddresses
          .map(
            ({ vmName, ipAddresses }) => `
            <li>
              <strong>${vmName}:</strong>
              <ul>
                <li>IP Addresses: ${ipAddresses.join(", ")}</li>
                <li>Username: admin</li>
                <li>Password: password</li>
                <li>CPU Count: ${user.virtualMachines.find((vm) => vm.vmName === vmName)
                .cpuCount
              }</li>
                <li>Memory: ${user.virtualMachines.find((vm) => vm.vmName === vmName)
                .memoryGB
              } GB</li>
                <!-- Add more virtual machine fields here -->
              </ul>
            </li>
          `
          )
          .join("")}
        </ul>
      `,
    };

    // Send the email
    sendEmailWithNodemailer(req, res, emailData);

    // Send the response with the collected IP addresses and virtual machine data
    res
      .status(200)
      .json({ vmIpAddresses, virtualMachines: user.virtualMachines });
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// new api with db configuration with async
exports.createOrder = async (req, res) => {
  try {
    // console.log("USER- req.user", req.user, "Coming DATA", req.body);
    // const { amount, currency, email } = req.body;
    // console.log(email);
    console.log("USER- req.user", req.user, "Coming DATA", req.body);
    const { amount, currency } = req.body;
    console.log(amount, req.user);

    const planName = "BASIC PLAN";

    // Lookup the user in the User database using the _id from req.user
    const userValidationCreate = await User.findById(req.user._id);
    if (!userValidationCreate) {
      return res.status(404).json({ error: "User not found" });
    }

    // Use the email from the user document instead of req.body
    const email = userValidationCreate.email;
    const receipt =
      "o_" +
      email.replace(/[^a-zA-Z0-9]/g, "").substring(0, 5) +
      "_" +
      (Date.now() % 10000) +
      "_" +
      Math.round(Math.random() * 100);
    // Create an order with the given amount and currency
    const orderCreate = await razorpay.orders.create({
      amount: amount * 100,
      currency: currency,
      receipt: receipt,
    });

    // Save the order details to the database
    const newOrder = new Order({
      planName: planName,
      amount: amount,
      currency: currency,
      receipt: orderCreate.receipt,
      payment_status: orderCreate.status,
      email: email,
    });
    await newOrder.save();

    const user = await User.findOneAndUpdate(
      { email },
      {
        $push: { orders: newOrder._id },
        paymentDetails: {
          planName: planName,
          paymentId: orderCreate.id,
          paymentStatus: orderCreate.status,
          paymentValidity: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // set payment validity to 30 days from now
          receipt: orderCreate.receipt,
          amount: amount,
        },
      },
      { new: true }
    );
    console.log(user);
    // Return the order details as the response
    res.json({ orderCreate });
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(200)
      .json({ error: "An error occurred while creating the order" });
  }
};
exports.paymentSuccess = async (req, res) => {
  console.log("USER- req.user", req.user, "Coming DATA", req.body);

  // Lookup the user in the User database using the _id from req.user
  const userValidationSuccess = await User.findById(req.user._id);
  if (!userValidationSuccess) {
    return res.status(404).json({ error: "User not found" });
  }

  // Use the email from the user document instead of req.body
  const email = userValidationSuccess.email;

  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    receipt,
  } = req.body;

  // Verify the payment signature
  // const signatureIsValid = razorpay.verifySignature({
  //   order_id: razorpay_order_id,
  //   payment_id: razorpay_payment_id,
  //   signature: razorpay_signature,
  // });
  const generatedSignature = crypto

    .createHmac("sha256", razorpay.key_secret)

    .update(`${razorpay_order_id}|${razorpay_payment_id}`)

    .digest("hex");
  console.log(generatedSignature, razorpay_signature);

  if (generatedSignature === razorpay_signature) {
    // Payment is valid
    // Update the order details in the database
    try {
      const orderSuccess = await Order.findOneAndUpdate(
        { receipt: receipt },
        {
          payment_id: razorpay_payment_id,
          payment_status: "paid",
          // planName: planName,
        },
        { new: true }
      );

      if (!orderSuccess) {
        console.error("Order not found for receipt:", receipt);
        return res.status(404).json({ error: "Order not found" });
      }

      const user = await User.findOneAndUpdate(
        { email: orderSuccess.email },
        {
          paymentDetails: {
            paymentId: orderSuccess.payment_id,
            paymentStatus: orderSuccess.payment_status,
            paymentValidity: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // set payment validity to 30 days from now
            planName: orderSuccess.planName,
            receipt: orderSuccess.receipt,
            amount: orderSuccess.amount,
          },
        },
        { new: true }
      );

      const emailDataPayment = {
        from: "noreply@techmega.cloud", // MAKE SURE THIS EMAIL IS YOUR GMAIL FOR WHICH YOU GENERATED APP PASSWORD
        to: email, // WHO SHOULD BE RECEIVING THIS EMAIL? IT SHOULD BE THE USER EMAIL (VALID EMAIL ADDRESS) WHO IS TRYING TO SIGNUP
        subject: "Payment Confirmation",
        text: "Thank you for your payment. Here is your receipt.",
        // attachments: [
        //   {
        //     filename: "receipt.pdf",
        //     path: "/path/to/receipt.pdf", // Replace with the actual path to the receipt file
        //   },
        // ],
        html: `
                  Thank you for Payment!!!.
                  
                  Payment Successful

  
                  <p>This email may contain sensitive information</p>
                  <p>http://techmega.cloud</p>
              `,
      };

      const receiptPath = await generateReceipt(orderSuccess);
      emailDataPayment.attachments = [
        {
          filename: "receipt.pdf",
          path: receiptPath,
        },
      ];
      sendEmailWithNodemailerforPayment(req, res, emailDataPayment)
        .then(() => {
          // Email sent successfully, send the response to the client
          console.log(user);
          res.json({
            success: true,
            message: "Payment successful. You will get a mail shortly !!!",
            orderSuccess,
            // user,
          });
        })
        .catch((error) => {
          console.error("Error sending email:", error);
          res.json({
            success: false,
            message: "Payment successful, but email sending failed",
          });
        });
    } catch (error) {
      // console.error("Error updating order:", error);
      // res.json({ success: false, error: "Error updating order" });
      console.error("Error generating or sending receipt:", error);

      console.error("Error updating order or user:", error);
      res
        .status(500)
        .json({ success: false, error: "Error updating order or user" });
    }
  } else {
    // Invalid payment
    res.json({ success: false, warning: "Invalid payment" });
  }
};

async function generateReceipt(orderDetails) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const rootDir = path.join(__dirname, "..");

    const receiptPath = path.join(rootDir, "Receipts");

    const outputFilename = `${receiptPath}/receipt-${orderDetails.receipt}.pdf`;
    const writeStream = fs.createWriteStream(outputFilename);
    doc.pipe(writeStream);

    // Add content to the PDF here. This is just a basic example:
    doc.fontSize(25).text("Payment Receipt", 50, 50);
    doc.fontSize(15).text(`Receipt: ${orderDetails.receipt}`, 50, 100);
    doc.fontSize(15).text(`Amount: ${orderDetails.amount}`, 50, 125);

    // etc. Add more details as needed

    doc.end();

    writeStream.on("finish", () => {
      resolve(outputFilename);
    });

    writeStream.on("error", reject);
  });
}

exports.userSubscriptionDetails = async (req, res) => {
  try {
    // Lookup the user in the User database using the _id from req.user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Extract the paymentDetails from the user document
    const paymentDetails = user.paymentDetails;

    // Return the paymentDetails as the response
    res.json({ paymentDetails });
  } catch (error) {
    console.error("Error fetching user subscription details:", error);
    res.status(500).json({
      error: "An error occurred while fetching user subscription details",
    });
  }
};

// exports.upload = (req, res) => {
//   multer({
//     storage: multer.diskStorage({
//       destination: function (req, file, cb) {
//         cb(null, "uploads");
//       },
//       filename: function (req, file, cb) {
//         cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
//       },
//     }),
//   }).single("file")(req, res, function (err) {
//     if (err) {
//       return res.status(400).json({
//         message: "Error uploading file",
//         error: err,
//       });
//     }
//     // File uploaded successfully, now copy it to remote server
//     const conn = new Client();

//     const userEmailId = req.body.userEmail;
//     // const bucketPath = "mega"; // Replace with the path to your bucket
//     const bucketPath = `my-bucket-${userEmailId}`;
//     const folderPath = `${bucketPath}/`; // Replace with the path to your folder
//     const fileName = req.file.filename; // Use the uploaded file name

//     const localFilePath = `uploads/${fileName}`; // Use the uploaded file path

//     conn
//       .on("ready", () => {
//         console.log("Connected to server!");

//         conn.sftp((err, sftp) => {
//           if (err) {
//             console.error(err);
//             return conn.end();
//           }

//           const remoteFilePath = `${folderPath}/${fileName}`;
//           const remoteWriteStream = sftp.createWriteStream(remoteFilePath);

//           const localReadStream = fs.createReadStream(localFilePath);

//           localReadStream.pipe(remoteWriteStream);

//           remoteWriteStream.on("close", () => {
//             console.log(`File uploaded to ${remoteFilePath}`);
//             conn.end();
//           });
//         });
//       })
//       .connect({
//         host: process.env.HOST,
//         port: process.env.HOST_PORT,
//         username: process.env.USERNAME,
//         password: process.env.PASSWORD,
//       });

//     res.send("File uploaded and copied to remote server");
//   });
// };

// exports.createBucket = async (req, res) => {
//   const conn = new Client();

//   const userId = req.user._id;
//   const user = await User.findById(userId);
//   if (!user) {
//     return res.status(404).json({ error: "User not found" });
//   }

//   console.log(user.email);
//   const bucketName = `my-bucket-${user.email}`;
//   const bucketSize = "10G";

//   conn
//     .on("ready", () => {
//       console.log("Connected to server!");
//       conn.exec(
//         `mkdir ${bucketName} && truncate -s ${bucketSize} ${bucketName}`,
//         (err, stream) => {
//           if (err) throw err;
//           stream
//             .on("close", (code, signal) => {
//               console.log(`Bucket creation complete with code ${code}`);
//               conn.end();
//             })
//             .on("data", (data) => {
//               console.log(`STDOUT: ${data}`);
//             })
//             .stderr.on("data", (data) => {
//               console.error(`STDERR: ${data}`);
//             });
//         }
//       );
//     })
//     .connect({
//       host: process.env.HOST,
//       port: process.env.HOST_PORT,
//       username: process.env.USERNAME,
//       password: process.env.PASSWORD,
//     });
//   res.send("created Bucket in server");
// };

// exports.uploadlist = (req, res) => {
//   const config = {
//     host: process.env.HOST,
//     port: process.env.HOST_PORT,
//     username: process.env.USERNAME,
//     password: process.env.PASSWORD,
//   };
//   // const userEmailId = "mahesh.o.kumar963@gmail.com";
//   const userEmailId = req.query.userEmail;
//   // const bucketPath = "mega"; // Replace with the path to your bucket
//   console.log(userEmailId);
//   const bucketPath = `my-bucket-${userEmailId}`;
//   console.log(bucketPath);
//   const folderPath = `${bucketPath}/`; // Replace with the path to your folder
//   // const bucketPath = "my-bucket-ajitsenapati94@gmail.com"; // Replace with the path to your bucket

//   const sftp = new SftpClient();

//   sftp
//     .connect(config)
//     .then(() => {
//       return sftp.list(bucketPath);
//     })
//     .then((data) => {
//       console.log("Bucket Contents:");
//       console.log(data);
//       const fileNames = data.map((file) => path.join(file.name));

//       sftp.end();

//       res.json({ fileNames }); // Send the file names as a JSON response
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).json({ error: "Failed to retrieve file list" });
//     });
// };

// exports.downloadFile = (req, res) => {
//   const config = {
//     host: process.env.HOST,
//     port: process.env.HOST_PORT,
//     username: process.env.USERNAME,
//     password: process.env.PASSWORD,
//   };
//   const { fileName, downloadDirectory, userEmailId } = req.query;
//   // const userEmailId = req.query.userEmail;
//   const localFilePath = path.join(downloadDirectory, fileName);
//   const bucketPath = `my-bucket-${userEmailId}`;
//   console.log(bucketPath);
//   const folderPath = `${bucketPath}/`;

//   const conn = new Client();
//   conn
//     .on("ready", () => {
//       console.log("Connected to SSH server!");

//       const sftp = new SftpClient();
//       sftp
//         .connect(config)
//         .then(() => {
//           console.log("Downloading file:");
//           // Check if the file exists
//           if (fs.existsSync(localFilePath)) {
//             // Set the appropriate headers
//             res.setHeader(
//               "Content-disposition",
//               `attachment; filename=${fileName}`
//             );
//             res.setHeader("Content-type", "application/octet-stream");
//             // Introduce a delay before starting the download
//             setTimeout(() => {
//               // Read the file content and send it in the response
//               const fileStream = fs.createReadStream(localFilePath);
//               fileStream.pipe(res);
//             }, 1000); // Adjust the delay time as needed

//             // Read the file content and send it in the response
//             // const fileStream = fs.createReadStream(localFilePath);
//             // fileStream.pipe(res);
//           } else {
//             res.status(404).json({ error: "File not found" });
//           }

//           const remoteFilePath = `${bucketPath}/${fileName}`;

//           console.log(`- ${remoteFilePath}`);

//           sftp
//             .fastGet(remoteFilePath, localFilePath)
//             .then(() => {
//               console.log("File downloaded successfully!");
//               sftp.end();
//               conn.end();
//               // res
//               //   .status(200)
//               //   .json({ message: "File downloaded successfully!" });
//             })
//             .catch((err) => {
//               console.error("Error downloading file:");
//               console.error(err);
//               sftp.end();
//               conn.end();
//               res.status(500).json({ error: "Failed to download the file." });
//             });
//         })
//         .catch((err) => {
//           console.error("SFTP connection error:", err);
//           conn.end();
//           res.status(500).json({ error: "SFTP connection error." });
//         });
//     })
//     .on("error", (err) => {
//       console.error("SSH connection error:", err);
//       res.status(500).json({ error: "SSH connection error." });
//     })
//     .connect(config);
// };

// exports.deleteFile = (req, res) => {
//   const config = {
//     host: process.env.HOST,
//     port: process.env.HOST_PORT,
//     username: process.env.USERNAME,
//     password: process.env.PASSWORD,
//   };

//   const { fileName, userEmailId } = req.query;
//   const bucketPath = `my-bucket-${userEmailId}`; // Replace with the appropriate bucket path
//   const remoteFilePath = `${bucketPath}/${fileName}`;

//   const conn = new Client();
//   conn
//     .on("ready", () => {
//       console.log("Connected to SSH server!");

//       const sftp = new SftpClient();
//       sftp
//         .connect(config)
//         .then(() => {
//           console.log("Deleting file:");

//           sftp
//             .delete(remoteFilePath)
//             .then(() => {
//               console.log("File deleted successfully!");
//               sftp.end();
//               conn.end();
//               res.status(200).json({ message: "File deleted successfully!" });
//             })
//             .catch((err) => {
//               console.error("Error deleting file:");
//               console.error(err);
//               sftp.end();
//               conn.end();
//               res.status(500).json({ error: "Failed to delete the file." });
//             });
//         })
//         .catch((err) => {
//           console.error("SFTP connection error:", err);
//           conn.end();
//           res.status(500).json({ error: "SFTP connection error." });
//         });
//     })
//     .on("error", (err) => {
//       console.error("SSH connection error:", err);
//       res.status(500).json({ error: "SSH connection error." });
//     })
//     .connect(config);
// };

//        Delivery form API

// API route to get all delivery addresses
// exports.getUserDeliveryAddresses = async (req, res) => {
//   console.log("USER- req.user", req.user, "Coming DATA", req.body);

//   const userId = req.user._id; // Assuming the user ID is available in req.user._id

//   try {
//     // Check if the user exists
//     const user = await User.findById(userId).populate("deliveryAddresses");
//     if (!user) {
//       // User not found
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }

//     // User exists, return their delivery addresses
//     res.status(200).json({
//       data: user.deliveryAddresses,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       success: false,
//       message: "Error retrieving delivery addresses",
//       error: err,
//     });
//   }
// };

//API route to get user delivery addresses
exports.getUserDeliveryAddresses = async (req, res) => {
  console.log("USER- req.user", req.user, "Coming DATA", req.body);

  const userId = req.user._id; // Assuming the user ID is available in req.user._id

  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      // User not found
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // User exists, return their delivery addresses
    // User exists, return their delivery addresses
    res.status(200).json(user.deliveryAddresses);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error retrieving delivery addresses",
      error: err,
    });
  }
};

// API route to add a new delivery address with MongoDB everytime
// exports.createDeliveryAddress = async (req, res) => {
//   console.log("USER- req.user", req.user, "Coming DATA", req.body);

//   const newAddress = req.body;

//   try {
//     // Get the user ID from the request (You may need to set up authentication to get the user ID)
//     const userId = req.user._id; // Assuming the user ID is available in req.user._id
//     newAddress.userId = userId;
//     // Check if the user exists
//     console.log(userId);
//     const user = await User.findById(userId);
//     console.log(user);
//     if (!user) {
//       // User does not exist, save the delivery address independently in the deliveryAddressSchema
//       const createdAddress = await DeliveryAddress.create(newAddress);
//       res.status(201).json({
//         success: true,
//         message: "Delivery address created independently",
//       });
//     } else {
//       // User exists, create the delivery address and associate it with the user
//       const createdAddress = await DeliveryAddress.create(newAddress);

//       // Add the delivery address reference to the user's deliveryAddresses array
//       await User.findByIdAndUpdate(userId, {
//         $push: { deliveryAddresses: createdAddress._id },
//       });

//       res.status(201).json({
//         success: true,
//         message: "Delivery address created and associated with the user",
//       });
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       success: false,
//       message: "Error creating delivery address",
//     });
//   }
// };

// API route to update an existing delivery address

//update the delivery address everytime
exports.createDeliveryAddress = async (req, res) => {
  console.log("USER- req.user", req.user, "Coming DATA", req.body);

  const newAddress = req.body;

  try {
    // Get the user ID from the request (You may need to set up authentication to get the user ID)
    const userId = req.user._id;
    console.log(userId);
    const user = await User.findById(userId);
    console.log(user);

    if (!user) {
      // User does not exist, respond with an error or handle as needed
      res.status(400).json({
        success: false,
        message: "User not found",
      });
    } else {
      // User exists, update or replace the delivery address in the user schema
      await User.findByIdAndUpdate(userId, {
        deliveryAddresses: newAddress, // Replace the existing address with the new one
      });

      res.status(201).json({
        success: true,
        message: "Delivery address updated and associated with the user",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error updating delivery address",
    });
  }
};

// API to update list
// exports.updateDeliveryAddress = async (req, res) => {
//   console.log("USER- req.user", req.user, "Coming DATA", req.body);

//   const addressId = req.params.id;
//   const updatedAddress = req.body;
//   const updateuserId = req.user._id; // Assuming the user ID is available in req.user._id

//   try {
//     // Check if the delivery address exists
//     const existingAddress = await DeliveryAddress.findById(addressId);
//     console.log(existingAddress);
//     if (!existingAddress) {
//       // Address not found
//       return res
//         .status(404)
//         .json({ success: false, message: "Address not found" });
//     }

//     // Verify ownership: Compare the user ID from the authenticated user with the user ID associated with the delivery address
//     if (!existingAddress.userId.equals(updateuserId)) {
//       return res.status(403).json({
//         success: false,
//         message: "You are not authorized to update this delivery address",
//       });
//     }

//     // Delivery address exists, update its details
//     const updated = await DeliveryAddress.findByIdAndUpdate(
//       addressId,
//       updatedAddress,
//       { new: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Delivery address updated successfully",
//       data: updated,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       success: false,
//       message: "Error updating delivery address",
//       error: err,
//     });
//   }
// };

// API route to delete a delivery address by ID
exports.updateDeliveryAddress = async (req, res) => {
  console.log("USER- req.user", req.user, "Coming DATA", req.body);

  const updatedAddress = req.body;
  const userId = req.user._id; // Assuming the user ID is available in req.user._id

  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      // User not found
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Update the delivery address
    user.deliveryAddresses = updatedAddress;

    // Save the updated user
    await user.save();

    res.status(200).json(updatedAddress);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error updating delivery address",
      error: err,
    });
  }
};
//API TO DELETE ADDRESS
// exports.deleteDeliveryAddress = async (req, res) => {
//   console.log("USER- req.user", req.user, "Coming DATA", req.body);

//   const addressId = req.params.id;
//   const userId = req.user._id; // Assuming the user ID is available in req.user._id

//   try {
//     // Check if the delivery address exists
//     const existingAddress = await DeliveryAddress.findById(addressId);
//     if (!existingAddress) {
//       // Address not found
//       return res
//         .status(404)
//         .json({ success: false, message: "Address not found" });
//     }

//     // Verify ownership: Compare the user ID from the authenticated user with the user ID associated with the delivery address
//     if (!existingAddress.userId.equals(userId)) {
//       return res.status(403).json({
//         success: false,
//         message: "You are not authorized to delete this delivery address",
//       });
//     }

//     // Delivery address exists and user owns the address, delete the address
//     const deleted = await DeliveryAddress.findByIdAndDelete(addressId);
//     if (!deleted) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Address not found" });
//     }

//     res
//       .status(200)
//       .json({ success: true, message: "Address deleted successfully" });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       success: false,
//       message: "Error deleting delivery address",
//       error: err,
//     });
//   }
// };

//--------------------updating new apps on exisiting apps-----------
// exports.storeUserApp = async (req, res) => {
//   console.log("USER- req.user", req.user, "Coming DATA", req.body);

//   const appDetailsArray = req.body;

//   try {
//     // Get the user ID from the request (You may need to set up authentication to get the user ID)
//     const userId = req.user._id; // Assuming the user ID is available in req.user._id

//     // Check if the user exists
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     console.log("Existing userApps:", user.userApps);

//     // Iterate over the app objects in the request body
//     for (let i = 0; i < appDetailsArray.length; i++) {
//       const newAppDetails = appDetailsArray[i];

//       // Check if the app with the given app_name exists
//       const category = await AppModel.findOne({
//         "apps.app_name": newAppDetails.app_name,
//       });
//       if (!category) {
//         return res.status(404).json({ error: "App not found" });
//       }

//       // Extract the app from the category
//       const app = category.apps.find(
//         (app) => app.app_name === newAppDetails.app_name
//       );

//       console.log(app);

//       // Check if the app is already present in the user's userApps array
//       if (!user.userApps.includes(app.app_name)) {
//         // Add the app to the user's userApps array
//         user.userApps.push(app.app_name);
//       }
//     }
//     console.log("Updated userApps:", user.userApps);

//     // Save the updated user document
//     await user.save();

//     res.status(201).json({ message: "Apps stored successfully" });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Error storing user app details" });
//   }
// };

// exports.storeUserApp = async (req, res) => {
//   console.log("USER- req.user", req.user, "Coming DATA", req.body);

//   const appDetailsArray = req.body;
//   const newAppNames = []; // To store the new app names

//   try {
//     const userId = req.user._id;
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Iterate over the app objects in the request body
//     for (let i = 0; i < appDetailsArray.length; i++) {
//       const newAppDetails = appDetailsArray[i];

//       // Check if the app with the given app_name exists
//       const category = await AppModel.findOne({
//         "apps.app_name": newAppDetails.app_name,
//       });
//       if (!category) {
//         return res.status(404).json({ error: "App not found" });
//       }

//       // Extract the app from the category
//       const app = category.apps.find(
//         (app) => app.app_name === newAppDetails.app_name
//       );

//       // Add the app_name to the newAppNames array
//       newAppNames.push(app.app_name);
//     }

//     // Replace user's userApps array with the new app names
//     user.userApps = newAppNames;

//     // Save the updated user document
//     await user.save();

//     res.status(201).json({ message: "Apps stored successfully" });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Error storing user app details" });
//   }
// };

// const { UserModel } = require("./userModel"); // Import the modified User schema

exports.storeUserApp = async (req, res) => {
  console.log("USER- req.user", req.user, "Coming DATA", req.body);

  const appDetailsArray = req.body;

  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create a Set to keep track of unique app names
    const uniqueAppNames = new Set(user.userApps);

    // Iterate over the app objects in the request body
    for (let i = 0; i < appDetailsArray.length; i++) {
      const newAppDetails = appDetailsArray[i];

      // Check if the app_name is already in the uniqueAppNames Set
      if (!uniqueAppNames.has(newAppDetails.app_name)) {
        // If the app doesn't exist in the Set, add it to the user's userApps array
        user.userApps.push(newAppDetails.app_name);
        uniqueAppNames.add(newAppDetails.app_name); // Add to the Set to prevent duplicates
      }
    }

    // Save the updated user document
    await user.save();

    res.status(201).json({ message: "Apps stored successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error storing user app details" });
  }
};

exports.getUserApps = async (req, res) => {
  console.log("USER- req.user", req.user, "Coming DATA", req.body);

  const userId = req.user._id; // Assuming the user ID is available in req.user._id

  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      // User not found
      return res.status(404).json({ message: "User not found" });
    }

    // Retrieve the user's app names
    const userAppNames = user.userApps;

    // Find the corresponding app details for the user's app names
    const userAppDetails = await AppModel.find({
      app_name: { $in: userAppNames },
    });

    // Create a response object with the required app_name and app_size fields
    const response = userAppDetails.map((app) => ({
      app_name: app.app_name,
      app_size: app.app_size,
    }));

    // Return the user app details
    res.json({ userApps: response });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Error retrieving apps" });
  }
};

// Delete User API
exports.deleteUser = async (req, res) => {
  console.log("USER- req.user", req.user, "Coming DATA", req.body);

  const userId = req.user._id; // Assuming the user ID is available in req.user._id

  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      // User not found
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    // If you also want to delete related data like user apps, you can do so here.
    // For example:
    // await AppModel.deleteMany({ owner: userId });

    // Return a success response
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Error deleting user" });
  }
};

// exports.getFaqs = async (req, res) => {
//   const data = {
//     FAQ: {
//       "Accordian 1": "This is a sample FAQ1",
//       "Accordian 2": "This is a sample FAQ2",
//       "Accordian 3": "This is a sample FAQ3",
//     },
//     "CALL US": {
//       "For Sales": "+91- 0000000",
//       "For Technical support": "+91-0000000",
//     },
//   };
//   res.json(data);
// };

// http://techmega.cloud:3000/api/getAllApps
exports.feedbackRating = async (req, res) => {
  const { rating, feedback } = req.body;
  const userId = req.user._id; // Fetching userId from the token
  console.log(rating, feedback);

  // Check if the user exists
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!rating || !feedback) {
    return res.status(400).json({ error: "Rating and feedback are required" });
  }

  const email = user.email;

  // Create new feedback
  const newFeedback = new Feedback({
    userId,
    rating,
    feedback,
  });

  try {
    const savedFeedback = await newFeedback.save();

    const imagePath = path.join(__dirname, "../assets/logo.png");
    const base64Image = await toBase64(imagePath);

    // Add additional code here to send an email notification if needed
    fs.readFile(
      path.join(__dirname, "../assets/emailTemplates/feedbackTemplate.html"),
      "utf8",
      (err, data) => {
        if (err) {
          console.log("READFILE ERROR", err);
          return res.status(500).json({ error: "Internal server error" });
        }

        // Replace placeholders with actual values
        const htmlContent = data
          .replace("{{RATING}}", rating)
          .replace("{{FEEDBACK}}", feedback)
          .replace("{{BASE64_IMAGE}}", base64Image)
          .replace("{{EMAIL}}", email);

        const emailData = {
          from: "noreply@techmega.cloud",
          to: "ajitsenapati02@techmega.cloud",
          subject: "New Feedback Received",
          html: htmlContent,
        };

        sendEmailWithNodemailerforfeeback(req, res, emailData);
      }
    );
    return res.status(200).json({
      success: "Feedback successfully submitted!",
      savedFeedback: {
        rating: savedFeedback.rating,
        feedback: savedFeedback.feedback,
      },
    });
  } catch (err) {
    console.error("Error saving feedback:", err);
    return res.status(500).json({ error: "Could not save feedback" });
  }
};
