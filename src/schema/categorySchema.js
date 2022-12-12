import joi from 'joi';

export const categorySchema = joi.object({
  name: joi.string()
  .required()
  .trim()
  .messages({
    'any.required': 'Nome da categoria não deve ser vazio',
    'string.base': 'Nome inválido',
  })
})