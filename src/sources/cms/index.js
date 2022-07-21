import fs from "fs-extra";
import { GraphQLClient } from "graphql-request";

import * as logger from "../../helpers/logger.js";
import * as transforms from "./transforms.js";

const defaultOptions = {
  createPagesForEntryTypes: [],
};

export default class CmsSource {
  constructor(options) {
    this.options = Object.assign({}, defaultOptions, options);
  }

  get name() { return "cms"; }

  async fetchData(site) {
    if (this.options.createPagesForEntryTypes.length === 0) {
      return null;
    }

    try {
      logger.stage(`Craft CMS: Fetching data for ${site.name}...`);
      const client = await createGraphQLClient(this.options.graphQL);
      const queryGraphQL = fs.readFileSync(this.options.graphQL.queryFilePath, { encoding: "utf8" });
      const cmsData = await client.request(queryGraphQL, {
        site: site.name,
      });
  
      for (let entry of cmsData.entries) {
        entry.handle = `${entry.sectionHandle}/${entry.typeHandle}`;
      }

      transforms.transformPullOneFromArray(cmsData);
      transforms.transformBuildIndexes(cmsData);
      transforms.transformLinkRefs(cmsData);

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
    return data.entries.filter(entry => this.options.createPagesForEntryTypes.includes(entry.handle));
  }
}

async function createGraphQLClient({ endpoint, headers }) {
  logger.stage(`Craft CMS: Connecting to GraphQL endpoint '${endpoint}'...`);
  return new GraphQLClient(endpoint, { headers });
}

function formatGraphQLErrorMessage(ex) {
  let errorMessage = "Failure whilst querying GraphQL endpoint:";
  for (let error of ex.response.errors) {
    errorMessage += `\n  - ${error.message ?? error.debugMessage}`;
  }
  return errorMessage;
}
