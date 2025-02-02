// Services
import { findUserById, updateUser, createUser, deleteUser, findUserPFP } from "../services/user_services.js";
import { createUpdateRequest, findUpdateRequestById, acceptUpdateRequest, denyUpdateRequest } from "../services/update_request_services.js";
import { validateLateEntry, getLateEntries, getLateEntry } from "../services/late_entry_services.js";

//Lib
import sendMail from "../lib/Emails.js";
import ApiResponse from '../lib/ApiResponse.js';
import { cripografarSenhaUsuario } from "../lib/Criptografar.js";
import fs from 'fs'
import moment from "moment";

// Schemas
import { updateUserSchema } from '../validation/user_schemas.js';

// Templates
import { approved_request_email_template } from "../templates/update_request_approved_template.js";
import { rejected_request_email_template } from "../templates/update_request_denied.js";
import { late_entry_approved_email_template } from "../templates/late_entry_validated_template.js";

// POST api/v1/secretaria/register/student
const registrarAluno = async (req, res) => {
    let usuario = req.body

    usuario.id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    usuario.senha_foi_alterada = false // O usuário acabou de ser criado, portanto está com a senha padrão
    usuario.email = ``
    usuario.cargo = "aluno"

    usuario = cripografarSenhaUsuario(req.body)

    try {
        const [novoAluno, error] = await createUser(usuario)
        if (error == 409) {
            return ApiResponse.ALREADYEXISTS(res, "Este aluno já está cadastrado!")
        } else if (error == 500) {
            return ApiResponse.ERROR(res, "Erro ao cadastrar o aluno")
        }

        return ApiResponse.CREATED(res, { id_aluno: novoAluno.id }, `Aluno ${novoAluno.nome} criado com sucesso!`)
    } catch (error) {
        return ApiResponse.ERROR(res, "Erro ao cadastrar o funcionario", error)
    }
}


// POST api/v1/secretaria/register/employee
const registrarFuncionario = async (req, res) => {
    let usuario = req.body

    usuario.cargo = "funcionario"
    usuario.senha_foi_alterada = true
    usuario.id = Math.random().toString(36).substring(2) + Date.now().toString()

    usuario = cripografarSenhaUsuario(req.body)

    try {
        const [novoFuncionario, error] = await createUser(usuario)
        if (error == 409) {
            return ApiResponse.ALREADYEXISTS(res, "Este funcionário já está cadastrado!")
        } else if (error == 500) {
            return ApiResponse.ERROR(res, "Erro ao cadastrar o funcionário")
        }

        return ApiResponse.CREATED(res, { id_funcionario: novoFuncionario.id }, `${novoFuncionario.descricao} ${novoFuncionario.nome} criado com sucesso!`)
    } catch (error) {
        return ApiResponse.ERROR(res, "Erro ao cadastrar o funcionario", error)
    }

}


// DELETE api/v1/secretaria/:id
const deletarUsuario = async (req, res) => {
    const id = req.params.id
    const nome = req.body.nome

    if (!nome) {
        return ApiResponse.BADREQUEST(res, "O nome do usuário é obrigatório")
    }

    const [user, findUserError] = await findUserById(id)

    if (!user && findUserError != 404) {
        // Erro interno do servidor, algum problema com o banco de dados.

        return ApiResponse.ERROR(res, `Erro interno do servidor.`, { "error": findUserError })
    } else if (findUserError == 404) {
        // Usuário não encontrado.
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }

    if (nome !== user.nome) {
        return ApiResponse.BADREQUEST(res, "O nome do usuário não corresponde ao nome do usuário encontrado.")
    }
    const [deletado, error] = await deleteUser(id)

    if (error) {
        return ApiResponse.ERROR(res, "Erro ao deletar o usuário")
    } else {

        const [filePath, findPfpError] = await findUserPFP(user)
        if (filePath) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log("SECRETARIA CONTROLLER")
                    console.error(err)
                }
            })
        }

        return ApiResponse.DELETED(res, "Usuário deletado com sucesso!")
    }

}

