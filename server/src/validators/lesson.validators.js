const Joi = require('joi');

const createLessonSchema = Joi.object({
  subject_id: Joi.number().integer().required(),
  title: Joi.string().max(255).required(),
  content: Joi.string().allow(null, ''),
  order_index: Joi.number().integer().min(1).optional(),
  xp_reward: Joi.number().integer().min(0).default(50),
  estimated_minutes: Joi.number().integer().min(1).default(10),
});

const updateLessonSchema = Joi.object({
  title: Joi.string().max(255),
  content: Joi.string().allow(null, ''),
  order_index: Joi.number().integer().min(1),
  xp_reward: Joi.number().integer().min(0),
  estimated_minutes: Joi.number().integer().min(1),
  is_active: Joi.boolean(),
}).min(1);

module.exports = {
  createLessonSchema,
  updateLessonSchema,
};