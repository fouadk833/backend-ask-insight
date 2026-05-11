import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class WorkFlowService {
  private readonly fastApiUrl =
    process.env.FASTAPI_URL || 'http://localhost:8000';

  async initiateWorkFlow() {
    console.log('Request to initiate workflow received');

    const response = await axios.post(
      `${this.fastApiUrl}/datapella/initiate_workflow`,
      {
        workflow_name: 'datapella_text_to_sql_wf',
        workflow_uuid: '',
        user_id: '',
        params: {},
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data; // returns the workflow uuid
  }
}
