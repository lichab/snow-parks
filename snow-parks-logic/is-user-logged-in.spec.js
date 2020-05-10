const logic = require('.')
const { isUserLoggedIn } = logic
const { expect } = require('chai')
const AsyncStorage = require('not-async-storage')

logic.__context__.storage = AsyncStorage

describe('isUserLoggedIn', () => {
    let token = `${Math.random}`
    describe('when user is logged in', () => {
        it('should return true', async () => {
            await logic.__context__.storage.setItem('token', token)

            const isLogged = await isUserLoggedIn()

            expect(isLogged).to.equal(true)
        })

        afterEach(async () => logic.__context__.storage.clear())
    })

    describe('when user is not logged in', () => {
        it('should return false', async () => {
            const isLogged = await isUserLoggedIn()

            expect(isLogged).to.equal(false)
        })
    })
})