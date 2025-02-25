const Joi = require('joi');

const validateTask = (req, res, next) => {
    const schema = Joi.object({
        description: Joi.string().min(3).max(255).required(),
        completed: Joi.boolean()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).send({ error: error.details[0].message });
    }
    
    next();
};

module.exports = validateTask;
