import ivrService from './ivrService';
import ivrValidation from './ivrValidation';
import { logger } from '../../logger';
import { RecordingInput, CallInput, CallFilters } from '../../interfaces';


class ivrController {

  public static sayHello = () => {
    try {
      logger.info('/ivr/hello endpoint hit');
      const response = ivrService.getHelloMessage();
      logger.info({ response }, '/ivr/hello endpoint response');
      return response;
    }
    catch (error) {
      logger.error('Error in sayHello:', error);
      return {
        message: 'An error occurred while processing your request.',
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 500,
      }
    }
  };

  public static getFilteredCalls = async (payload: CallFilters) => {
    try {
      const { error } = ivrValidation.callFilterSchema.validate(payload);
      if (error) {
        logger.error('Validation error:', error.details[0].message);
        return {
          status: 400,
          response: error.details[0].message,
        }
      }
      
      const filters = payload;
      const response = await ivrService.getFilteredCalls(filters);
      return response;
    } catch (error) {
      return {
        message: 'An error occurred while processing your request.',
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 500,
      }
    }
  };

  public static ivr() {
    try {
      const response = ivrService.generateIVRMenu();
      return response;
    }
    catch (error) {
      logger.error('Error in /ivr:', error);
      return {
        message: 'An error occurred while processing your request.',
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 500,
      }
    }
  }

  public static handleKey(payload: CallInput) {
    try {
      const { error } = ivrValidation.handleKeySchema.validate(payload);
      if (error) {
        logger.error('Validation error:', error.details[0].message);
        return {
          status: 400,
          response: error.details[0].message,
        }
      }
      const response = ivrService.handleKeyPress(payload);
      return response
    } catch (error) {
      logger.error('Error in /ivr/handleKey:', error);
      return {
        message: 'An error occurred while processing your request.',
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 500,
      }
    }

  }

  public static handleRecording(payload: RecordingInput) {
    try {
      const { error } = ivrValidation.recordingSchema.validate(payload);
      if (error) {
        logger.error('Validation error:', error.details[0].message);
        return {
          status: 400,
          response: error.details[0].message,
        }
      }

      logger.debug(payload, 'Voicemail received:');
      const response = ivrService.handleRecording(payload);
      return response;
    } catch (error) {
      logger.error('Error in /ivr/handleRecording:', error);
      return {
        message: 'An error occurred while processing your request.',
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 500,
      }
    }
  }
}

export default ivrController;
