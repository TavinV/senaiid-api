import express from 'express'
import validateSessionToken from '../middlewares/JWT_Auth.js'
import upload from '../middlewares/multer.js'
import { validarAluno, validarFuncionario } from '../middlewares/validatebody.js'

import { deletarUsuario, registrarAluno, registrarFuncionario, atualizarUsuario, aprovarPedido, rejeitarPedido, validarAtraso, atrasosDeUmAluno } from '../controllers/secretaria_controller.js'

const router = express.Router()

router.get('/late-entries/:id', validateSessionToken(true), atrasosDeUmAluno)

router.post('/register/student', validateSessionToken(true), upload.single("foto_perfil"), validarAluno, registrarAluno)
router.post('/register/employee', validateSessionToken(true), upload.single("foto_perfil"), validarFuncionario, registrarFuncionario)
router.post('/late-entries/:id/validate', validateSessionToken(true), validarAtraso)

router.delete('/:id', validateSessionToken(true), deletarUsuario)

router.put('/update-requests/:id/approve', validateSessionToken(true), aprovarPedido)
router.put('/update-requests/:id/deny', validateSessionToken(true), rejeitarPedido)
router.put('/users/:id', validateSessionToken(true), atualizarUsuario)


export default router