const context = require('./context')

/**
 * Removes the user's token from the context's storage
 * 
 * @returns {undefined} 
 * 
 */

module.exports = function () {
    this.storage.removeItem('token')
    delete this.user
    return
}.bind(context)