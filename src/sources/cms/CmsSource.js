import fs from "fs-extra";

import * as logger from "../../helpers/logger.js";
import transformBuildIndexes from "./transformBuildIndexes.js";
import transformLinkRefs from "./transformLinkRefs.js";
import transformPullOneFromArray from "./transformPullOneFromArray.js";

const defaultOptions = {
};

export default class CmsSource {
  constructor(options) {
    this.options = Object.assign({}, defaultOptions, options);
  }

  get name() { return "cms"; }

  async fetchData(site) {
    try {
      logger.stage(`Craft CMS: Fetching data for ${site.name}...`);

      const { createClient, endpoint, headers } = this.options.graphQL;
      logger.step(`Connecting to GraphQL endpoint '${endpoint}'...`);
      const client = createClient(endpoint, { headers });

      const { queryFilePath } = this.options.graphQL;
      logger.step(`Loading GraphQL query '${queryFilePath}'...`);
      const queryGraphQL = fs.readFileSync(queryFilePath, { encoding: "utf8" });

      logger.step(`Requesting data...`);
      const cmsData = await client.request(queryGraphQL, {
        site: site.name,
      });

      transformPullOneFromArray(cmsData);
      transformBuildIndexes(cmsData);
      transformLinkRefs(cmsData);

      return cmsData;
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

  createPages(site, data) {
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
