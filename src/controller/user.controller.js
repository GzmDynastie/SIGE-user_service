import UserService from '../service/user.service.js'

export default class UserController {

    // Crear un nuevo usuario
    static async createUser(req, res) {
        const { tuition, name, last_name, email, role, password } = req.body;
        try {
            const newUser = await UserService.createUser(tuition, name, last_name, email, role, password);
            res.status(201).json({ newUser });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Obtener todos los usuarios
    static async getAllUsers(req, res) {
        try {
            const getAllUsers = await UserService.getAllUsers();
            res.status(200).json({ getAllUsers });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Obtener usuario por Id
    static async getUserById(req, res) {
        const id = req.params.id;
        try {
            const getUserById = await UserService.getUserById(id);
            res.status(200).json({ usuarios: getUserById });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Actualizar usuario por ID
    static async updateUser(req, res) {
        const id = req.params.id;
        const { tuition, name, last_name, email, status, role } = req.body;

        try {
            const user = await UserService.updateUser(id, tuition, name, last_name, email, status, role);
            if (!user) return res.status(404).json({ error: "Usuario no encontrado." });
            res.status(200).json({ usuario: user });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Eliminar usuario por ID
    static async deleteUser(req, res) {
        const id = req.params.id;
        try {
            const success = await UserService.deleteUser(id);
            if (!success) return res.status(404).json({ error: "Usuario no encontrado." });
            res.status(200).json({ message: "Usuario eliminado." });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
}