module.exports = function (document) {
    document.id = document._id.toString()
    delete document._id
    delete document.__v
    document.password && delete document.password

    return document
}