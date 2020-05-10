const context = require('./context')

module.exports = function () {
    return (async () => {
        return Boolean(await this.storage.getItem('role'))
    })()
}.bind(context)