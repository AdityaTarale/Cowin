const path = require("path");
const axios = require("axios");
const Table = require("tty-table");
const { extras, options } = require("./config");
const inquirer = require("inquirer");
const notifier = require("node-notifier");

module.exports = async (pincode) => {
  let header = [
    {
      value: "center",
      headerColor: "cyan",
      color: "white",
      align: "left",
      width: 50,
      alias: "Center Name",
    },
    {
      value: "address",
      color: "red",
      width: 110,
      alias: "Address",
    },
    {
      value: "pincode",
      color: "red",
      width: 20,
      alias: "Pin code",
    },
    {
      value: "available",
      color: "yellow",
      width: 25,
      alias: "Available",
    },
    {
      value: "age",
      color: "cyan",
      width: 15,
      alias: "Min Age",
    },
    {
      value: "date",
      color: "green",
      width: 20,
      alias: "Date",
    },
  ];

  var centersArray = [];
  try {
    inquirer
      .prompt([
        {
          type: "list",
          name: "choices",
          message: "Choose your choice of age group",
          choices: [
            { name: "All ages", value: "" },
            { name: "45+", value: "45" },
            { name: "18-45", value: "18" },
          ],
        },
      ])
      .then(async (answers) => {
        const date = new Date();

        const todaysDate = `${date.getDate()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}-${date.getFullYear()}`;

        const districtData = await axios.get(
          `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pincode}&date=${todaysDate}`,
          extras
        );

        districtData.data.sessions.forEach((center) => {
          if (answers.choices === "") {
            let infoData = {
              center: center.name,
              address: center.address,
              pincode: center.pincode,
              available: center.available_capacity,
              age: center.min_age_limit,
              date: center.date,
            };
            centersArray.push(infoData);
          } else if (answers.choices == center.min_age_limit) {
            let infoData = {
              center: center.name,
              address: center.address,
              pincode: center.pincode,
              available: center.available_capacity,
              age: center.min_age_limit,
              date: center.date,
            };
            centersArray.push(infoData);
          }
        });

        if (centersArray.length > 0) {
          const outcome = Table(header, centersArray, options).render();
          console.log(outcome);

          centersArray.forEach((slot) => {
            if (slot.available >= 1) {
              notifier.notify({
                title: "Cowin slots notification",
                message: `Cowin slot is available at ${slot.center}`,
                icon: path.join(__dirname, "../covid-vaccine.png"),
              });
            }
          });
        } else if (centersArray.length == "0") {
          console.log("No slot found in your area");

          notifier.notify({
            title: "Cowin slots notification",
            message:
              "No slots were found in your area, Try with other pincode in centers list",
            icon: path.join(__dirname, "../covid-vaccine.png"),
          });
        }
      })
      .catch((error) => {
        console.log("Some error occured");
      });
  } catch (error) {
    console.log(error);
  }
};
