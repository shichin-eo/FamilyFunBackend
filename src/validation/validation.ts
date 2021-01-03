import Joi from "@hapi/joi";
//*------------------------------------------------------

//!--- Register Validation
export const registerValidation = (data: object): Joi.ValidationResult => {
  const schema = Joi.object({
    user_name: Joi.string().required(),
    user_surname: Joi.string().required(),
    user_email: Joi.string().min(6).required().email(),
    user_password: Joi.string().min(8).required(),
    user_birthdate: Joi.date(),
    user_sex: Joi.string(),
  });
  return schema.validate(data);
};

//!--- Login Validation
export const loginValidation = (data: object): Joi.ValidationResult => {
  const schema = Joi.object({
    // user_name: Joi.string().required(),
    // user_surname: Joi.string().required(),
    user_email: Joi.string().min(6).required().email(),
    user_password: Joi.string().min(8).required(),
    // user_birthdate: Joi.date(),
    // user_sex: Joi.string(),
  });
  return schema.validate(data);
};
