import AuthService from '../service/auth.service.js';

export default class AuthController {

    // Controlador para iniciar sesión
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: "Email y contraseña son requeridos." });
            }

            const { accessToken, refreshToken, user } = await AuthService.login(email, password);

            res.cookie('refreshToken', refreshToken,
                {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'Strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                }
            );

            return res.status(200).json({ accessToken, user });
        } catch (error) {
            return res.status(401).json({ error: error.message });
        }
    }

    static async logout(req, res) {
        try {
            const user_id = req.user.id_user; 
            await AuthService.logout(user_id);
    
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: true, 
                sameSite: 'Strict',
            });
    
            return res.status(200).json({ message: "Sesión cerrada correctamente." });
        } catch (error) {
            return res.status(500).json({ error: `Error al cerrar sesión: ${error.message}` });
        }
    }
    

    // Controlador para refrescar el token
    static async refresh(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return res.status(400).json({ error: "Token de actualización requerido." });
            }

            const { accessToken, newRefreshToken } = await AuthService.refresh(refreshToken);
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            return res.status(200).json({ accessToken });
        } catch (error) {
            return res.status(403).json({ error: error.message });
        }
    }

    // Controlador para cerrar sesion
    static async logout(req, res) {
        try {
            res.clearCookie('refreshToken',
                {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'Strict'
                }
            );
            return res.status(200).json({ message: 'Sesion cerrada correctamente.' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

}
