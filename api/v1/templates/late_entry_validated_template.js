export const late_entry_approved_email_template = (nome, turma, horarioValidado, autorizadoPor, motivo) => {
    const html = `<!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap');
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: 'Montserrat', sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 1000px;
                    margin: 20px auto;
                    background: #ffffff;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
                header {
                    width: 100%;
                    position: sticky;
                    top: 0;
                    left: 0;
                    background-color: #e30613;
                    z-index: 10000;
                    margin-bottom: 20px;
                }
                .header-red-container {
                    position: relative;
                    background-color: var(--vermelho);
                    z-index: 10;
                    width: 100vw;
                    display: flex;
                    height: 35px;
                    padding-left: 1%;
                    padding-right: 1%;
                    justify-content: space-between;
                    align-items: center;
                }
                .email-body {
                    padding: 30px 60px;
                    padding-bottom: 60px;
                    text-align: left;
                    color: black;
                }
                .email-body h1 {
                    font-size: 2rem;
                    margin-bottom: 48px;
                    color: #e30613;
                }
                .email-body p {
                    font-size: 16px;
                    line-height: 1.5;
                    text-align: left;
                }
                .email-body .info {
                    font-size: 18px;
                    font-weight: bold;
                    margin: 10px 0;
                }
                span {
                    font-weight: 1000;
                    color: #e30613;
                }
                .email-footer {
                    text-align: center;
                    padding: 20px;
                    font-size: 14px;
                    color: #777777;
                    background-color: #f9f9f9;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <header>
                    <div class="header-red-container"></div>
                </header>
                <div class="email-body">
                    <h1>Atraso Validado</h1>
                    <br>
                    <p>Olá, ${nome}</p>
                    <p>Seu atraso foi validado e você está autorizado a seguir para a sua aula.</p>
                    <div class="info">Turma: <span>${turma}</span></div>
                    <div class="info">Horário da Validação: <span>${horarioValidado}</span></div>
                    <div class="info">Autorizado por: <span>${autorizadoPor}</span></div>
                    <div class="info">Motivo do Atraso: <span>${motivo}</span></div>
                    <br>
                    <p>Apresente este e-mail ao professor para que sua entrada seja liberada.</p>
                    <p>Caso tenha dúvidas, procure a secretaria.</p>
                </div>
            </div>
        </body>
        </html>`;

    return html;
};
