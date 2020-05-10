const logic = require('.')
const { setAnonymousUser } = logic
const { expect } = require('chai')
const AsyncStorage = require('not-async-storage')

logic.__context__.storage = AsyncStorage

describe('setAnonymousUser', () => {
    it('should set anonymous role on storage', async () => {
        await setAnonymousUser()

        const isAnonymous = await logic.__context__.storage.getItem('role')
        expect(isAnonymous).to.be.equal('anonymous')
    })



    it('should remove the role if passed a "false" argument', async () => {
        logic.__context__.storage.setItem('role', 'anonymous')

        await setAnonymousUser(false)

        const isAnonymous = !!await logic.__context__.storage.getItem('role')

        expect(isAnonymous).to.be.false
    })

    afterEach(async () => await logic.__context__.storage.clear())
})