const logic = require('.')
const { isAnonymousUser } = logic
const { expect } = require('chai')
const AsyncStorage = require('not-async-storage')

logic.__context__.storage = AsyncStorage

describe('isAnonymousUser', () => {

    describe('when user was set as anonymous', () => {
        beforeEach(async () => await logic.__context__.storage.setItem('role', 'anonymous'))

        it('should return true', async () => {
            const isAnonymous = await isAnonymousUser()

            expect(isAnonymous).to.equal(true)
        })

        afterEach(async () => await logic.__context__.storage.clear())
    })

    describe('when no anonymous user was set', () => {

        it('should return true', async () => {
            const isAnonymous = await isAnonymousUser()

            expect(isAnonymous).to.equal(false)
        })
    })
})