// PUT api/v1/secretaria/update-requests/:id/approve
const aprovarPedido = async (req, res) => {
    const id = req.params.id
    const updates = req.body // {nome: "nome", rg: "rg"}

    if (!updates) {
        return ApiResponse.BADREQUEST(res, "Os campos de atualização são obrigatórios.")
    }

    if (!id) {
        return ApiResponse.BADREQUEST(res, "O id do pedido é obrigatório.")
    }

    const [updateRequest, findUpdateRequestError] = await findUpdateRequestById(id)

    if (!updateRequest && findUpdateRequestError != 404) {
        return ApiResponse.ERROR(res, `Erro interno do servidor.`)
    }
    if (!updateRequest && findUpdateRequestError == 404) {
        return ApiResponse.NOTFOUND(res, "Pedido não encontrado.")
    }

    // Verificar as mudanças permitidas

    const { error } = updateUserSchema.validate(updates, { abortEarly: false })

    if (error) {
        // Retorna os erros de validação em formato mais amigável
        const errorMessages = error.details.map(err => err.message)
        return ApiResponse.BADREQUEST(res, errorMessages)
    }


    const [user, findUserError] = await findUserById(updateRequest.user_id)

    if (!user && findUserError != 404) {
        // Erro interno do servidor, algum problema com o banco de dados.
        return ApiResponse.ERROR(res, `Erro interno do servidor.`)
    } else if (findUserError == 404) {
        // Usuário não encontrado.
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }

    const [updated, updateUserError] = await updateUser(user.id, updates)

    if (!updated) {
        return ApiResponse.ERROR(res, "Erro interno do servidor.")
    }

    await acceptUpdateRequest(id)

    const emailHtml = approved_request_email_template(id, user.nome)
    const [info, sendEmailError] = await sendMail(user.email, `Pedido de alteração de dados aprovado!`, emailHtml)

    if (sendEmailError) {
        return ApiResponse.ERROR(res, `Erro ao enviar email.`)
    }

    return ApiResponse.OK(res, null, "Pedido de alteração de dados aprovado!")
}

// PUT api/v1/secretaria/update-requests/:id/deny
const rejeitarPedido = async (req, res) => {
    const id = req.params.id
    const { motivo } = req.body

    if (!id) {
        return ApiResponse.BADREQUEST(res, "O id do pedido é obrigatório.")
    }

    if (!motivo) {
        return ApiResponse.BADREQUEST(res, "O motivo de rejeição é obrigatório.")
    }

    const [updateRequest, findUpdateRequestError] = await findUpdateRequestById(id)

    if (!updateRequest && findUpdateRequestError != 404) {
        return ApiResponse.ERROR(res, `Erro interno do servidor.`)
    }
    if (!updateRequest && findUpdateRequestError == 404) {
        return ApiResponse.NOTFOUND(res, "Pedido não encontrado.")
    }

    await denyUpdateRequest(id)

    // Notificando o usuário

    const [user, findUserError] = await findUserById(updateRequest.user_id)

    if (!user && findUserError != 404) {
        // Erro interno do servidor, algum problema com o banco de dados.
        return ApiResponse.ERROR(res, `Erro interno do servidor.`, { "error": findUserError })
    } else if (findUserError == 404) {
        // Usuário não encontrado.
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }

    const email = user.email
    const emailHtml = rejected_request_email_template(id, user.nome, motivo)

    const [info, sendEmailError] = await sendMail(email, `Pedido de alteração de negado. `, emailHtml)
    if (sendEmailError) {
        return ApiResponse.ERROR(res, `Erro ao enviar email.`)
    }

    return ApiResponse.OK(res, null, "Pedido de alteração de dados rejeitado!")

}

