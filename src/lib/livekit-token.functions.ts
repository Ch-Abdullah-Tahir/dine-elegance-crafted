import { randomUUID } from "node:crypto";
import { AccessToken, RoomAgentDispatch, RoomConfiguration } from "livekit-server-sdk";
import { createServerFn } from "@tanstack/react-start";

export const createLiveKitCallToken = createServerFn({ method: "POST" }).handler(async () => {
  const { LIVEKIT_API_KEY: apiKey, LIVEKIT_API_SECRET: apiSecret, LIVEKIT_URL: serverUrl } = process.env;

  if (!apiKey || !apiSecret || !serverUrl) {
    throw new Error("LiveKit is not configured for the website server.");
  }

  const roomName = `dine-cottage-${randomUUID()}`;

  const token = new AccessToken(apiKey, apiSecret, {
    identity: `guest-${randomUUID()}`,
    name: "Dine Cottage website guest",
    ttl: "10m",
  });

  token.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
  });

  token.roomConfig = new RoomConfiguration({
    agents: [
      new RoomAgentDispatch({
        agentName: "dine-cottage-voice-agent",
      }),
    ],
  });

  return {
    serverUrl,
    participantToken: await token.toJwt(),
    roomName,
  };
});
