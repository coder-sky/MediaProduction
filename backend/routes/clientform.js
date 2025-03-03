import express from 'express'
import { addclientdetails, clientdetails, deleteclient, editclient } from '../controllers/clientform.js'
import logoStorage from '../config/storage.js'
const route = express.Router()

route.post('/addclientdetails', logoStorage.single('logo'), addclientdetails)
route.get('/clientdetails', clientdetails)
route.post('/deleteclient', deleteclient)
route.put('/editclient', logoStorage.single('clientLogo'), editclient)

export default route