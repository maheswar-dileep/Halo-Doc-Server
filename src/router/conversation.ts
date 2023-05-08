import { Router } from 'express';
import * as conversationController from '../controller/conversation.js';

const router = Router();

router.route('/').post(conversationController.newConversation);
router.route('/:id').get(conversationController.getConversation);

export default router;
