import { Injectable } from '@nestjs/common';
import {
  connectToSnowflake,
  setSnowflakeConnected,
  getSnowflakeConnection,
} from '../config/snowflake.config';
@Injectable()
export class DomainService {
  async getDomainsByUserEmail(email: string): Promise<string[]> {
    const query = `
      SELECT d.PERISCOPE_DOMAIN_KEY
      FROM DIM_USER u
      JOIN DIM_USER_DOMAIN ud ON u.USER_ID = ud.USER_ID
      JOIN DIM_DOMAIN d ON ud.DOMAIN_ID = d.DOMAIN_ID
      WHERE LOWER(u.EMAIL) = LOWER(?)
    `;

    const tryQuery = (): Promise<string[]> => {
      const connection = getSnowflakeConnection();

      return new Promise((resolve, reject) => {
        connection.execute({
          sqlText: query,
          binds: [email],
          complete: (err, _stmt, rows) => {
            if (err) {
              return reject(err);
            }

            if (!rows || rows.length === 0) {
              return resolve([]);
            }

            const domainKeys = rows.map((row: any) => row.PERISCOPE_DOMAIN_KEY);
            resolve(domainKeys);
          },
        });
      });
    };

    try {
      // First try the query
      return await tryQuery();
    } catch (err: any) {
      // Handle "terminated connection" and retry after reconnecting
      if (
        err?.message?.includes('terminated connection') ||
        err?.code === 407002 ||
        err?.sqlState === '08003'
      ) {
        console.warn('[Snowflake] Connection terminated. Reconnecting...');
        setSnowflakeConnected(false);
        await connectToSnowflake();
        return await tryQuery(); // Retry after reconnection
      }

      throw err;
    }
  }
}
