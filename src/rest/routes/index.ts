import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
    res.send('Hello World!');
});

import auth from './auth';

router.use('/auth', auth);

export default router;