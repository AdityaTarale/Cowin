const path = require("path");
const axios = require("axios");
const Table = require("tty-table");
const { extras, options } = require("./config");
const inquirer = require("inquirer");
const notifier = require("node-notifier");

module.exports = async (districtId) => {
  let header = [
    {
      value: "center",
      color: "white",
      align: "left",
      width: 60,
      alias: "Center Name",
    },
    {
      value: "address",
      color: "red",
      width: 90,
      alias: "Address",
    },
    {
      value: "pincode",
      color: "white",
      width: 25,
      alias: "Pin code",
    },
    {
      value: "available",
      color: "yellow",
      width: 15,
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
          `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${districtId}&date=${todaysDate}`,
          extras
        );

        districtData.data.centers.forEach((center) => {
          center.sessions.forEach((session) => {
            if (answers.choices === "") {
              let infoData = {
                center: center.name,
                address: center.address,
                pincode: center.pincode,
                available: session.available_capacity,
                age: session.min_age_limit,
                date: session.date,
              };
              centersArray.push(infoData);
            } else if (answers.choices == session.min_age_limit) {
              let infoData = {
                center: center.name,
                address: center.address,
                pincode: center.pincode,
                available: session.available_capacity,
                age: session.min_age_limit,
                date: session.date,
              };
              centersArray.push(infoData);
            }
          });
        });
        if (centersArray.length > 0) {
          const outcome = Table(header, centersArray, options).render();
          console.log(outcome);
          notifier.notify({
            title: "Cowin slot notification",
            message:
              "cowin cli run successfully , check which center has slots availability",
            icon: path.join(__dirname, "../covid-vaccine.png"),
            wait: true,
          });
        } else if (centersArray.length == "0") {
          console.log("No slot found in your area");
          notifier.notify({
            title: "Cowin slots notification",
            message: "No slots were found , Try again after some time",
            icon: path.join(__dirname, "../covid-vaccine.png"),
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
};
