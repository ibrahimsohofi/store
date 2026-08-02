import knex from '../../../config/knex.js';
import bcrypt from 'bcrypt';

export const authRepo = {
  async findUserByEmail(email) {
    return knex('shop_customers').where({ email }).first();
  },

  async findUserById(id) {
    return knex('shop_customers').where({ id }).first();
  },

  async createUser(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const [user] = await knex('shop_customers').insert({
      email: data.email,
      password_hash: hashedPassword,
      first_name: data.firstName,
      last_name: data.lastName,
      phone: data.phone || null,
      is_active: true,
    }).returning('*');
    
    return user;
  },

  async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  },

  async updateUser(id, data) {
    const updateData = {};
    if (data.firstName) updateData.first_name = data.firstName;
    if (data.lastName) updateData.last_name = data.lastName;
    if (data.phone) updateData.phone = data.phone;
    if (data.password) {
      updateData.password_hash = await bcrypt.hash(data.password, 10);
    }
    
    return knex('shop_customers')
      .where({ id })
      .update(updateData)
      .returning('*');
  },

  async createRefreshToken(userId, token, expiresIn) {
    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    
    return knex('shop_refresh_tokens').insert({
      user_id: userId,
      token,
      expires_at: expiresAt,
    });
  },

  async findRefreshToken(token) {
    return knex('shop_refresh_tokens')
      .where({ token })
      .where('expires_at', '>', new Date())
      .first();
  },

  async deleteRefreshToken(token) {
    return knex('shop_refresh_tokens').where({ token }).del();
  },

  async deleteAllRefreshTokens(userId) {
    return knex('shop_refresh_tokens').where({ user_id: userId }).del();
  },
};
