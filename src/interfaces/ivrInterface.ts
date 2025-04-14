export interface IvrApiResponse {
  status: number;
  result: string;
}


export interface CallInput {
  digit: string;
}

export interface RecordingInput {
  recordingUrl: string;
  from: string;
  to: string;
}

export interface InsertCall {
  id?: number;
  caller_id: string;
  receiver_id: string;
  start_time?: string;
  status?: string;
  recording_url?: string;
}

export interface CallFilters {
  caller_id?: string;
  receiver_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
}