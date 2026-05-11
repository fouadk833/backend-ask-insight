import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class MetaDataService {
  private readonly fastApiUrl =
    process.env.FASTAPI_URL || 'http://localhost:8000';

  async getMetaDataKeys() {
    console.log('Getting metadata keys...');

    const response = await axios.get(`${this.fastApiUrl}/metadata_keys`);
    return response.data;
  }

  async getMetaDataDimentions(metadataKey: string) {
    console.log('Getting metadata dimentions...');
    const response = await axios.get(
      `${this.fastApiUrl}/dimentions_metadata`,
      { params: { metadata_key: metadataKey } }
    );
    return response.data;
  }

  async getMetaDataQuestions(metadataKey: string) {
    console.log('Getting metadata questions...');
    const response = await axios.get(
      `${this.fastApiUrl}/questions_metadata`,
      { params: { metadata_key: metadataKey } }
    );
    return response.data;
  }
  async getMetaDataPrompts(metadataKey: string, user_email: string) {
    console.log('Getting metadata prompts...');
    const response = await axios.get(
      `${this.fastApiUrl}/metadata/prompts`,
      { params: { metadata_key: metadataKey, user_email: user_email } }
    );
    return response.data;
  }

  async fecthLatestDateData() {
    console.log('Getting latest date data from cir_circana...');
    const response = await axios.get(
      `${this.fastApiUrl}/latest-date`,
    );
    return response.data;
  }
}
