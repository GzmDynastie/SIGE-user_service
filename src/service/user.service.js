import { master } from '../configuration/connection.js';
import { hashPassword } from '../auth/bcrypt.auth.js';

export default class UserService {

    // Crear un nuevo usuario (escritura en MASTER)
    static async createUser(tuition, name, last_name, email, role, password) {
        const pass = await hashPassword(password);
        try {
            const result = await master.query(`
                INSERT INTO sige.user (tuition, name, last_name, email, status, role, password) 
                VALUES ($1, $2, $3, $4, $5, $6, $7) 
                RETURNING *`,
                [tuition, name, last_name, email, 'true', role, pass]
            );
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error al crear usuario: ${error.message}`);
        } 
    }

    // Obtener todos los usuarios
    static async getAllUsers() {
        try {
            const result = await master.query(`
                SELECT * FROM sige.user
                WHERE status = true;`
            );
            return result.rows;
        } catch (error) {
            throw new Error(`Error al obtener a los usuarios: ${error.message}`);
        }
    }

    // Obtener usuario por Id
    static async getUserById(id) {
        try {
            const result = await master.query(`
                SELECT * FROM sige.user 
                WHERE id_user = $1;`,
                [id]
            );
            if (result.rows.length === 0) {
                throw new Error(`Usuario no encontrado con el ID: ${id}`);
            }
            return result.rows[0];
        } catch (error) {
            throw new Error(`Ha ocurrido un error! ${error.message}`);
        }
    }

    // Actualizar usuario por ID
    static async updateUser(id, tuition, name, last_name, email, status, role) {
        try {
            const result = await master.query(`
                UPDATE sige.user 
                SET tuition = $2, name = $3, last_name = $4, email = $5, status = $6, role = $7 
                WHERE id_user = $1 
                RETURNING *;`,
                [id, tuition, name, last_name, email, status, role]
            );
            if (result.rowCount === 0) {
                throw new Error(`Usuario no encontrado con el ID: ${id}`);
            }
            return result.rows[0];
        } catch (error) {
            throw new Error(`Ha ocurrido un error! ${error.message}`);
        }
    }

    // Eliminar un usuario por ID
    static async deleteUser(id) {
        try {
            const result = await master.query(`
                UPDATE sige.user
                SET status = false
                WHERE id_user = $1
                RETURNING *;`,
                [id]
            );
            if (result.rowCount === 0) {
                throw new Error(`Usuario no encontrado con el ID: ${id}`);
            }
            return result.rows[0];
        } catch (error) {
            throw new Error(`Ha ocurrido un error! ${error.message}`);
        }
    }

}