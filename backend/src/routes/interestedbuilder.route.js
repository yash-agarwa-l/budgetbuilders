import express from 'express';
import {createInterestedBuilder,getInterestsByOrderId,getInterestsByBuilderId,deleteInterest,updateInterest,getOngoinginterestsByBuilderId,getPendinginterestsByBuilderId} from '../controllers/interestedbuilder.controller.js';
import { isBuilder } from '../middlewares/builder.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const interestedBuilderRouter = express.Router();

interestedBuilderRouter.post('/interests',verifyJWT, createInterestedBuilder);
interestedBuilderRouter.get('/orders/:orderId/interests', getInterestsByOrderId);
interestedBuilderRouter.get('/:builderId/interests', getInterestsByBuilderId);
interestedBuilderRouter.put('/interests/:id', updateInterest);
interestedBuilderRouter.delete('/interests/:id', deleteInterest);
interestedBuilderRouter.get('/bidpending',verifyJWT, getPendinginterestsByBuilderId);
interestedBuilderRouter.get('/bidongoing',verifyJWT, getOngoinginterestsByBuilderId);

export default interestedBuilderRouter;