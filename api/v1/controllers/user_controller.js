import moment from "moment";

// Services
import { findUserById, findUserPFP, generateQRCODE, updateUser, findUserByEmail } from "../services/user_services.js";
import { createToken, verifyToken, deleteToken } from "../services/email_token_services.js";
import { createUpdateRequest } from "../services/update_request_services.js";
import { createPasswordResetToken, deletePasswordResetToken, verifyPasswordResetToken } from "../services/password_reset_services.js";
import { createLateEntry, getLateEntries, getLateEntry } from "../services/late_entry_services.js";

//Lib
import sendMail from "../lib/Emails.js";
import ApiResponse from '../lib/ApiResponse.js'
import { minuteDiff } from "../lib/Horarios.js";
import { criarHash } from "../lib/Criptografar.js";

// Email Templates
import { email_verification_token_template } from "../templates/email_verification_token_template.js";
import { update_request_email_template } from "../templates/update_request_pending_template.js";
import { password_reset_token_template } from '../templates/password_reset_token_template.js';
import { late_entry_pending_email_template } from "../templates/late_entry_pending_template.js";

// GET api/v1/users/:id
const getUser = async (req, res) => {
    const id = req.params.id

    const [user, error] = await findUserById(id)

    if (!user && error != 404) {
        // Erro interno do servidor, algum problema com o banco de dados.

        return ApiResponse.ERROR(res, `Erro interno do servidor. ${error}`)
    } else if (error == 404) {
        // Usuário não encontrado.

        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }

    // Retornando o usuário
    const filteredData = {
        id: user.id,
        nome: user.nome,
        cargo: user.cargo,
        rg: user.rg,
        email: user.email,
        data_nascimento: user.data_nascimento,
        curso: user.curso,
        turma: user.turma,
        horario_entrada: user.horario_entrada,
        matricula: user.matricula,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
    return ApiResponse.OK(res, filteredData)
}


// GET api/v1/users/:id/foto-perfil
const getFotoPerfil = async (req, res) => {
    const id = req.params.id

    const [user, findUserError] = await findUserById(id)

    if (!user && findUserError != 404) {
        // Erro interno do servidor, algum problema com o banco de dados.
        return ApiResponse.ERROR(res, `Erro interno do servidor.`)
    } else if (findUserError == 404) {
        // Usuário não encontrado.
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }

    // Após buscar o usuário, vamos encontrar a sua foto de perfil

    const [filePath, error] = await findUserPFP(user)
    if (!filePath) {
        return ApiResponse.NOTFOUND(res, "Foto de perfil não encontrada.")
    } else {
        return res.sendFile(filePath)
    }
}


// GET api/v1/users/:id/primeiro-acesso
const primeiroAcesso = async (req, res) => {
    const id = req.params.id

    const [user, findUserError] = await findUserById(id)

    if (!user && findUserError != 404) {
        // Erro interno do servidor, algum problema com o banco de dados.
        return ApiResponse.ERROR(res, `Erro interno do servidor.`)
    } else if (findUserError == 404) {
        // Usuário não encontrado.
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }

    return ApiResponse.OK(res, {
        nome: user.nome,
        login: user.login,
        senha: user.senha_padrao,
        rg: user.rg
    })
}


// GET api/v1/users/me/acesso
const acesso = async (req, res) => {
    const id = req.decoded.id
    const [user, findUserError] = await findUserById(id)

    if (!user && findUserError != 404) {
        return ApiResponse.ERROR(res, `Erro interno do servidor.`)
    } else if (findUserError == 404) {
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }

    const qrCodeURL = generateQRCODE(user)
    return ApiResponse.OK(res, { url: qrCodeURL })

}

// POST api/v1/users/me/late-entries/request-delay
const pedirAtraso = async (req, res) => {
    const id = req.decoded.id
    const [user, findUserError] = await findUserById(id)

    if (!user && findUserError != 404) {
        return ApiResponse.ERROR(res, `Erro interno do servidor.`)
    } else if (findUserError == 404) {
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }

    // Verificando se o usuário já tem um atraso pendente
    const [lateEntries, getLateEntriesError] = await getLateEntries(user.id)
    if (getLateEntriesError) {
        return ApiResponse.ERROR(res, `Erro ao buscar atrasos pendentes: ${getLateEntriesError}`)
    }

    if (lateEntries.length > 0 && lateEntries.some(entry => entry.status === 'Pendente')) {
        return ApiResponse.ERROR(res, "Você já tem um atraso pendente. Regularize-o antes de solicitar outro.")
    }

    const [lateEntry, createLateEntryError] = await createLateEntry(user.id)
    if (createLateEntryError) {
        return ApiResponse.ERROR(res, `Erro ao registrar o atraso.`, { url: qrCodeURL })
    }

    const emailHtml = late_entry_pending_email_template(user.nome, lateEntry.id)
    const [info, sendEmailError] = await sendMail(user.email, `Seu atraso foi registrado, compareca à secretaria!`, emailHtml)

    if (sendEmailError) {
        return ApiResponse.ERROR(res, `Erro ao enviar email: ${sendEmailError}`, { url: qrCodeURL })
    }

    return ApiResponse.OK(res, { codigo_atraso: lateEntry.id }, "Atraso registrado com sucesso. Compareça à secretaria para mais informações.")

}


// GET api/v1/users/me/late-entries
const buscarAtrasos = async (req, res) => {
    const id = req.decoded.id
    const [user, findUserError] = await findUserById(id)

    if (!user && findUserError != 404) {
        // Erro interno do servidor, algum problema com o banco de dados.
        return ApiResponse.ERROR(res, `Erro interno do servidor. ${error}`)
    } else if (findUserError == 404) {
        // Usuário não encontrado.
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }

    const [atrasos, error] = await getLateEntries(user.id)

    return ApiResponse.OK(res, { atrasos })
}

// GET api/v1/users/me/late-entries/:id
const buscarAtraso = async (req, res) => {
    const user_id = req.decoded.id
    const lateEntryId = req.params.id

    if (!lateEntryId) {
        return ApiResponse.ERROR(res, "ID do atraso não foi fornecido.")
    }

    const [user, findUserError] = await findUserById(user_id)

    if (!user && findUserError != 404) {
        // Erro interno do servidor, algum problema com o banco de dados.
        return ApiResponse.ERROR(res, `Erro interno do servidor. ${error}`)
    } else if (findUserError == 404) {
        // Usuário não encontrado.
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }

    const [lateEntry, findLateEntryError] = await getLateEntry(lateEntryId)

    if (!lateEntry) {
        return ApiResponse.NOTFOUND(res, "Atraso não encontrado.")
    }

    if (lateEntry.user_id != user_id) {
        return ApiResponse.FORBIDDEN(res, "Você não tem permissão para vizualizar esse atraso.")
    }

    return ApiResponse.OK(res, { lateEntry })

}

// POST api/v1/users/:id/verify-email/request-token
const pedirToken = async (req, res) => {
    const id = req.params.id
    const { email } = req.body

    if (!id) {
        return ApiResponse.BADREQUEST(res, "ID do usuário não foi fornecido")
    }
    if (!email) {
        return ApiResponse.BADREQUEST(res, "Email não foi fornecido")
    }

    const [user, findUserError] = await findUserById(id)

    if (!user && findUserError != 404) {
        // Erro interno do servidor, algum problema com o banco de dados.
        return ApiResponse.ERROR(res, `Erro interno do servidor.`)
    } else if (findUserError == 404) {
        // Usuário não encontrado.
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }

    // Criando o código de verificação

    const [token, createTokenError] = await createToken(user.id, email)

    if (createTokenError) {
        return ApiResponse.ERROR(res, `Erro ao criar Código de verificação: ${createTokenError}`)
    }

    // Enviando o código por email

    const emailHtml = email_verification_token_template(email, token)
    const [info, sendEmailError] = await sendMail(email, `Seu código de verificação é: ${token}`, emailHtml)

    if (!sendEmailError) {
        return ApiResponse.OK(res, null, "Código de verificação enviado com sucesso.")
    } else {
        return ApiResponse.ERROR(res, `Erro ao enviar email: ${sendEmailError}`)
    }

}


// POST api/v1/users/:id/verify-email/validate-token
const validarToken = async (req, res) => {
    const id = req.params.id
    const { token } = req.body

    if (!token) {
        return ApiResponse.BADREQUEST(res, "Código de verificação não foi fornecido")
    }

    const [user, findUserError] = await findUserById(id)

    if (!user && findUserError != 404) {
        // Erro interno do servidor, algum problema com o banco de dados.
        return ApiResponse.ERROR(res, `Erro interno do servidor.`)
    } else if (findUserError == 404) {
        // Usuário não encontrado.
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }

    const [tokenData, findTokenError] = await verifyToken(token)

    if (!tokenData) {
        return ApiResponse.UNAUTHORIZED(res, "Código de verificação inválido ou expirado")
    }

    const time_diff = minuteDiff(new Date(), tokenData.expires)

    if (time_diff > 10) {
        deleteToken(tokenData.token)
        return ApiResponse.UNAUTHORIZED(res, "Código de verificação expirado")
    }

    const email = tokenData.email
    const [sucess, updateError] = await updateUser(id, { email: email })

    if (updateError) {
        return ApiResponse.ERROR(res, `Erro ao atualizar o usuário: ${updateError}`)
    }

    deleteToken(tokenData.token)
    return ApiResponse.OK(res, null, "Email verificado com sucesso.")

}


// POST api/v1/users/:id/request-update
const pedirUpdate = async (req, res) => {
    const id = req.params.id

    const [user, findUserError] = await findUserById(id)

    if (!user && findUserError != 404) {
        // Erro interno do servidor, algum problema com o banco de dados.
        return ApiResponse.ERROR(res, `Erro interno do servidor.`)
    } else if (findUserError == 404) {
        // Usuário não encontrado.
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }

    const email = user.email
    const { tel, message } = req.body

    if (!tel) {
        return ApiResponse.BADREQUEST(res, "Telefone não informado.")
    }
    if (!message) {
        return ApiResponse.BADREQUEST(res, "Mensagem não informada.")
    }

    const [updateRequest, generateUpdateRequestError] = await createUpdateRequest(user.id, tel, message, user.nome)

    if (generateUpdateRequestError) {
        return ApiResponse.ERROR(res, `Erro ao gerar pedido de atualização: ${generateUpdateRequestError}`)
    }

    const updateRequestId = updateRequest.request_id
    const updateRequestMessage = updateRequest.message

    // Enviando a confirmação por email

    const emailHtml = update_request_email_template(updateRequestId, updateRequestMessage, user.nome)
    const [info, sendEmailError] = await sendMail(email, `Seu pedido de correção de dados está em análise`, emailHtml)

    if (!sendEmailError) {
        return ApiResponse.OK(res, { numero_pedido: updateRequestId }, "Pedido de verificação criado com sucesso")
    } else {
        return ApiResponse.ERROR(res, `Erro ao enviar email: ${sendEmailError}`)
    }

}

// POST api/v1/users/forgot-password?email=
const forgotPassword = async (req, res) => {
    const email = req.query.email || ""

    if (email == "") {
        return ApiResponse.BADREQUEST(res, "Usuário não tem um email verificado.")
    }

    const [user, findUserError] = await findUserByEmail(email)

    if (!user && findUserError != 404) {
        // Erro interno do servidor, algum problema com o banco de dados.
        return ApiResponse.ERROR(res, `Erro interno do servidor. ${error}`)
    } else if (findUserError == 404) {
        // Usuário não encontrado.
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }

    const [tokenCode, createPasswordResetTokenError] = await createPasswordResetToken(user.id)

    if (!tokenCode) {
        return ApiResponse.ERROR(res, `Erro ao criar token de recuperação de senha.`)
    }

    // Enviando o email para o usuário

    const emailHtml = password_reset_token_template(tokenCode)
    const [info, sendEmailError] = await sendMail(email, `Redefina a sua senha`, emailHtml)

    if (!sendEmailError) {
        return ApiResponse.OK(res, null, "Codigo de recuperação de senha enviado com sucesso")
    } else {
        return ApiResponse.ERROR(res, `Erro ao enviar email: ${sendEmailError}`)
    }

}

// POST api/v1/users/reset-password?token=
const resetPassword = async (req, res) => {
    const token = req.query.token
    const { senha, confirmarSenha } = req.body

    const [tokenData, findTokenError] = await verifyPasswordResetToken(token)

    if (!tokenData) {
        return ApiResponse.UNAUTHORIZED(res, "Código de verificação inválido")
    }

    const time_diff = minuteDiff(new Date(), tokenData.expires)

    if (time_diff > 10) {
        deletePasswordResetToken(tokenData.token)
        return ApiResponse.UNAUTHORIZED(res, "Código de verificação expirado")
    }

    if (!senha || !confirmarSenha) {
        return ApiResponse.BADREQUEST(res, "Preencha todos os campos")
    }

    if (senha != confirmarSenha) {
        return ApiResponse.BADREQUEST(res, "As senhas não coincidem.")
    }

    // Atualizar a senha do usuário, criptografando.

    const id = tokenData.user_id

    const [user, findUserError] = await findUserById(id)

    if (!user && findUserError != 404) {
        // Erro interno do servidor, algum problema com o banco de dados.
        return ApiResponse.ERROR(res, `Erro interno do servidor.`)
    } else if (findUserError == 404) {
        // Usuário não encontrado.
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }

    const salt = user.salt
    const senhaCriptografada = criarHash(confirmarSenha, salt)

    const [updated, updateUserError] = await updateUser(id, { senha: senhaCriptografada })

    if (!updated) {
        return ApiResponse.ERROR(res, `Erro ao atualizar senha`)
    }

    deletePasswordResetToken(tokenData.token)
    return ApiResponse.OK(res, "Senha atualizada com sucesso")

}


// POST api/v1/users/:id/setup-password
const setupPassword = async (req, res) => {
    const id = req.params.id
    const { rg, senha, confirmarSenha } = req.body

    if (!rg || !senha || !confirmarSenha) {
        return ApiResponse.BADREQUEST(res, "Preencha todos os campos")
    }

    if (id == "") {
        return ApiResponse.BADREQUEST(res, "ID é obrigatório.")
    }

    const [user, findUserError] = await findUserById(id)

    if (!user && findUserError != 404) {
        // Erro interno do servidor, algum problema com o banco de dados.
        return ApiResponse.ERROR(res, `Erro interno do servidor`)

    } else if (findUserError == 404) {
        // Usuário não encontrado.
        return ApiResponse.NOTFOUND(res, "Usuário não foi encontrado.")
    }

    // Verificando se o RG cadastrado e o fornecido coincidem

    if (user.rg !== rg) {
        return ApiResponse.BADREQUEST(res, "Rg não coincide com o cadástro.")
    }

    // Verificando se é o primeiro acesso do usuário

    if (user.senha_foi_alterada) {
        return ApiResponse.BADREQUEST(res, "Senha já foi alterada")
    }

    // Verificando se as senhas coincidem

    if (senha !== confirmarSenha) {
        return ApiResponse.BADREQUEST(res, "Senhas não coincidem.")
    }

    // Criptografando a senha

    const salt = user.salt
    const senhaCriptografada = criarHash(confirmarSenha, salt)

    const [updated, updateUserError] = await updateUser(id, { senha: senhaCriptografada, senha_foi_alterada: true })

    if (!updated) {
        return ApiResponse.ERROR(res, `Erro ao atualizar senha`)
    }

    return ApiResponse.OK(res, "Senha atualizada com sucesso")

}

export {
    getUser,
    getFotoPerfil,
    primeiroAcesso,
    acesso,
    pedirToken,
    validarToken,
    pedirUpdate,
    forgotPassword,
    resetPassword,
    setupPassword,
    buscarAtrasos,
    buscarAtraso,
    pedirAtraso
}