const axios = require("axios");
const User = require("../models/user");

exports.createVirtualMachine = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const vmName = user.email.split("@")[0];

    // Make API call to service running on port 8001 to create the VM
    const response = await axios.post(
      `http://localhost:8001/createvm/${vmName}`
    );

    if (response.data.error) {
      return res.status(500).json({ error: "Failed to create VM" });
    }

    // Add VM details to user record in DB
    user.virtualMachines.push({
      vmName: vmName,
      cpuCount: response.data.cpuCount,
      memoryGB: response.data.memoryGB,
    });

    await user.save();
    res.status(200).json(response.data);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send(error);
  }
};

exports.startVM = async (req, res) => {
  try {
    console.log(req.user._id);
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const vmName = user.email.split("@")[0];
    // Check if the VM exists in user schema
    if (!user.virtualMachines.includes(vmName)) {
      return res.status(404).json({ message: "VM does not exist" });
    }

    const response = await axios.post(
      `http://localhost:8001/startvm/${vmName}`
    );
    // return response.data;
    res.json(response.data); // send response back
  } catch (error) {
    console.error(`Failed to start VM: ${error}`);
    return { error: "Failed to start VM" };
  }
};

exports.stopVM = async (req, res) => {
  try {
    console.log(req.user._id);
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const vmName = user.email.split("@")[0];

    // Check if the VM exists in user schema
    if (!user.virtualMachines.includes(vmName)) {
      return res.status(404).json({ message: "VM does not exist" });
    }

    const response = await axios.post(`http://localhost:8001/stopvm/${vmName}`);
    // return response.data;
    res.json(response.data); // send response back
  } catch (error) {
    console.error(`Failed to stop VM: ${error}`);
    return { error: "Failed to stop VM" };
  }
};

exports.getVMStatus = async (req, res) => {
  try {
    console.log(req.user._id);
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const vmName = user.email.split("@")[0];

    // const vmName = "vm123";
    console.log(vmName);

    // Check if the VM exists in user schema
    if (!user.virtualMachines.includes(vmName)) {
      return res.status(404).json({ message: "VM does not exist" });
    }

    const response = await axios.get(
      `http://localhost:8001/statusvm/${vmName}`
    );
    // return response.data;
    res.json(response.data); // send response back
  } catch (error) {
    console.error(`Failed to get VM status: ${error}`);
    return { error: "Failed to get VM status" };
  }
};

exports.getNetworkStats = async (req, res) => {
  try {
    console.log(req.user._id);
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // for time being added hard coded vm anme
    const vmName = user.email.split("@")[0];
    // const vmName = "vm123";

    // Check if the VM exists in user schema
    if (!user.virtualMachines.includes(vmName)) {
      return res.status(404).json({ message: "VM does not exist" });
    }

    const response = await axios.get(
      `http://localhost:8001/networkstats/${vmName}`
    );
    console.log(response);
    // return response.data;
    res.json(response.data); // send response back
  } catch (error) {
    // console.error(`Failed to get network stats: ${error}`);
    console.error(`Failed to get network stats check vm status: ${error}`);
    res
      .status(500)
      .json({ error: "Failed to get network stats check vm status" }); // send error response back
  }
};
//logs without duration and plan

// exports.readLogs = async (req, res) => {
//   try {
//     console.log(req.user._id);
//     const userId = req.user._id;
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     // Check if the VM exists in user schema
//     // if (!user.virtualMachines.includes(vmName)) {
//     //   return res.status(404).json({ message: "VM does not exist" });
//     // }

//     // const vmName = user.email.split("@")[0];
//     const vmName = "vm123";

//     const response = await axios.get(
//       `http://localhost:8001/readlogs/${vmName}`
//     );
//     res.status(200).json(response.data);

//     // return response.data;
//   } catch (error) {
//     console.error(`Failed to read logs: ${error}`);
//     return { error: "Failed to read logs" };
//   }
// };

//logs with duration and plan

const msToTime = (duration) => {
  const days = Math.floor(duration / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((duration % (1000 * 60)) / 1000);

  return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
};

exports.readLogs = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const planName = user.paymentDetails.planName; // Get the plan name from user schema

    // Dummy vmName for testing
    // const vmName = "vm123";

    // for time being added hard coded vm anme
    const vmName = user.email.split("@")[0];
    // const vmName = "vm123";

    // Check if the VM exists in user schema
    if (!user.virtualMachines.includes(vmName)) {
      return res.status(404).json({ message: "VM does not exist" });
    }

    const response = await axios.get(
      `http://localhost:8001/readlogs/${vmName}`
    );
    const logs = response.data.logs.split("\n");

    const sessionData = []; // To hold our session data
    let startTime;
    let endTime;

    for (let log of logs) {
      if (!log) continue; // Skip empty log lines

      const logParts = log.split(" - ");
      if (logParts.length < 2) continue; // Skip improperly formatted log lines

      const timestamp = new Date(logParts[0]);
      const status = logParts[1];

      if (status && status.includes("running")) {
        startTime = timestamp;
      } else if (status && status.includes("shut off") && startTime) {
        endTime = timestamp;
        const duration = endTime - startTime; // Calculate duration
        const humanReadableDuration = msToTime(duration); // Convert to human-readable format
        sessionData.push({
          loginTime: startTime,
          logoutTime: endTime,
          // duration: duration,
          duration: humanReadableDuration, // Add this field
          planName: planName,
        });
        startTime = null;
        endTime = null;
      }
    }

    res.status(200).json({
      sessionData,
    });
  } catch (error) {
    console.error(`Failed to read logs: ${error}`);
    res.status(500).json({ error: "Failed to read logs" });
  }
};

// exports.readLogs = async (req, res) => {
//     try {
//       const userId = req.user._id;
//       const user = await User.findById(userId);

//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       const planName = user.paymentDetails.planName; // Get the plan name from user schema

//       // Dummy vmName for testing
//       const vmName = "vm123";

//       const response = await axios.get(`http://localhost:8001/readlogs/${vmName}`);
//       const logs = response.data.logs.split("\n");

//       const sessionData = []; // To hold our session data
//       let startTime;
//       let endTime;
//       let vmStatusDetails;

//       for (let log of logs) {
//         if (!log) continue; // Skip empty log lines

//         const logParts = log.split(" - ");
//         if (logParts.length < 2) continue; // Skip improperly formatted log lines

//         const timestamp = new Date(logParts[0]);
//         const status = logParts[1];

//         if (status && status.includes("running")) {
//           startTime = timestamp;
//           vmStatusDetails = `${vmName} is running`;
//         } else if (status && status.includes("shut off") && startTime) {
//           endTime = timestamp;
//           const duration = endTime - startTime; // Calculate duration
//           sessionData.push({
//             loginTime: startTime,
//             logoutTime: endTime,
//             duration: duration,
//             planName: planName,
//             vmStatusDetails: vmStatusDetails,
//           });
//           vmStatusDetails = `${vmName} is shut off`;
//           startTime = null;
//           endTime = null;
//         }
//       }

//       res.status(200).json({
//         sessionData,
//       });
//     } catch (error) {
//       console.error(`Failed to read logs: ${error}`);
//       res.status(500).json({ error: "Failed to read logs" });
//     }
//   };
