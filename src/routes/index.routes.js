import { Router } from "express"
import {getUsers, postUser, deleteUser} from "../controllers/user.controller";
import { addNode, deleteNode } from "../controllers/binary.controller";

const router = Router();

router.get('/', getUsers);

router.post('/users/add', postUser);

router.get('/delete/:id', deleteUser);

router.get('/binary', (req, res) => res.render('partials/binaryTree'));

router.post('/binary/add', addNode);
router.post('/binary/delete', deleteNode);

export default router