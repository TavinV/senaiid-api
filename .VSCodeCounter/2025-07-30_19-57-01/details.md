# Details

Date : 2025-07-30 19:57:01

Directory c:\\Users\\otavi\\OneDrive\\Área de Trabalho\\Projetos\\senaiid-api

Total : 57 files,  6807 codes, 128 comments, 604 blanks, all 7539 lines

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [README.md](/README.md) | Markdown | 72 | 0 | 39 | 111 |
| [Senai Id.postman\_collection.json](/Senai%20Id.postman_collection.json) | JSON | 955 | 0 | 0 | 955 |
| [api/v1/app.js](/api/v1/app.js) | JavaScript | 22 | 1 | 6 | 29 |
| [api/v1/auth/JWT\_services.js](/api/v1/auth/JWT_services.js) | JavaScript | 21 | 0 | 6 | 27 |
| [api/v1/config/config.js](/api/v1/config/config.js) | JavaScript | 26 | 0 | 4 | 30 |
| [api/v1/config/senai-id-config.json](/api/v1/config/senai-id-config.json) | JSON | 20 | 0 | 0 | 20 |
| [api/v1/controllers/login\_controller.js](/api/v1/controllers/login_controller.js) | JavaScript | 15 | 3 | 6 | 24 |
| [api/v1/controllers/secretaria\_controller.js](/api/v1/controllers/secretaria_controller.js) | JavaScript | 335 | 39 | 127 | 501 |
| [api/v1/controllers/user\_controller.js](/api/v1/controllers/user_controller.js) | JavaScript | 397 | 60 | 154 | 611 |
| [api/v1/job\_runner.js](/api/v1/job_runner.js) | JavaScript | 30 | 2 | 8 | 40 |
| [api/v1/jobs/expired\_tokens\_job.js](/api/v1/jobs/expired_tokens_job.js) | JavaScript | 36 | 0 | 12 | 48 |
| [api/v1/jobs/late\_entrys\_job.js](/api/v1/jobs/late_entrys_job.js) | JavaScript | 19 | 0 | 5 | 24 |
| [api/v1/lib/ApiResponse.js](/api/v1/lib/ApiResponse.js) | JavaScript | 75 | 0 | 9 | 84 |
| [api/v1/lib/Criptografar.js](/api/v1/lib/Criptografar.js) | JavaScript | 18 | 0 | 6 | 24 |
| [api/v1/lib/Emails.js](/api/v1/lib/Emails.js) | JavaScript | 27 | 0 | 6 | 33 |
| [api/v1/lib/Horarios.js](/api/v1/lib/Horarios.js) | JavaScript | 11 | 3 | 7 | 21 |
| [api/v1/lib/MongoDB\_Connection.js](/api/v1/lib/MongoDB_Connection.js) | JavaScript | 12 | 0 | 3 | 15 |
| [api/v1/lib/logger.js](/api/v1/lib/logger.js) | JavaScript | 19 | 0 | 3 | 22 |
| [api/v1/middlewares/JWT\_Auth.js](/api/v1/middlewares/JWT_Auth.js) | JavaScript | 32 | 2 | 11 | 45 |
| [api/v1/middlewares/multer.js](/api/v1/middlewares/multer.js) | JavaScript | 19 | 1 | 6 | 26 |
| [api/v1/middlewares/validatebody.js](/api/v1/middlewares/validatebody.js) | JavaScript | 19 | 7 | 10 | 36 |
| [api/v1/models/early\_exit\_model.js](/api/v1/models/early_exit_model.js) | JavaScript | 46 | 0 | 2 | 48 |
| [api/v1/models/email\_verification\_token\_model.js](/api/v1/models/email_verification_token_model.js) | JavaScript | 26 | 0 | 3 | 29 |
| [api/v1/models/forgot\_password\_token\_model.js](/api/v1/models/forgot_password_token_model.js) | JavaScript | 22 | 0 | 3 | 25 |
| [api/v1/models/late\_entry\_model.js](/api/v1/models/late_entry_model.js) | JavaScript | 42 | 0 | 3 | 45 |
| [api/v1/models/user\_model.js](/api/v1/models/user_model.js) | JavaScript | 93 | 2 | 4 | 99 |
| [api/v1/models/user\_update\_request\_model.js](/api/v1/models/user_update_request_model.js) | JavaScript | 35 | 0 | 2 | 37 |
| [api/v1/routes/login\_routes.js](/api/v1/routes/login_routes.js) | JavaScript | 5 | 0 | 2 | 7 |
| [api/v1/routes/logs\_routes.js](/api/v1/routes/logs_routes.js) | JavaScript | 32 | 4 | 9 | 45 |
| [api/v1/routes/secretaria\_routes.js](/api/v1/routes/secretaria_routes.js) | JavaScript | 19 | 0 | 8 | 27 |
| [api/v1/routes/support\_routes.js](/api/v1/routes/support_routes.js) | JavaScript | 19 | 0 | 8 | 27 |
| [api/v1/routes/test\_routes.js](/api/v1/routes/test_routes.js) | JavaScript | 54 | 0 | 15 | 69 |
| [api/v1/routes/users\_routes.js](/api/v1/routes/users_routes.js) | JavaScript | 21 | 0 | 5 | 26 |
| [api/v1/server.js](/api/v1/server.js) | JavaScript | 14 | 1 | 4 | 19 |
| [api/v1/services/early\_exit\_services.js](/api/v1/services/early_exit_services.js) | JavaScript | 95 | 0 | 12 | 107 |
| [api/v1/services/email\_token\_services.js](/api/v1/services/email_token_services.js) | JavaScript | 28 | 0 | 7 | 35 |
| [api/v1/services/late\_entry\_services.js](/api/v1/services/late_entry_services.js) | JavaScript | 69 | 0 | 19 | 88 |
| [api/v1/services/password\_reset\_services.js](/api/v1/services/password_reset_services.js) | JavaScript | 29 | 0 | 10 | 39 |
| [api/v1/services/update\_request\_services.js](/api/v1/services/update_request_services.js) | JavaScript | 55 | 0 | 15 | 70 |
| [api/v1/services/user\_services.js](/api/v1/services/user_services.js) | JavaScript | 116 | 3 | 26 | 145 |
| [api/v1/templates/early\_exit\_approved\_template.js](/api/v1/templates/early_exit_approved_template.js) | JavaScript | 187 | 0 | 1 | 188 |
| [api/v1/templates/early\_exit\_pending\_template.js](/api/v1/templates/early_exit_pending_template.js) | JavaScript | 164 | 0 | 1 | 165 |
| [api/v1/templates/early\_exit\_rejected\_template.js](/api/v1/templates/early_exit_rejected_template.js) | JavaScript | 177 | 0 | 1 | 178 |
| [api/v1/templates/email\_verification\_token\_template.js](/api/v1/templates/email_verification_token_template.js) | JavaScript | 135 | 0 | 1 | 136 |
| [api/v1/templates/late\_entry\_pending\_template.js](/api/v1/templates/late_entry_pending_template.js) | JavaScript | 157 | 0 | 1 | 158 |
| [api/v1/templates/late\_entry\_validated\_template.js](/api/v1/templates/late_entry_validated_template.js) | JavaScript | 121 | 0 | 1 | 122 |
| [api/v1/templates/password\_reset\_token\_template.js](/api/v1/templates/password_reset_token_template.js) | JavaScript | 162 | 0 | 1 | 163 |
| [api/v1/templates/support\_email\_notification\_template.js](/api/v1/templates/support_email_notification_template.js) | JavaScript | 81 | 0 | 2 | 83 |
| [api/v1/templates/update\_request\_approved\_template.js](/api/v1/templates/update_request_approved_template.js) | JavaScript | 134 | 0 | 1 | 135 |
| [api/v1/templates/update\_request\_denied.js](/api/v1/templates/update_request_denied.js) | JavaScript | 132 | 0 | 1 | 133 |
| [api/v1/templates/update\_request\_pending\_template.js](/api/v1/templates/update_request_pending_template.js) | JavaScript | 132 | 0 | 1 | 133 |
| [api/v1/validation/user\_schemas.js](/api/v1/validation/user_schemas.js) | JavaScript | 32 | 0 | 3 | 35 |
| [logs/exception.log](/logs/exception.log) | Log | 9 | 0 | 1 | 10 |
| [logs/info.log](/logs/info.log) | Log | 412 | 0 | 1 | 413 |
| [logs/rejection.log](/logs/rejection.log) | Log | 6 | 0 | 1 | 7 |
| [package-lock.json](/package-lock.json) | JSON | 1,741 | 0 | 1 | 1,742 |
| [package.json](/package.json) | JSON | 25 | 0 | 0 | 25 |

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)