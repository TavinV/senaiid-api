import lateEntry from '../models/late_entry_model.js'

const createLateEntry = async (user_id) => {
    const lateEntryId = Array.from({ length: 8 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 62)]).join('');

    try {
        const newEntry = await lateEntry.create({ id: lateEntryId, user_id, responsavel: "-", motivo: "-" })
        return [newEntry, null]
    } catch (error) {
        console.log(error)
        return [null, 500]
    }
}

const validateLateEntry = async (late_entry_id, responsiblePerson, reason) => {
    let foundLateEntry = await lateEntry.findOne({ id: late_entry_id })

    if (!foundLateEntry) {
        return [null, 404]
    }

    try {
        const result = await lateEntry.findOneAndUpdate({ id: late_entry_id }, { responsavel: responsiblePerson, motivo: reason, status: 'Validado' })
        const updated = await lateEntry.findOne({ id: late_entry_id })

        return [updated, null]
    } catch (error) {
        return [null, 500]
    }
}

const getLateEntries = async (user_id) => {
    const lateEntries = await lateEntry.find({ user_id })
    return [lateEntries, null]
}

const getLateEntry = async (late_entry_id) => {
    let foundLateEntry = await lateEntry.findOne({ id: late_entry_id })

    if (!foundLateEntry) {
        return [null, 404]
    }
    return [foundLateEntry, null]
}

const closeLateEntry = async (late_entry_id) => {
    let foundLateEntry = await lateEntry.findOne({ id: late_entry_id })

    if (!foundLateEntry) {
        return [null, 404]
    }
    try {
        const result = await lateEntry.findOneAndUpdate({ id: late_entry_id }, { status: 'Não informado' })
        return [result, null]
    } catch (error) {
        return [null, 500]
    }

}

export { createLateEntry, validateLateEntry, getLateEntries, getLateEntry, closeLateEntry }