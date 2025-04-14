import { Router } from 'express';
import ivrRoute from './ivr';
const router = Router();

router.use("/ivr", ivrRoute);

export default router;
