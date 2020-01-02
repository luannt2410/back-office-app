import { AuthService, SessionValidationGuard } from './shared';


export const AuthProvider = [
    AuthService, SessionValidationGuard
]

export { AuthService, SessionValidationGuard } from './shared';