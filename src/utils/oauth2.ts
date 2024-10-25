import { request } from "undici";
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URL } from "./config";
import logger from "./logger";

export async function generateToken(code: string) {
    try {
        const tokenResponseData = await request('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code,
                grant_type: 'authorization_code',
                redirect_uri: REDIRECT_URL,
            }).toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        return await tokenResponseData.body.json() as Promise<{
            access_token: string,
            token_type: string,
            expires_in: number,
            refresh_token: string,
            scope: string,
        }>
    } catch (error) {
        // NOTE: An unauthorized token will not throw an error
        // tokenResponseData.statusCode will be 401
        logger.error(error);
        return;
    }
}

export async function refreshToken(refreshToken: string) {
    try {
        const tokenResponseData = await request('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
            }).toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        return await tokenResponseData.body.json() as Promise<{
            access_token: string,
            token_type: string,
            expires_in: number,
            refresh_token: string,
            scope: string,
        }>
    } catch (error) {
        logger.error(error);
        return;
    }
}