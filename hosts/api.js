const Host = require('../hosts/schema')

module.exports = {

	create: function(host, callback) {
		let newHost = Host(host)
		this.save(newHost, (error, savedHost)=> {
			callback(error, savedHost)
		})
	},

	save: function(host, callback) {
		host.save((error, host)=> {
			callback(error, host)
		})
	},

	get: function(objectId, callback) {
		Host.findById(objectId, (error, host)=> {
			callback(error, host)
		})
	},

	getAll: function(callback) {
		Host.find((error, hosts)=> {
			callback(error, hosts)
		})
	},

	update: function(callback) {
		callback({error: "Method not implemented yet!"})
	},

	delete: function(objectId, callback) {
		this.get(objectId, (error, host)=> {
			if(error) callback(error)
			host.remove((error, host)=> {
				callback(error, host)
			})
		})
	}

}