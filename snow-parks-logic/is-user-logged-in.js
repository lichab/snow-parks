const context = require('./context')

/**
 * Verifyis if user's token is already in the context storage
 * @returns {Promise<Boolean>} 
 */

module.exports = async function () {
    const token = await this.storage.getItem('token')
    return !!token
}.bind(context)