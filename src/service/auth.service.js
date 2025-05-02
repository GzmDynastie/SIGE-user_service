import { generateTokens, verifyRefreshToken } from '../auth/token.auth.js';
import { master } from '../configuration/connection.js';
import { comparePassword } from '../auth/bcrypt.auth.js';

export default class AuthService {

    // Iniciar sesión
    static async login(email, password) {
        try {
            const result = await master.query(`
                    SELECT * FROM sige.user
                    WHERE email = $1
                    AND status = true;`,
                [email]
            );

            if (result.rows.length === 0) {
                throw new Error(`Usuario no encontrado.`);
            }

            const user = result.rows[0];

            const passwordMatch = await comparePassword(password, user.password);
            if (!passwordMatch) {
                throw new Error('Contrasena incorrecta.');
            }

            const { accessToken, refreshToken } = await generateTokens(user);

            const user_id = user.id_user;
            const emailUser = user.email;
            const nameUser = user.name + " " + user.last_name;
            const roleUser = user.role;

            return {
                accessToken,
                refreshToken,
                user: {
                    id_user: user_id,
                    name: nameUser,
                    email: emailUser,
                    role: roleUser
                }
            };
        } catch (error) {
            throw new Error(`Error en el login: ${error.message}`);
        }
    }

    // Refrescar token
    static async refresh(refreshToken) {
        try {
            if (!refreshToken) {
                throw new Error('Token de actualización requerido.');
            }

            const decoded = verifyRefreshToken(refreshToken);
            if (!decoded) {
                throw new Error('Token de actualizacion invalido.');
            }

            const result = await master.query(`
                SELECT * FROM sige.user
                WHERE id_user = $1 
                AND status = true;`,
                [decoded.id]
            );

            if (result.rows.length === 0) {
                throw new Error('Usuario no encontrado.');
            }

            const user = result.rows[0];
            const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user);

            return { accessToken, newRefreshToken };
        } catch (error) {
            throw new Error(`Error al refrescar el token: ${error.message}`);
        }
    }

}