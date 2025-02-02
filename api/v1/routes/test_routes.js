import express from 'express'
const router = express.Router()

import validateSessionToken from '../middlewares/JWT_Auth.js'
import sendMail from '../lib/Emails.js'

import { minuteDiff, parseTimeToToday } from "../lib/Horarios.js";
import { createLateEntry, validateLateEntry, getLateEntries, getLateEntry, closeLateEntry } from '../services/late_entry_services.js'

router.get('/auth/protected', validateSessionToken(true), (req, res) => {
    res.json({ message: 'You are authenticated!' })
})

router.get('/auth/unprotected', validateSessionToken(false), (req, res) => {
    res.json({ message: 'You are authenticated!' })
})

router.post('/email/send', async (req, res) => {
    const { to, subject } = req.body
    const html = `
        <h1>Email de teste!</h1>
    <hr>
    <p>Ola mundo!</p>

    `
    sendMail(to, subject, html).then(() => {
        return res.json({ message: 'Email sent successfully' })
    }).catch((error) => {
        return res.status(500).json({ message: 'Error sending email', error })
    })

})

router.post('/atraso/:id', async (req, res) => {
    const { id } = req.params

    const [result, error] = await createLateEntry(id)
    return res.status(200).json({ result, error })
})

router.post('/atraso/:id/validar', async (req, res) => {
    const { id } = req.params
    const { responsavel, motivo } = req.body

    const [result, error] = await validateLateEntry(id, responsavel, motivo)
    return res.status(200).json({ result, error })
})

router.post('/atraso/:id/fechar', async (req, res) => {
    const { id } = req.params
    const { responsavel, motivo } = req.body

    const [result, error] = await closeLateEntry(id)
    return res.status(200).json({ result, error })
})

router.get('/atrasos/:id', async (req, res) => {
    const { id } = req.params
    const [result, error] = await getLateEntries(id)
    return res.status(200).json({ result, error })
})

router.get("/diferenca/tempo", async (req, res) => {
    const expectedEntryTime = parseTimeToToday("14:00")
    const entryLatency = minuteDiff(new Date(), expectedEntryTime)
    return res.status(200).json({ entryLatency })
})

export default router