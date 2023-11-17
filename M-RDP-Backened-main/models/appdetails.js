const mongoose = require("mongoose");

const appSchema = new mongoose.Schema(
  {
    app_name: String,
    app_size: String,
    app_description: String,
  },
  { versionKey: false } // Disable the versionKey (__v) field
);

const AppModel = mongoose.model("AppModel", appSchema);

const insertAppData = async () => {
  const data = [
    {
      app_name: "VLC media player",
      app_size: "38MB",
      app_description:
        "VLC is a free and open source cross-platform multimedia player and framework that plays most multimedia files as well as DVDs, Audio CDs, VCDs, and various streaming protocols.",
    },
    {
      app_name: "Khan Academy",
      app_size: "80KB",
      app_description:
        "Learn for free about math, art, computer programming, economics, physics, chemistry, biology, medicine, finance, history, and more",
    },
    {
      app_name: "Fire Fox",
      app_size: "390KB",
      app_description: "Get the browser that protects what’s important",
    },
    {
      app_name: "Google Chrome",
      app_size: "150MB",
      app_description: "Fast, secure, and customizable web browser by Google.",
    },
    {
      app_name: "steam",
      app_size: "2.2MB",
      app_description:
        "Steam is the ultimate destination for playing, discussing, and creating games.",
    },
    {
      app_name: "Youtube",
      app_size: "90MB",
      app_description:
        "Listen to music and videos from around the world on Spotify.",
    },
    {
      app_name: "Whatsapp",
      app_size: "70MB",
      app_description:
        "Simple and secure messaging and calling app by Facebook.",
    },
    {
      app_name: "Linkedin",
      app_size: "300MB",
      app_description: "Create, edit, and collaborate with MS Office apps.",
    },
    {
      app_name: "Epic Games launcher",
      app_size: "200MB",
      app_description:
        "The Epic Game Launcher is a popular game launcher and storefront that allows users to easily access and play their Epic Games titles.",
    },
    {
      app_name: "Twitter",
      app_size: "180MB",
      app_description: "Digital distribution platform for games and software.",
    },
    {
      app_name: "Linkedin Learning",
      app_size: "150MB",
      app_description: "Fast, secure, and customizable web browser by Google.",
    },
    {
      app_name: "Telegram",
      app_size: "50MB",
      app_description: "Fast and secure messaging app with a focus on privacy.",
    },
    {
      app_name: "Daily hunt",
      app_size: "90MB",
      app_description:
        "The Epic Game Launcher is a popular game launcher and storefront that allows users to easily access and play their Epic Games titles.",
    },
    {
      app_name: "Discord",
      app_size: "70MB",
      app_description:
        "Simple and secure messaging and calling app by Facebook.",
    },
  ];

  try {
    for (const item of data) {
      const { app_name } = item;

      const existingitem = await AppModel.findOne({ app_name });

      if (!existingitem) {
        // Category does not exist, insert the data
        await AppModel.create(item);
        console.log(`Data inserted for item: ${item.app_name}`);
      } else {
        // Category exists, update the existing data
        // existingCategory.apps = apps;
        // existingCategory.spacerequired = spacerequired;
        await existingitem.save();
        console.log(`Data updated for item: ${item.app_name}`);
      }
      // // Insert each app data
      // await AppModel.create(item);
      // console.log(`Data inserted for app: ${item.app_name}`);
    }

    console.log("All data insertion completed.");
  } catch (err) {
    console.error("Error inserting data:", err);
  }
};

module.exports = {
  insertAppData,
  AppModel,
};
