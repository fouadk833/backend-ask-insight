import * as snowflake from 'snowflake-sdk';
import * as crypto from 'crypto';

let isConnected = false;
let connection: snowflake.Connection;

function getSnowflakePrivateKey(): string {
  const keyB64 = process.env.SF_HIST_KEY_B64;
  
  if (!keyB64) {
    throw new Error('SF_HIST_KEY_B64 environment variable is not set');
  }
  
  const privateKeyPem = Buffer.from(keyB64, 'base64');
  
  const keyObject = crypto.createPrivateKey({
    key: privateKeyPem,
    format: 'pem',
  });
  
  const privateKeyPkcs8 = keyObject.export({
    type: 'pkcs8',
    format: 'pem',
  }) as string;
  
  return privateKeyPkcs8;
}

function createConnection(): snowflake.Connection {
  console.log('[Snowflake] Creating new connection object...');
  return snowflake.createConnection({
    account: process.env.SNOWFLAKE_ACCOUNT!,
    username: process.env.SNOWFLAKE_USERNAME!,
    privateKey: getSnowflakePrivateKey(),
    authenticator: 'SNOWFLAKE_JWT',
    role: process.env.SNOWFLAKE_ROLE,
    warehouse: process.env.SNOWFLAKE_WAREHOUSE,
    database: process.env.SNOWFLAKE_DATABASE,
    schema: process.env.SNOWFLAKE_SCHEMA,
  });
}

// Create Snowflake connection (using environment variables for local)
// export const snowflakeConnection = snowflake.createConnection({
//   account: 'SANOFI-EMEA_DF_CHC',
//   username: 'ADRIAN.BLASCO@SANOFI.COM',
//   authenticator: 'EXTERNALBROWSER',
//   role: 'DF_CHC_DEMO_PREP_KEY_DEVELOPER',
//   warehouse: 'DF_CHC_DEMO_PREP_WH_ADHOC',
//   database: 'DF_CHC_DEMO_PREP',
//   schema: 'TECH',
// });


export async function connectToSnowflake(): Promise<void> {
  //create a new connection whenever we connect
  connection = createConnection();

  return new Promise((resolve, reject) => {
    console.log('[Snowflake] Connecting...');
    connection.connect((err) => {
      if (err) {
        console.error("[Snowflake] Connection failed:", err.message);
        isConnected = false;
        return reject(err);
      }
      console.log("[Snowflake] Connected successfully");
      isConnected = true;
      resolve();
    });
  });
}

export function setSnowflakeConnected(status: boolean) {
  isConnected = status;
}


export function getSnowflakeConnection(): snowflake.Connection {
  return connection;
}

// Uncomment this function to manually close the Snowflake connection
// export function disconnectSnowflakeConnection() {
//   if (connection) {
//     console.log('[Snowflake] Closing current connection manually...');
//     connection.destroy((err) => {
//       if (err) {
//         console.error('[Snowflake] Error closing connection:', err.message);
//       } else {
//         console.log('[Snowflake] Connection closed.');
//         isConnected = false;
//       }
//     });
//   }
// }
