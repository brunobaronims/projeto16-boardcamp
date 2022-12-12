import joi from "joi";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

dayjs.extend(customParseFormat);
const date = (value, helpers) => {
  if (!dayjs(value, 'YYYY-MM-DD', true).isValid())
    return helpers.error('any.invalid')
  return value;
}

export const customerSchema = joi.object({
  name: joi.string()
  .required()
  .trim()
  .messages({
    'string.base': 'Nome inválido'
  }),
  phone: joi.string()
  .required()
  .trim()
  .min(10)
  .max(11)
  .messages({
    'string.base': 'Número inválido',
    'string.min': 'Número deve ter pelo menos 10 caracteres',
    'string.max': 'Número deve ter no máximo 11 caracteres'
  }),
  cpf: joi.string()
  .required()
  .trim()
  .length(11)
  .messages({
    'string.base': 'CPF inválido',
    'string.length': 'CPF deve ter 11 caracteres'
  }),
  birthday: joi.string()
  .required()
  .trim()
  .custom(date, 'date validation')
  .messages({
    'any.invalid': 'Data inválida',
    'any.required': 'Insira um aniversário'
  })
});