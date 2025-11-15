// lib/discord.ts
export interface DiscordTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
}

export interface DiscordUser {
    id: string;
    username: string;
    avatar: string | null;
    discriminator: string;
    global_name: string | null;
}

const API_ENDPOINT = 'https://discord.com/api/v10';

export async function exchangeCodeForToken(code: string): Promise<DiscordTokenResponse> {
    const clientId = process.env.DISCORD_CLIENT_ID;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;
    const redirectUri = process.env.DISCORD_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
        throw new Error('As variáveis de ambiente do Discord não estão configuradas.');
    }

    const body = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
    });

    const response = await fetch(`${API_ENDPOINT}/oauth2/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Falha ao trocar código por token:', errorData);
        throw new Error(`Erro do Discord: ${errorData.error_description || 'Falha na autenticação'}`);
    }

    return response.json();
}

export async function getUserProfile(accessToken: string): Promise<DiscordUser> {
    const response = await fetch(`${API_ENDPOINT}/users/@me`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Falha ao obter perfil do usuário:', errorData);
        throw new Error('Não foi possível buscar os dados do usuário do Discord.');
    }

    return response.json();
}

export function constructAvatarUrl(userId: string, avatarHash: string | null): string {
    if (!avatarHash) {
        // Return URL for default Discord avatar
        return `https://cdn.discordapp.com/embed/avatars/0.png`;
    }
    const extension = avatarHash.startsWith('a_') ? 'gif' : 'png';
    return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${extension}?size=128`;
}
