import { closeLateEntry } from "../services/late_entry_services.js"
import lateEntry from "../models/late_entry_model.js"
import { minuteDiff } from "../lib/Horarios.js"

const lateEntryJob = async () => {
    try {
        const now = new Date()
        const pendingEntries = await lateEntry.find({ status: "Pendente" })

        for (const entry of pendingEntries) {
            if (minuteDiff(entry.createdAt, now) > 1) {
                closeLateEntry(entry.id)
            }
        }
    } catch (error) {
        console.error("Erro ao processar atrasos:", error);
    }
}

export default lateEntryJob;