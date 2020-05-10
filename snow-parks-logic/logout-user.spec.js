const logic = require('.')
const { logoutUser } = logic
const { expect } = require('chai')
const AsyncStorage = require('not-async-storage')

logic.__context__.storage = AsyncStorage

describe('logoutUser', () => {
    let token, user
    beforeEach(() => {
        token = `${Math.random()}`
        user = {
            name: `name-${Math.random()}`
        }
    })

    it('should remove the token from storage', async () => {
        await logic.__context__.storage.setItem('token', token)

        await logoutUser()

        expect(logic.__context__.storage.getItem('token')).to.not.have.ownProperty('token')
    })

    describe('when user was retrieved', () => {
        beforeEach(async () => {
            await logic.__context__.storage.setItem('token', token)
            logic.__context__.user = user
        })

        it('should remove the user from storage', async () => {
            await logoutUser()

            expect(logic.__context__.user).to.be.undefined
        })
    })

})