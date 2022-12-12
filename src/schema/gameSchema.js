import joi from "joi";

export const gameSchema = joi.object({
  name: joi.string()
  .required()
  .trim()
  .messages({
    'string.base': 'Nome inválido'
  }),
  image: joi.string()
  .trim(),
  stockTotal: joi.number()
  .required()
  .greater(0)
  .messages({
    'number.greater': 'Contagem de estoque deve ser maior que 0'
  }),
  categoryId: joi.number()
  .required(),
  pricePerDay: joi.number()
  .required()
  .greater(0)
  .messages({
    'number.greater': 'Preço deve ser maior que 0'
  })
})