// PUT api/v1/secretaria/:id
const atualizarUsuario = async (req, res) => {
    const id = req.params.id
    const updates = req.body // {nome: "nome", rg: "rg"}

    if (Object.keys(updates).length <= 0) {
        return ApiResponse.BADREQUEST(res, "Os campos de atualização são obrigatórios.")
    }

    if (!id) {
        return ApiResponse.BADREQUEST(res, "O id do pedido é obrigatório.")
    }

    const { error } = updateUserSchema.validate(updates, { abortEarly: false })

    if (error) {
        // Retorna os erros de validação em formato mais amigável
        const errorMessages = error.details.map(err => err.message)
        return ApiResponse.BADREQUEST(res, errorMessages)
    }

    const [user, findUserError] = await findUserById(id)

    if (!user && findUserError != 404) {
        // Erro interno do servidor, algum problema com o banco de dados.
        return ApiResponse.ERROR(res, `Erro interno do servidor.`)
    } else if (findUserError == 404) {
        // Usuário não encontrado.
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }

    const [updated, updateUserError] = await updateUser(user.id, updates)

    if (!updated) {
        return ApiResponse.ERROR(res, "Erro interno do servidor.")
    }

    return ApiResponse.OK(res, null, "Pedido de alteração de dados aprovado!")
}

// POST api/v1/secretaria/late-entries/:id/validate
const validarAtraso = async (req, res) => {
    const id = req.params.id
    const { motivo, responsavel } = req.body

    if (!motivo || !responsavel) {
        return ApiResponse.BADREQUEST(res, "O motivo e o responsável do redirecionamento são obrigatórios.")
    }

    const [foundLateEntry, findLateEntryError] = await getLateEntry(id)

    if (!foundLateEntry) {
        return ApiResponse.NOTFOUND(res, "Registro de atraso não encontrado.")
    }

    if (foundLateEntry.status != "Pendente") {
        return ApiResponse.BADREQUEST(res, `O registro de atraso não pode ser validado, seu status é de ${foundLateEntry.status}`)
    }

    const [result, validateLateEntryError] = await validateLateEntry(id, responsavel, motivo)

    if (!result && validateLateEntryError == 404) {
        return ApiResponse.NOTFOUND(res, "Atraso não encontrado.")
    } else if (!result && validateLateEntryError != 404) {
        return ApiResponse.ERROR(res, "Erro interno do servidor.")
    }

    // Atraso validado, iremos notificar o usuario

    const [user, findUserError] = await findUserById(result.user_id)

    if (!user && findUserError != 404) {
        // Erro interno do servidor, algum problema com o banco de dados.
        return ApiResponse.ERROR(res, `Erro interno do servidor.`)
    } else if (findUserError == 404) {
        // Usuário não encontrado.
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }

    const email = user.email
    const emailHtml = late_entry_approved_email_template(user.nome, user.turma, moment().format("DD/MM/YYYY - HH:mm"), responsavel, motivo)

    const [info, sendEmailError] = await sendMail(email, `Atraso validado, siga para a sala. `, emailHtml)
    if (sendEmailError) {
        return ApiResponse.ERROR(res, `Erro ao enviar email.`)
    }

    return ApiResponse.OK(res, { result }, "Atraso validado!")
}

// GET api/v1/secretaria/late-entries/:id
const atrasosDeUmAluno = async (req, res) => {
    const id = req.params.id
    const [atrasos, findAtrasosError] = await getLateEntries(id)

    if (findAtrasosError) {
        return ApiResponse.ERROR(res, "Erro interno do servidor.")
    }

    const [user, findUserError] = await findUserById(id)

    if (!user && findUserError != 404) {
        // Erro interno do servidor, algum problema com o banco de dados.
        return ApiResponse.ERROR(res, `Erro interno do servidor.`)
    } else if (findUserError == 404) {
        // Usuário não encontrado.
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }


    return ApiResponse.OK(res, { atrasos }, `Atrasos do aluno ${user.nome}.`)
}

export { registrarAluno, registrarFuncionario, atualizarUsuario, deletarUsuario, aprovarPedido, rejeitarPedido, validarAtraso, atrasosDeUmAluno }