import express from 'express'
import validateSessionToken from '../middlewares/JWT_Auth.js'
import { getUser, getFotoPerfil, primeiroAcesso, acesso, pedirToken, validarToken, pedirUpdate, forgotPassword, resetPassword, setupPassword, pedirSaidaAntecipada, buscarSaidaAntecipada, buscarSaidasAntecipadas, buscarAtraso, buscarAtrasos, pedirAtraso } from '../controllers/user_controller.js'

const router = express.Router()

router.get('/:id', getUser)
router.get('/:id/profile-picture', getFotoPerfil)
router.get('/:id/first-access', primeiroAcesso)
router.get('/me/access', validateSessionToken(false), acesso)
router.get('/me/late-entries', validateSessionToken(false), buscarAtrasos)
router.get('/me/late-entries/:id', validateSessionToken(false), buscarAtraso)
router.get('/me/early-exits', validateSessionToken(false), buscarSaidasAntecipadas)
router.get('/me/early-exits/:id', validateSessionToken(false), buscarSaidaAntecipada)

router.post('/me/late-entries/request', validateSessionToken(false), pedirAtraso)
router.post('/me/early-exits/request', validateSessionToken(false), pedirSaidaAntecipada)
router.post('/:id/verify-email/request-token', pedirToken)
router.post('/:id/verify-email/validate-token', validarToken)
router.post('/:id/request-update', pedirUpdate)
router.post('/forgot-password', forgotPassword)

router.put('/reset-password', resetPassword)
router.put('/:id/setup-password', setupPassword)

export default router