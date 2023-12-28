import fs from "fs-extra";

import * as logger from "./helpers/logger";

const defaultOptions = {
};

export default class githubSource {
  constructor(options) {
    this.options = Object.assign({}, defaultOptions, options);
  }

  get name() { return "github"; }

  async fetchData(site) {
    try {
      logger.stage(`GitHub: Fetching data for ${site.name}...`);

      const { createClient, endpoint, headers } = this.options.graphQL;
      logger.step(`Connecting to GraphQL endpoint '${endpoint}'...`);
      const client = createClient(endpoint, { headers });

      const { queryFilePath } = this.options.graphQL;
      logger.step(`Loading GraphQL query '${queryFilePath}'...`);
      const queryGraphQL = fs.readFileSync(queryFilePath, { encoding: "utf8" });

      logger.step(`Requesting data...`);
      const data = await client.request(queryGraphQL, {
        site: site.name,
      });

      return data;
    }
    catch (ex) {
      if (ex?.response?.errors) {
        throw new Error(formatGraphQLErrorMessage(ex));
      }
      else {
        throw ex;
      }
    }
  }

  async createPages(site, data) {
    return [];
  }
}

function formatGraphQLErrorMessage(ex) {
  let errorMessage = "Failure whilst querying GraphQL endpoint:";
  for (let error of ex.response.errors) {
    errorMessage += `\n  - ${error.message ?? error.debugMessage}`;
  }
  return errorMessage;
}
