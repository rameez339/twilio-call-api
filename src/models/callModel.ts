import { Model } from 'objection';

class CallModel extends Model {
  id!: number;
  caller_id!: string;
  receiver_id!: string;
  start_time!: string;
  end_time?: string;
  status!: string;
  recording_url?: string;
  created_at?: string;
  updated_at?: string;

  static get tableName() {
    return 'calls';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['start_time', 'caller_id', 'receiver_id'],
      properties: {
        id: { type: 'integer' },
        caller_id: { type: 'string' },
        receiver_id: { type: 'string' },
        start_time: { type: 'string', format: 'date-time' },
        end_time: { type: 'string', format: 'date-time' },
        status: { type: 'string' },
        recording_url: { type: 'string', format: 'uri' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    };
  }
}

export default CallModel;
