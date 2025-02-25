const Joi = require('joi');

const validateUser = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        age: Joi.number().integer().min(0),
        role: Joi.string().valid('user', 'admin').default('user') 
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).send({ error: error.details[0].message });
    }
    
    next();
};

module.exports = validateUser;
