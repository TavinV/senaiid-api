export const approved_request_email_template = (request_id, user_name) => {
    const html = `<!DOCTYPE html>
    <html lang="en">
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
                background-color: #28a745;
                z-index: 10000;
                margin-bottom: 20px;
            }

            .header-green-container {
                position: relative;
                background-color: var(--verde);
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
            }
            .email-body p {
                font-size: 16px;
                line-height: 1.5;
                text-align: left;
            }
            
            hr {
                margin-top: 48px;
                margin-bottom: 48px;
            }

            span {
                margin-bottom: 48px;
            }
           
            .confirmacao {
                font-weight: 600;
                margin-top: 30px;
                color: #28a745;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <header>
                <div class="header-green-container"> </div>
            </header>
            <div class="email-body">
                <h1>Seu pedido de correção foi aprovado!</h1>
                <br>
                <p>
                    Temos boas notícias! Seu pedido de atualização de dados foi <b>aceito</b> e as alterações já foram aplicadas ao nosso sistema. Se precisar de mais alguma modificação, fique à vontade para entrar em contato.
                </p>
                <hr>
                <span>
                    <h2>Pedido #${request_id}</h2>
                    <br>
                    <h2>${user_name}</h2>
                </span>
                <br>
                <h3 class="confirmacao">Os dados foram atualizados com sucesso.</h3>
            </div>
        </div>
    </body>
</html>`;

    return html;
};
