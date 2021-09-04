const axios = require("axios");
const Table = require("tty-table");
const { extras, options } = require("./config");

module.exports = async (stateId) => {
  let header = [
    {
      value: "district_id",
      headerColor: "cyan",
      color: "white",
      align: "left",
      width: 15,
      alias: "District ID",
    },
    {
      value: "district_name",
      color: "red",
      width: 40,
      alias: "District Name",
    },
  ];

  try {
    const districtData = await axios.get(
      `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${stateId}`,
      extras
    );

    const outcome = Table(
      header,
      districtData.data.districts,
      options
    ).render();
    console.log(outcome);
  } catch (error) {
    console.log(error);
  }
};
