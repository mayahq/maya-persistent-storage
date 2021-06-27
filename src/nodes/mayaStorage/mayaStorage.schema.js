const {
    Node,
    Schema,
    fields
} = require('@mayahq/module-sdk')

class MayaStorage extends Node {
    constructor(node, RED) {
        super(node, RED)
        // console.log(RED)
    }

    static schema = new Schema({
        name: 'maya-storage',
        label: 'maya-storage',
        category: 'Maya Persistent Storage',
        isConfig: false,
        color: '#CC94FF',
        icon: 'db.svg',
        fields: {
            level: new fields.Select({
                options: ['Node', 'Runtime', 'Global'], 
                defaultVal: 'Node'
            }),
            operation: new fields.Typed({ 
                type: 'str', 
                allowedTypes: ['msg', 'flow', 'global'], 
                displayName: 'operation (GET or SET)'
            }),
            query: new fields.Typed({
                type: 'json', 
                allowedTypes: ['msg', 'flow', 'global']
            })
        },

    })

    onInit() {
        // Do something on initialization of node
    }

    async onMessage(msg, vals) {
        if (msg.noop) {
            return
        }

        let storageClass = null
        console.log()

        switch (vals.level) {
            case 'Node': {
                storageClass = this.storage.node
                break
            }

            case 'Runtime': {
                storageClass = this.storage.runtime
                break
            }

            case 'Global': {
                storageClass = this.storage.global
                break
            }

            default: {
                console.log('Something really bad has happened')
                msg.error = true
                msg.errorMsg = `Got unrecognised storage level value: ${vals.level}`
                return msg
            }
        }

        if (vals.operation === 'GET') {
            const result = await storageClass.get(vals.query)
            msg.storageResult = result
            return msg
        } else if (vals.operation === 'SET') {
            await storageClass.set(vals.query)
            return msg
        }
    }
}

module.exports = MayaStorage