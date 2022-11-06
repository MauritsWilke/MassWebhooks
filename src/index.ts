#!/usr/bin/env node
import { Styling } from "./styling.js";
const Style = new Styling();

console.log(Style.default("Cheat codes for formatting"));
console.log(Style.error("Cheat codes for formatting"));
console.log(Style.warning("Cheat codes for formatting"));
console.log(Style.success("Cheat codes for formatting"));