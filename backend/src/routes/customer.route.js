import express from 'express';
import {createCustomer,getCustomers,updateCustomer,deleteCustomer,getCustomerById} from '../controllers/customer.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
// import {createCustomer} from '../controllers/customer.controller.js';

const customerRouter = express.Router();

customerRouter.post('/',verifyJWT, createCustomer);
customerRouter.get('/',verifyJWT, getCustomers);
customerRouter.put('/:id',verifyJWT, updateCustomer);
customerRouter.delete('/:id',verifyJWT, deleteCustomer);
customerRouter.get('/mydetails',verifyJWT, getCustomerById);
export default customerRouter; 