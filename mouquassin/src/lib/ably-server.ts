import Ably from "ably";

let restClient: Ably.Rest | null = null;

export function getAblyRest(): Ably.Rest {
  if (restClient) return restClient;

  const apiKey = process.env.ABLY_API_KEY;
  if (!apiKey) {
    throw new Error("ABLY_API_KEY environment variable is not set");
  }

  restClient = new Ably.Rest({ key: apiKey });
  return restClient;
}

export async function ablyPublish(
  channelName: string,
  eventName: string,
  data: Record<string, unknown>
): Promise<void> {
  try {
    const ably = getAblyRest();
    const channel = ably.channels.get(channelName);
    await channel.publish(eventName, data);
  } catch (error) {
    console.error(`[ably-server] publish failed for ${channelName}:`, error);
  }
}
