import Joi from "joi";

export const createDoctorSchema = Joi.object({
  name: Joi.string().required(),
  workingDays: Joi.array().items(Joi.string()).min(1).required(),
  startTime: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
  endTime: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
  slotDuration: Joi.number().min(1).required(),
});

export const bookAppointmentSchema = Joi.object({
  doctorId: Joi.string().required(),
  date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
  time: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
  userName: Joi.string().min(2).required(),
});