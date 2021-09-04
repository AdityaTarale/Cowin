#! /usr/bin/env node

const states = require("../utils/states");
const districts = require("../utils/districts");
const centers = require("../utils/centers");
const pincode = require("../utils/pincode");
const program = require("commander");

program
  .command("states")
  .description("List down all the states")
  .action(states);
program
  .command("districts <stateId>")
  .description("List down all the district")
  .action(districts);
program
  .command("centers <districtId>")
  .description("List down all the district")
  .action(centers);
program
  .command("pincode <pincode>")
  .description("Search using your area pincode")
  .action(pincode);

program.parse();
