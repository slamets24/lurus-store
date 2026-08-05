import LoginController from './LoginController'
import RegisterController from './RegisterController'
import PasswordResetController from './PasswordResetController'
import EmailOtpController from './EmailOtpController'
const Auth = {
    LoginController: Object.assign(LoginController, LoginController),
RegisterController: Object.assign(RegisterController, RegisterController),
PasswordResetController: Object.assign(PasswordResetController, PasswordResetController),
EmailOtpController: Object.assign(EmailOtpController, EmailOtpController),
}

export default Auth