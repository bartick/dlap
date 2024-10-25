import { Router } from 'express';

const router = Router();

import callback from './callback';

router.use('/callback', callback);

export default router;