export const late_entry_pending_email_template = (nome, qrCode) => {
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
                .header-white-container {
                    position: relative;
                    background-color: #ffff;
                    border-bottom: 2px solid #cecece;
                    padding: 10px 0px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10;
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
                .email-body h1{
                    font-size: 2rem;
                    margin-bottom: 48px;
                    color: #e30613;
                }
                .email-body p {
                    font-size: 16px;
                    line-height: 1.5;
                    text-align: left;
                }
                span {
                    font-weight: 1000;
                    color: #e30613;
                }
                .qr-container {
                    margin-top: 48px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }
                .qr-container img {
                    width: 200px;
                    height: 200px;
                    margin-bottom: 10px;
                }
                .qr-code-text {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #e30613;
                }
                .email-footer {
                    text-align: center;
                    padding: 20px;
                    font-size: 14px;
                    color: #777777;
                    background-color: #f9f9f9;
                }
                .email-footer img {
                    width: 100px;
                    margin-top: 10px;
                }
                .email-footer p {
                    margin: 5px 0;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <header>
                    <div class="header-red-container"></div>
                </header>
                <div class="email-body">
                    <h1>Aviso de Atraso</h1>
                    <br>
                    <p>Olá, ${nome}</p>
                    <p>Detectamos que você está atrasado para sua aula no <span><strong>Senai</strong></span>.</p>
                    <p>Você deve comparecer imediatamente à <b>Sala do Orientador de Práticas Profissionais</b> para regularizar sua situação.</p>
                    <p>Apresente o código abaixo para obter o seu <b>Comprovante de Redirecionamento</b> e seguir para a aula.</p>
                    <div class="qr-container">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrCode}" alt="QR Code">
                    </div>
                        <div class="qr-code-text">${qrCode}</div>
                    <br>
                    <p>Caso tenha dúvidas, procure a secretaria.</p>
                </div>
            </div>
        </body>
        </html>`;

    return html;
};
