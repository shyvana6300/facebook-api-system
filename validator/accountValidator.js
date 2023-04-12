const schema = require("./schema/schema");

function validateRegister(req) {
    // Get schema for validating
    const schemaAccount = schema.schemaAccount;
    // Validate req body
    return schemaAccount.validate(req.body);
}

module.exports = {
    validateRegister: validateRegister,
};
