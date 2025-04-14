import { twiml as TwilioTwiml } from 'twilio';
import { IvrApiResponse, RecordingInput, CallInput, InsertCall, CallFilters } from '../../interfaces';
import callModel from '../../models/callModel';

const VERIFIED_PHONE_NUMBER: string = process.env.VERIFIED_PHONE_NUMBER || '+923018508499';

class IVRService {
  public getHelloMessage(): IvrApiResponse {
    return { status: 200, result: 'Hello from Node.js + TWILIO!' };
  }

  public  getFilteredCalls = async (filters: CallFilters) => {
    let query = callModel.query();
  
    if (filters.caller_id) {
      query = query.where('caller_id', filters.caller_id);
    }
    if (filters.receiver_id) {
      query = query.where('receiver_id', filters.receiver_id);
    }
    if (filters.status) {
      query = query.where('status', filters.status);
    }
    if (filters.start_date) {
      query = query.where('start_time', '>=', filters.start_date);
    }
    if (filters.end_date) {
      query = query.where('start_time', '<=', filters.end_date);
    }
  
    const results =  await query.orderBy('start_time', 'desc');
    return { status: 200, result: results };
  };

  public generateIVRMenu(): IvrApiResponse {
    const twiml = new TwilioTwiml.VoiceResponse();
    const gather = twiml.gather({
      input: ['dtmf'],
      numDigits: 1,
      action: '/handle-key',
      method: 'POST'
    });

    gather.say('Welcome to TuringTech! Press 1 to talk to support, or 2 to leave a voicemail.');
    return { status: 200, result: twiml.toString() };
  }

  public handleKeyPress(payload: CallInput): IvrApiResponse {
    const twiml = new TwilioTwiml.VoiceResponse();
    const { digit } = payload;

    if (digit == '1') {
      twiml.say('Connecting you to support...');
      twiml.dial(VERIFIED_PHONE_NUMBER);

    } else if (digit == '2') {
      twiml.say('Please leave a message after the beep.');
      twiml.record({
        maxLength: 30,
        action: '/handle-recording',
        method: 'POST'
      });

    } else {
      twiml.say('Invalid option. Please try again.');
      twiml.redirect('/ivr');
    }

    return { status: 200, result: twiml.toString() };
  }

  public async handleRecording(payload: RecordingInput): Promise<IvrApiResponse> {
    const twiml = new TwilioTwiml.VoiceResponse();

    await callModel.query().insert({
      caller_id: payload.from || VERIFIED_PHONE_NUMBER,
      receiver_id: payload.to || VERIFIED_PHONE_NUMBER,
      start_time: new Date().toISOString(),
      status: 'recorded',
      recording_url: payload.recordingUrl || 'https://example.com/recording.mp3',
    } as InsertCall);

    twiml.say('Thank you for your message. Goodbye.');

    return { status: 200, result: twiml.toString() };
  }
}
  

export default new IVRService();
