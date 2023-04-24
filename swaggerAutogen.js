const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    version: '3.0.0',      // by default: '1.0.0'
    title: 'Facebook REST API',        // by default: 'REST API'
    description: 'Document Swagger for Facebook API',  // by default: ''
  },
  host: 'localhost:3000',      // by default: 'localhost:3000'
  basePath: '/',  // by default: '/'
  schemes: ['http'],   // by default: ['http']
  consumes: ['application/json'],  // by default: ['application/json']
  produces: ['application/json'],  // by default: ['application/json']
  tags: [        // by default: empty Array
    {
      name: 'Account',         // Tag name
      description: 'API for Account Route',  // Tag description
    },
    {
      name: 'Activity',         // Tag name
      description: 'API for Activity Route',  // Tag description
    },
    // { ... }
  ],
  securityDefinitions: {},  // by default: empty object
  definitions: {
    Account: {
      email: "youremail@gmail.com",
      password: "yourpassword2023"
    },
    NewAccount: {
        id: 6,
        email: "testNewAccount@gmail.com",
        password: "$2a$08$f5/QJX3B7buNzcNdMsCj6O9Ki82gGvpXtyFfE.iUYJJ6FtqrEwFci",
        role: "user",
        updatedAt: "2023-04-24T17:49:11.243Z",
        createdAt: "2023-04-24T17:49:11.243Z"
    }
  },          // by default: empty object (Swagger 2.0)
  components: {}            // by default: empty object (OpenAPI 3.x)
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as: index.js, app.js, routes.js, ... */

module.export = swaggerAutogen(outputFile, endpointsFiles, doc);