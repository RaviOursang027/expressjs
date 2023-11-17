const express = require("express");
const { exec } = require("child_process");
const fs = require("fs"); // File System module for reading logs
const app = express();
const cors = require("cors"); // Import the CORS package
const port = 8001;

// CORS settings for development environment
// if (process.env.NODE_ENV === "development") {
const allowedOrigins = ["http://localhost:8000", "http://techmega.cloud:8000"];

app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.post("/createvm/:vmName", async (req, res) => {
  try {
    const vmName = req.params.vmName;
    const cpuCount = 2;
    const memoryGB = 6;
    const diskSizeGB = 100;
    const diskPath = vmName; // Directly use vmName here

    // Formulate the VM creation command
    const command = `sudo virt-install --name ${vmName} --memory ${memoryGB} --vcpus ${cpuCount} --disk path=/var/lib/libvirt/images/${diskPath},size=${diskSizeGB},format=qcow2 --os-variant win10 --network network=network --cdrom /home/prabhu/Downloads/Windows_10_unattended.iso --boot cdrom`;

    // Run the VM creation command asynchronously
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error}`);
        // You can log this error and potentially alert an admin, but we will not wait for the VM creation to finish.
      }

      // You can also log stdout and stderr here for debugging purposes.
    });

    // Immediately respond to the client indicating that the VM creation process has started
    res.status(202).json({
      message: `VM creation process started for ${vmName}. You will be notified when it is ready.`,
      cpuCount: cpuCount,
      memoryGB: memoryGB,
      diskSizeGB: diskSizeGB,
    });

  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Start VM
app.post("/startvm/:vmname", (req, res) => {
  const vmName = req.params.vmname;

  exec(`virsh start ${vmName}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error}`);
      return res.status(500).json({ error: "Failed to start VM" });
    }

    res.status(200).json({ message: `Successfully started VM: ${vmName}` });
  });
});

// Stop VM
app.post("/stopvm/:vmname", (req, res) => {
  const vmName = req.params.vmname;

  exec(`virsh shutdown ${vmName}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error}`);
      return res.status(500).json({ error: "Failed to stop VM" });
    }

    res.status(200).json({ message: `Successfully stopped VM: ${vmName}` });
  });
});

// Get VM status
app.get("/statusvm/:vmName", (req, res) => {
  const vmName = req.params.vmName;

  exec(`virsh domstate ${vmName}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error}`);
      return res.status(500).json({ error: "Failed to get VM status" });
    }

    const status = stdout.trim(); // Remove any extra white spaces or new lines
    res.status(200).json({ status });
  });
});

//netowrk strength
// app.get("/networkstats/:vmName", async (req, res) => {
//   const vmName = req.params.vmName;

//   // First command to get interface
//   exec(`virsh domiflist ${vmName}`, (error1, stdout1, stderr1) => {
//     if (error1) {
//       console.error(`Error executing command to get interface: ${error1}`);
//       return res.status(500).json({ error: "Failed to get VM interface" });
//     }
//     const lines1 = stdout1.split("\n");

//     // Parse stdout to get interface
//     let interfaceName;
//     for (let line of lines1) {
//       if (line.trim().startsWith("vnet")) {
//         interfaceName = line.trim().split(/\s+/)[0];
//         break;
//       }
//     }

//     console.log(interfaceName);

//     if (interfaceName === "undefined ") {
//       return res
//         .status(404)
//         .json({
//           error:
//             "Network interface not found , Check your vm status maybe it's shutdown :)",
//         });
//     }

//     console.log(interfaceName);
//     // Second command to get network details
//     exec(
//       `virsh domifstat ${vmName} ${interfaceName}`,
//       (error2, stdout2, stderr2) => {
//         if (error2) {
//           console.error(
//             `Error executing command to get network stats: ${error2}`
//           );
//           return res.status(500).json({ error: "Failed to get network stats" });
//         }

//         // Parse stdout to get network details
//         const lines2 = stdout2.split("\n");
//         const stats = {};

//         lines2.forEach((line) => {
//           const [iface, key, value] = line.split(/\s+/);
//           if (key && value) {
//             stats[key] = value;
//           }
//         });

//         res.status(200).json({ stats });
//       }
//     );
//   });
// });

app.get("/networkstats/:vmName", async (req, res) => {
  const vmName = req.params.vmName;

  exec(`virsh domiflist ${vmName}`, (error1, stdout1, stderr1) => {
    if (error1) {
      console.error(`Error executing command to get interface: ${error1}`);
      return res.status(500).json({ error: "Failed to get VM interface" });
    }

    const lines1 = stdout1.split("\n");
    let interfaceName;

    for (let line of lines1) {
      if (line.trim().startsWith("vnet")) {
        interfaceName = line.trim().split(/\s+/)[0];
        break;
      }
    }

    if (!interfaceName) {
      return res.status(404).json({
        error:
          "Network interface not found. Check your VM status; it may be shut down.",
      });
    }

    exec(
      `virsh domifstat ${vmName} ${interfaceName}`,
      (error2, stdout2, stderr2) => {
        if (error2) {
          console.error(
            `Error executing command to get network stats: ${error2}`
          );
          return res.status(500).json({ error: "Failed to get network stats" });
        }

        const lines2 = stdout2.split("\n");
        const stats = {};

        lines2.forEach((line) => {
          const [iface, key, value] = line.split(/\s+/);
          if (key && value) {
            stats[key] = value;
          }
        });

        res.status(200).json({ stats });
      }
    );
  });
});

// Read logs
app.get("/readlogs/:vmName", (req, res) => {
  const vmName = req.params.vmName; // Get VM name from URL parameters
  const logfile = `/home/M-RDP-Backened/vm_status/${vmName}_status.log`;

  fs.readFile(logfile, "utf8", (err, data) => {
    if (err) {
      console.error(`Error reading log file: ${err}`);
      return res.status(500).json({ error: "Failed to read log file" });
    }

    res.status(200).json({ logs: data });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
