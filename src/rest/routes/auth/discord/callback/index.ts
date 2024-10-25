import { Router, Request, Response } from 'express';
import { ActionRowBuilder, ButtonBuilder } from 'discord.js';

import { generateToken } from '../../../../../utils/oauth2';
import { getDiscordUser } from '../../../../../lib/get-user';
import { sendDM } from '../../../../../lib/send-dm';
import { saveToken } from '../../../../../helpers/saveToken';
import RegistrationStartButton from '../../../../../buttons/registrationStart.button';

const router = Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
    const { code } = req.query as { code?: string };

    if (!code) {
        res.status(400).send('No code provided');
        return;
    }

    let oauthData = await generateToken(code);
    if (!oauthData) {
        res.status(500).send('An error occurred during authentication');
        return;
    }

    res.send('You have been successfully authenticated with Discord!');

    if (oauthData.access_token) {

        const user = await getDiscordUser(oauthData.token_type, oauthData.access_token);

        if (!user) {
            sendDM(user.id, {
                content: 'An error occurred while fetching your user data. Please try again later.',
            });
            return;
        }

        const saveError = await saveToken(user.id, oauthData.access_token, oauthData.token_type, oauthData.refresh_token);
        if (saveError) {
            sendDM(user.id, {
                content: 'An error occurred while saving your token. Please try again later.',
            });
            return;
        }

        sendDM(user.id, {
            content: 'We have successfully started the authentication process...',
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new RegistrationStartButton().build()
                    )
            ],
        })
    }
})

export default router;