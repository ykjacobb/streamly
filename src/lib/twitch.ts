let accessToken: string | null = null;
let tokenExpiry: number | null = null;

async function getTwitchAccessToken() {
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const response = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.TWITCH_CLIENT_ID!,
      client_secret: process.env.TWITCH_CLIENT_SECRET!,
      grant_type: 'client_credentials',
    }),
  });

  const data = await response.json();
  accessToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in * 1000);
  return accessToken;
}

export async function checkTwitchStreamStatus(usernames: string[]) {
  if (!usernames.length) return {};

  try {
    const token = await getTwitchAccessToken();
    const response = await fetch(
      `https://api.twitch.tv/helix/streams?${usernames.map(u => `user_login=${u}`).join('&')}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Client-Id': process.env.TWITCH_CLIENT_ID!,
        },
      }
    );

    const data = await response.json();
    
    // Create a map of username -> isLive status
    const statusMap: Record<string, boolean> = {};
    usernames.forEach(username => {
      statusMap[username.toLowerCase()] = false;
    });

    // Update status for live streamers
    data.data?.forEach((stream: any) => {
      statusMap[stream.user_login.toLowerCase()] = true;
    });

    return statusMap;
  } catch (error) {
    console.error('Error checking Twitch stream status:', error);
    return {};
  }
} 