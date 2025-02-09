import user_update_request_model from "../models/user_update_request_model.js"
import logger from '../lib/logger.js'
const childLogger = logger.child({ service: "user_update_request_services" })

const createUpdateRequest = async (user_id, tel, message, nome) => {
    const request_id = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('')

    try {
        const updateRequest = await user_update_request_model.create({ request_id, user_id, tel, message, status: "Em análise", nome })

        childLogger.info(`User update request created with id: ${updateRequest.id}`)
        return [updateRequest, null]
    } catch (error) {
        childLogger.error(`Error creating update request`, error)
        return [null, 500]
    }
}

const findUpdateRequestById = async (request_id) => {
    try {
        const updateRequest = await user_update_request_model.findOne({ request_id: request_id })

        if (!updateRequest) {
            return [null, 404]
        }

        return [updateRequest, null]
    } catch (error) {
        childLogger.error(`Error finding update request by id`, error)
        return [null, 500]
    }

}

const acceptUpdateRequest = async (request_id) => {
    try {
        const result = await user_update_request_model.findOneAndUpdate({ request_id: request_id }, { status: "Aprovado" })

        if (!result) {
            return [null, 404]
        }

        user_update_request_model.deleteMany({ request_id: request_id })
        childLogger.info(`Update request accepted with id: ${request_id}`)

        return [result, null]
    } catch (error) {
        childLogger.error(`Error accepting update request`, error)
        return [null, 500]
    }
}

const denyUpdateRequest = async (request_id) => {
    try {
        const result = await user_update_request_model.findOneAndUpdate({ request_id: request_id }, { status: "Rejeitado" })

        if (!result) {
            return [null, 404]
        }

        user_update_request_model.deleteMany({ request_id: request_id })
        childLogger.info(`Update request denied with id: ${request_id}`)
        return [result, null]
    } catch (error) {
        childLogger.error(`Error denying update request`, error)
        return [null, 500]
    }
}

export { createUpdateRequest, findUpdateRequestById, acceptUpdateRequest, denyUpdateRequest }