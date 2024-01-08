import joi from "joi";
import JoiPasswordComplexity from "joi-password-complexity";

const baseSchema = {
  firstName: joi.string().min(3).required(),
  lastName: joi.string().min(3).required(),
  email: joi.string().min(6).required().email(),
  phone: joi.number().min(3).required(),
  role: joi.string().required(),
  info: joi.string().allow("").optional(),
};

export const registerValidation = (data) => {
  const schema = joi.object(baseSchema);
  return schema.validate(data);
};

export const registerPatientValidation = (data) => {
  const schema = joi.object({
    ...baseSchema,
    dateOfBirth: joi.date().iso().max("now").required(),
    address: joi.string().min(3).required(),
    OIB: joi.string().min(11).max(11).required(),
    MBO: joi.string().min(9).max(9).required(),
    insurance: joi.string().allow("").optional(),
  });

  return schema.validate(data);
};

export const loginValidation = (data) => {
  const schema = joi.object({
    email: joi.string().min(6).required().email(),
    password: joi.string().min(6).required(),
  });

  return schema.validate(data);
};

const complexityOptions = {
  min: 5,
  max: 1024,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4,
};

export const passwordValidation = (data) => {
  const passwordSchema = joi.object({
    password: JoiPasswordComplexity(complexityOptions),
    confirmPassword: joi.string().required().valid(joi.ref("password")),
  });

  return passwordSchema.validate(data);
};
