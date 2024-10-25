import { request } from 'undici';
import logger from '../utils/logger';

export async function getDiscordUser(token_type: string, access_token: string) {
    try {
        // Get the user data from the Discord API
        const userResponseData = await request('https://discord.com/api/users/@me', {
            headers: {
                authorization: `${token_type} ${access_token}`,
            },
        });

        // Parse the user data
        const user: any = await userResponseData.body.json();
        return user
    } catch (error) {
        logger.error(error); // Log the error
        return null; // Return null if there is an error
    }
}