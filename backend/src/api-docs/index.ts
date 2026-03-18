/**
 * API Documentation Index
 *
 * This file imports all API documentation modules.
 * Import this file in your routes to enable Swagger documentation.
 */

import "./docs/auth.docs";
import "./docs/users.docs";
import "./docs/activity.docs";
import "./docs/api.logs.docs";

export default {
  auth: require("./docs/auth.docs"),
  users: require("./docs/users.docs"),
  activities: require("./docs/activity.docs"),
  apiLogs: require("./docs/api.logs.docs"),
};
