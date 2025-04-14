import Joi, { ObjectSchema } from 'joi';
import { Request, Response, NextFunction } from 'express';

class ivrValidation {

  public static handleKeySchema = Joi.object({
    digit: Joi.string().pattern(/^[0-9]$/).required(),
  });

  public static recordingSchema = Joi.object({
    RecordingUrl: Joi.string().uri().required(),
    From: Joi.string().required(),
    To: Joi.string().required(),
  });

  public static callFilterSchema = Joi.object({
    caller_id: Joi.string().optional(),
    receiver_id: Joi.string().optional(),
    status: Joi.string().valid('completed', 'failed', 'in-progress', 'pending').optional(),
    start_date: Joi.date().iso().optional(),
    end_date: Joi.date().iso().optional(),
  });
}

export default ivrValidation;
