import { Router, Request, Response } from 'express';
import ivrController from './ivrController';
import { logger } from '../../logger';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: IVR
 *     description: IVR related endpoints
 */

/**
 * @swagger
 * /ivr/hello:
 *   get:
 *     summary: Get a hello message
 *     tags:
 *       - IVR
 *     responses:
 *       200:
 *         description: A greeting message
 */
router.get('/hello', (req: Request, res: Response) => {
    logger.info('/ivr/Hello endpoint hit');
    const response = ivrController.sayHello();
    logger.info({ response }, '/ivr/Hello endpoint response');
    res.type('application/json').status(response.status).send(response);
});

/**
 * @swagger
 * /ivr:
 *   post:
 *     summary: Entry point for IVR call flow
 *     description: Responds with the initial TwiML for the IVR system.
 *     tags:
 *       - IVR
 *     responses:
 *       200:
 *         description: TwiML XML response to initiate IVR
 *         content:
 *           text/xml:
 *             schema:
 *               type: string
 *               example: |
 *                 <Response>
 *                   <Gather input="dtmf" timeout="10" numDigits="1" action="/handle-key" method="POST">
 *                     <Say>Welcome to our IVR system. Press 1 for Sales, 2 for Support.</Say>
 *                   </Gather>
 *                 </Response>
 */
router.post('/', (req: Request, res: Response) => {
    logger.info('/ivr endpoint hit');
    const response = ivrController.ivr();
    logger.info({ response }, '/ivr endpoint response');
    res.type('text/xml').status(response.status).send(response);
});

/**
 * @openapi
 * /ivr/call-logs:
 *   get:
 *     summary: Get call logs with optional filters
 *     tags:
 *       - IVR
 *     parameters:
 *       - in: query
 *         name: caller_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: receiver_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [recorded, failed, pending]
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Filtered call logs
 *       400:
 *         description: Validation error for query parameters
 */
router.get('/call-logs', async (req: Request, res: Response) => {
    logger.info({ query: req.query }, '/ivr/all-logs endpoint hit');
    const response = await ivrController.getFilteredCalls(req.query);
    logger.info({ response }, '/ivr/all-logs endpoint response');
    res.status(response.status).json(response);
});

/**
 * @swagger
 * /ivr/handle-key:
 *   post:
 *     summary: Handle DTMF key press
 *     description: Responds to the key pressed by the user in the IVR system.
 *     tags:
 *       - IVR
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - digit
 *             properties:
 *               digit:
 *                 type: string
 *                 example: "1"
 *     responses:
 *       200:
 *         description: TwiML response
 *         content:
 *           text/xml:
 *             schema:
 *               type: string
 */
router.post('/handle-key', (req: Request, res: Response) => {
    logger.info({ body: req.body }, '/ivr/handle-key endpoint hit');
    const response = ivrController.handleKey(req.body);
    logger.info({ response }, '/ivr/handle-key endpoint response');
    res.type('text/xml').status(response.status).send(response);
});

/**
 * @swagger
 * /ivr/handle-recording:
 *   post:
 *     summary: Handle voicemail recording
 *     description: Receives the recording URL and caller details.
 *     tags:
 *       - IVR
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - RecordingUrl
 *               - From
 *               - To
 *             properties:
 *               RecordingUrl:
 *                 type: string
 *                 example: "https://api.twilio.com/recordings/REXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
 *               From:
 *                 type: string
 *                 example: "+1234567890"
 *               To:
 *                 type: string
 *                 example: "+0987654321"
 *     responses:
 *       200:
 *         description: Recording received confirmation
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Recording received"
 */
router.post('/handle-recording', async (req: Request, res: Response) => {
    logger.info({ body: req.body }, '/ivr/handle-recording endpoint hit');
    const response = await ivrController.handleRecording(req.body);
    logger.info('/ivr/handle-recording endpoint response');
    res.type('text/xml').status(response.status).send(response);
});

export default router;
