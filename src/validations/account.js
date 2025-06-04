const Joi = require('joi');

const AccountSchemaSignInValid = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(5)
        .max(30)
        .required(),

    password: Joi.string()
        .min(5)
        .max(30)
        .pattern(new RegExp('^[a-zA-Z0-9@#$%^&*]{5,30}$'))
        .required(),
})

module.exports = (account) => AccountSchemaSignInValid.validate(account)
