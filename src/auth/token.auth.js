import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const { ACCESS_SECRET, REFRESH_SECRET } = process.env;

export async function generateTokens(user) {
    const accessToken = jwt.sign({ id: user.id_user, role: user.role }, ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id_user }, REFRESH_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
}

export function verifyAccessToken(token) {
    try {
        return jwt.verify(token, ACCESS_SECRET);
    } catch (error) {
        return null;
    }
}

export function verifyRefreshToken(refreshToken) {
    try {
        return jwt.verify(refreshToken, REFRESH_SECRET);
    } catch (error) {
        return null;
    }
}