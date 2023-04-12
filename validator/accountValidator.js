const schema = require("./schema/schema");
const baseModel = require("../models/baseModel");
const Account = baseModel.accountModel;

function validateRegister(req) {
    // Get schema for validating
    const schemaAccount = schema.schemaAccount;
    // Validate req body
    return schemaAccount.validate(req.body);
}

module.exports = {
    validateRegister: validateRegister,
};
