/**
 * API Documentation Index
 * 
 * This file imports all API documentation modules.
 * Import this file in your routes to enable Swagger documentation.
 */

import './docs/auth.docs';
import './docs/kyc.docs';
import './docs/users.docs';
import './docs/vehicles.docs';
import './docs/vehicles.category.docs';
import './docs/vehicles.types.docs';
import './docs/battery.docs';
import './docs/activity.docs';
import './docs/hub.docs';
import './docs/api.logs.docs';
import './docs/transactions.docs';


export default {
  auth: require('./docs/auth.docs'),
  kyc: require('./docs/kyc.docs'),
  users: require('./docs/users.docs'),
  vehicles: require('./docs/vehicles.docs'),
  vehiclesCategory: require('./docs/vehicles.category.docs'),
  vehiclesTypes: require('./docs/vehicles.types.docs'),
  batteries: require('./docs/battery.docs'),
  activities: require('./docs/activity.docs'),
  hubs: require('./docs/hub.docs'),
  apiLogs: require('./docs/api.logs.docs'),
  transactions: require('./docs/transactions.docs'),
};
