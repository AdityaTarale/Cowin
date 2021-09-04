const axios = require("axios");
const Table = require("tty-table");

const { extras, options } = require("./config");

module.exports = async () => {
  let header = [
    {
      value: "state_id",
      headerColor: "cyan",
      color: "white",
      align: "left",
      width: 20,
      alias: "State ID",
    },
    {
      value: "state_name",
      color: "red",
      width: 40,
      alias: "State Name",
    },
  ];

  try {
    const stateData = await axios.get(
      "https://cdn-api.co-vin.in/api/v2/admin/location/states",
      extras
    );

    const outcome = Table(header, stateData.data.states, options).render();
    console.log(outcome);
  } catch (error) {
    console.log(error);
  }
};
