import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';

type ClientWithWorkflow = WebSocket & { workflow_uuid: string | null };

type BackendConnectionInfo = {
  ws: WebSocket;
  cleanupTimer?: NodeJS.Timeout;
  expectedClose?: boolean;
  closeReason?: string;
};

const PING_INTERVAL = 30000; // 30 seconds
const RECONNECT_GRACE_PERIOD_MS = 30000; // 30 seconds to allow UI reload reconnects

function setupPingPong(client: ClientWithWorkflow, backendSocket: WebSocket, workflowUuid: string) {
  let clientAlive = true;
  let backendAlive = true;

  client.on('pong', () => {
    clientAlive = true;
    console.log(`[PONG] Received pong from client for workflow ${workflowUuid}`);
  });

  backendSocket.on('pong', () => {
    backendAlive = true;
    console.log(`[PONG] Received pong from backend for workflow ${workflowUuid}`);
  });

  const pingInterval = setInterval(() => {
    // Ping client
    if (client.readyState === WebSocket.OPEN) {
      clientAlive = false;
      console.log(`[PING] Sending ping to client for workflow ${workflowUuid}`);
      client.ping();
    }

    // Ping backend
    if (backendSocket.readyState === WebSocket.OPEN) {
      backendAlive = false;
      console.log(`[PING] Sending ping to backend for workflow ${workflowUuid}`);
      backendSocket.ping();
    }

    // If no pong received, terminate connections
    setTimeout(() => {
      if (!clientAlive && client.readyState === WebSocket.OPEN) {
        console.warn(`No pong from client for workflow ${workflowUuid}, terminating connection.`);
        client.terminate();
      }
      if (!backendAlive && backendSocket.readyState === WebSocket.OPEN) {
        console.warn(`No pong from backend for workflow ${workflowUuid}, terminating connection.`);
        backendSocket.terminate();
      }
    }, 10000); // 10 seconds to respond
  }, PING_INTERVAL);

  // Clean up interval on close
  const cleanup = () => clearInterval(pingInterval);
  client.on('close', cleanup);
  backendSocket.on('close', cleanup);
}

