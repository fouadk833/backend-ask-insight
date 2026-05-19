import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { getFastApiBaseUrl } from 'src/utils/url.util';

dotenv.config();

@Injectable()
export class WorkFlowService {

  async initiateWorkFlow() {
    console.log('Request to initiate workflow received');

    const response = await axios.post(
      `${getFastApiBaseUrl()}/datapella/initiate_workflow`,
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
