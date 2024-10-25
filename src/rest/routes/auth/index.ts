import { Router } from 'express';

const router = Router();

import discord from './discord';

router.use('/discord', discord);

export default router;