@WebSocketGateway({ cors: { origin: '*', credentials: true } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private backendUrl = process.env.FASTAPI_WS_URL || 'ws://localhost:8000';
  private backendConnections: Map<string, BackendConnectionInfo> = new Map(); // Map to track backend connections by workflow_uuid

  handleConnection(client: ClientWithWorkflow) {
    console.log('Client connected');
    client.workflow_uuid = null; // Initialize property
  }

  handleDisconnect(client: ClientWithWorkflow) {
    console.log('Client disconnected');
    if (client.workflow_uuid) {
      const workflowUuid = this.normalizeUuid(client.workflow_uuid);

      const isAnyOtherClientOpen = Array.from(this.server.clients).some(
        (otherClient: WebSocket & { workflow_uuid?: string }) =>
          otherClient !== client &&
          otherClient.readyState === WebSocket.OPEN &&
          otherClient.workflow_uuid &&
          this.normalizeUuid(otherClient.workflow_uuid) === workflowUuid,
      );

      if (isAnyOtherClientOpen) {
        console.log(
          `Another client still open for workflow ${workflowUuid}, keeping backend connection alive`,
        );
        return;
      }

      const backendConnection = this.backendConnections.get(workflowUuid);
      if (!backendConnection) {
        return;
      }

      if (backendConnection.cleanupTimer) {
        clearTimeout(backendConnection.cleanupTimer);
      }

      backendConnection.cleanupTimer = setTimeout(() => {
        const stillHasClient = Array.from(this.server.clients).some(
          (otherClient: WebSocket & { workflow_uuid?: string }) =>
            otherClient.readyState === WebSocket.OPEN &&
            otherClient.workflow_uuid &&
            this.normalizeUuid(otherClient.workflow_uuid) === workflowUuid,
        );

        if (stillHasClient) {
          console.log(
            `Workflow ${workflowUuid} reconnected before cleanup, keeping backend connection open`,
          );
          return;
        }

        if (backendConnection.ws.readyState === WebSocket.OPEN) {
          backendConnection.expectedClose = true;
          backendConnection.closeReason = 'reconnect grace period expired';
          console.log(`Closing backend connection for workflow ${workflowUuid} after reconnect grace period`);
          backendConnection.ws.close(1000, 'Reconnect grace period expired');
        }
        this.backendConnections.delete(workflowUuid);
      }, RECONNECT_GRACE_PERIOD_MS);

      console.log(
        `Scheduled backend cleanup for workflow ${workflowUuid} in ${RECONNECT_GRACE_PERIOD_MS}ms`,
      );

      console.log(
        `No active client for workflow ${workflowUuid}; scheduling backend cleanup in 5s`,
      );
    }
  }

  private normalizeUuid(uuid: string): string {
    return uuid;
    //return uuid.replace(/-/g, ''); // Remove hyphens
  }

  private connectToBackend(workflowUuid: string, client: ClientWithWorkflow): Promise<WebSocket> {
    const normalizedUuid = this.normalizeUuid(workflowUuid);

    // Reuse an existing connection if it already exists
    const existingConnectionInfo = this.backendConnections.get(normalizedUuid);
    if (existingConnectionInfo) {
      if (existingConnectionInfo.cleanupTimer) {
        clearTimeout(existingConnectionInfo.cleanupTimer);
        existingConnectionInfo.cleanupTimer = undefined;
        console.log(
          `Canceled scheduled cleanup for workflow ${normalizedUuid} because client reconnected`,
        );
      }

      if (existingConnectionInfo.ws.readyState === WebSocket.OPEN) {
        console.log(
          `Reusing existing backend connection for workflow ${normalizedUuid}`,
        );
        return Promise.resolve(existingConnectionInfo.ws);
      }

      if (existingConnectionInfo.ws.readyState === WebSocket.CONNECTING) {
        console.log(
          `Reusing backend connection in CONNECTING state for workflow ${normalizedUuid}`,
        );
        return new Promise((resolve, reject) => {
          existingConnectionInfo.ws.once('open', () => resolve(existingConnectionInfo.ws));
          existingConnectionInfo.ws.once('error', reject);
        });
      }
    }

    // Create a new connection
    console.log(
      `Connecting to backend WebSocket for workflow ${normalizedUuid}`,
    );
    const backendWs = new WebSocket(`${this.backendUrl}/datapella/ws`);
    this.backendConnections.set(normalizedUuid, { ws: backendWs });

    return new Promise((resolve, reject) => {
      backendWs.on('open', () => {
        console.log(
          `Connected to backend WebSocket for workflow ${normalizedUuid}`,
        );

        // Setup ping-pong mechanism once backend connection is established
        setupPingPong(client, backendWs, normalizedUuid);

        resolve(backendWs);
      });

      backendWs.on('message', (msg) => {
        const message = JSON.parse(msg.toString());
        console.log('Message received from backend:', message);

        if (message.workflow_uuid) {
          // Only send the message to clients with the same workflow_uuid
          this.server.clients.forEach(
            (client: WebSocket & { workflow_uuid?: string }) => {
              if (
                client.readyState === WebSocket.OPEN &&
                this.normalizeUuid(client.workflow_uuid) ===
                  this.normalizeUuid(message.workflow_uuid)
              ) {
                client.send(msg.toString());


                // Check if the message type is 'workflow_completed'
                if (message.type == 'WorkflowComplete' && message?.__end__) {
                  console.log(
                    `Workflow ${message.workflow_uuid} completed, closing connections`,
                  );

                  const connectionInfo = this.backendConnections.get(normalizedUuid);
                  if (connectionInfo) {
                    connectionInfo.expectedClose = true;
                    connectionInfo.closeReason = 'workflow completed';
                  }

                  // Close the client connection
                  setTimeout(() => {
                    console.log(
                      `Closing client connection for workflow ${message.workflow_uuid}`,
                    );
                    client.close(1000, 'Workflow completed');
                  }, 1000); // Delay to ensure the message is delivered

                  // Close the backend connection
                  if (backendWs && backendWs.readyState === WebSocket.OPEN) {
                    console.log('Closing backend WebSocket connection');
                    backendWs.close(1000, 'Workflow completed');
                  }
                }
              }
            },
          );
        }
      });

      backendWs.on('close', (code, reason) => {
        const currentConnection = this.backendConnections.get(normalizedUuid);
        const expected = currentConnection?.expectedClose ? 'expected' : 'unexpected';
        const reasonText = reason ? reason.toString() : '';
        console.log(
          `Backend WebSocket for workflow ${normalizedUuid} closed (${expected}, code=${code}, reason=${reasonText}).`,
        );
        if (currentConnection?.ws === backendWs) {
          this.backendConnections.delete(normalizedUuid);
        }
      });

      backendWs.on('error', (err) => {
        console.error(
          `Backend WebSocket error for workflow ${normalizedUuid}:`,
          err,
        );
        this.backendConnections.delete(normalizedUuid);
        reject(err);
      });
    });
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: ClientWithWorkflow,
  ) {
    console.log('Message received in Gateway:', data);

    if (!data.workflow_uuid && !client.workflow_uuid) {
      console.error('No workflow_uuid found. Ignoring message.');
      return;
    }

    // Normalize and associate workflow_uuid to the client if it doesn't have one yet
    if (data.workflow_uuid) {
      const normalizedWorkflowUuid = this.normalizeUuid(data.workflow_uuid);
      if (client.workflow_uuid && client.workflow_uuid !== normalizedWorkflowUuid) {
        console.log(
          `Client workflow_uuid changed from ${client.workflow_uuid} to ${normalizedWorkflowUuid}`,
        );
      }
      client.workflow_uuid = normalizedWorkflowUuid;
    }

    const workflowUuid = client.workflow_uuid;
    console.log(`Handling sendMessage for workflow ${workflowUuid}`);

    try {
      // Ensure a backend connection exists for this workflow
      const backendWs = await this.connectToBackend(workflowUuid, client);

      // Send the message to the backend
      if (backendWs && backendWs.readyState === WebSocket.OPEN) {
        backendWs.send(
          JSON.stringify({ ...data, workflow_uuid: data.workflow_uuid }),
        );
      } else {
        console.error(
          `Failed to send message: Backend WebSocket for workflow ${workflowUuid} is not connected`,
        );
      }
    } catch (error) {
      console.error(
        `Failed to connect to backend for workflow ${workflowUuid}:`,
        error,
      );
    }
  }
}