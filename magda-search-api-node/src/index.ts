import express from "express";
import * as yargs from "yargs";

import createApiRouter from "./createApiRouter";
import addJwtSecretFromEnvVar from "@magda/typescript-common/dist/session/addJwtSecretFromEnvVar";

const argv = addJwtSecretFromEnvVar(
    yargs
        .config()
        .help()
        .option("listenPort", {
            describe: "The TCP/IP port on which the search-api should listen.",
            type: "number",
            default: 6969
        })
        .option("esHost", {
            describe: "The host running the auth database.",
            type: "string",
            default: "localhost"
        })
        .option("esPort", {
            describe: "The port running the auth database.",
            type: "number",
            default: 5432
        })
        .option("jwtSecret", {
            describe: "The shared secret for intra-network communication",
            type: "string"
        })
        .option("datasetsIndexId", {
            describe: "The id of the datasets index in elasticsearch",
            type: "string"
        })
        .option("regionsIndexId", {
            describe: "The id of the regions index id",
            type: "string"
        })
        .option("publishersIndexId", {
            describe: "The id of the publishers index id",
            type: "string"
        }).argv
);

// Create a new Express application.
const app = express();
// app.use(require("body-parser").json());

app.use(
    "/v0",
    createApiRouter({
        jwtSecret: argv.jwtSecret,
        datasetsIndexId: argv.datasetsIndexId,
        regionsIndexId: argv.regionsIndexId,
        publishersIndexId: argv.publishersIndexId
    })
);

app.listen(argv.listenPort);
console.log("Search API started on port " + argv.listenPort);

process.on("unhandledRejection", (reason: string, promise: any) => {
    console.error("Unhandled rejection:");
    console.error(reason);
});