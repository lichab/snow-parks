const context = require('./context')

module.exports = {
    get __context__() { return context },
    loginUser: require('./login-user'),
    registerUser: require('./register-user'),
    retrieveUser: require('./retrieve-user'),
    logoutUser: require('./logout-user'),
    isUserLoggedIn: require('./is-user-logged-in'),
    createPark: require('./create-park'),
    retrievePark: require('./retrieve-park'),
    retrievePublishedParks: require('./retrieve-published-parks'),
    searchParks: require('./search-parks'),
    reportPark: require('./report-park'),
    approvePark: require('./approve-park'),
    publishComment: require('./publish-comment'),
    updateUser: require('./update-user'),
    votePark: require('./vote-park'),
    deletePark: require('./delete-park'),
    updatePark: require('./update-park'),
    isAnonymousUser: require('./is-anonymous-user'),
    setAnonymousUser: require('./set-anonymous-user')
}