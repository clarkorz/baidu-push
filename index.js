var util        = require('util')
var crypto      = require('crypto')
var http        = require('http')
var querystring = require('querystring')

var PROTOCOL_SCHEMA = 'http://'
var SERVER_HOST     = 'channel.api.duapp.com'
var COMMON_PATH     = '/rest/2.0/channel/'

function urlencode(string) {
	string = (string + '').toString()
	return encodeURIComponent(string)
					.replace(/!/g, '%21')
					.replace(/'/g, '%27')
					.replace(/\(/g, '%28')
					.replace(/\)/g, '%29')
					.replace(/\*/g, '%2A')
					.replace(/%20/g, '+')
}

function getTimestamp() {
	var timestamp = Math.floor(new Date().getTime() / 1000)
	return timestamp
}

function sortObject(originObject) {
	var index = []
	var tempObject = {}
	for (var i in originObject) {
		if (originObject.hasOwnProperty(i)) {
			index.push(i)
		}
	}

	index.sort()

	for(i = 0; i < index.length; i++) {
		tempObject[index[i]] = originObject[index[i]]
	}
	return tempObject
}

function generateSign(method, url, params, secretKey) {
	var baseString = method + url

	for (var i in params) {
		baseString += (i + '=' + params[i])
	}

	baseString += secretKey
	var encodeString = urlencode(baseString)
	var md5sum = crypto.createHash('md5')
	md5sum.update(encodeString)

	var sign = md5sum.digest('hex')
	return sign
}

function request(bodyArgs, path, secretKey, id, host, callback) {
	callback = callback || function () {}
	bodyArgs.sign = generateSign('POST', PROTOCOL_SCHEMA + host + path, bodyArgs, secretKey)

	var bodyArgsArray = []
	for (var i in bodyArgs) {
		if (bodyArgs.hasOwnProperty(i)) {
			bodyArgsArray.push(i + '=' + urlencode(bodyArgs[i]))
		}
	}

	var bodyString = bodyArgsArray.join('&')
	var options = {
		host: host,
		method: 'POST',
		path: path,
		headers: {
			'Content-Length': bodyString.length,
			'Content-Type':	 'application/x-www-form-urlencoded'
		}
	}

	var req = http.request(options, function (res) {
		var resBody = ''
		res.on('data', function (chunk) {
			resBody += chunk
		})

		res.on('end', function () {
      // fix user_id too precision than ECMA5 Javascript defination
      resBody = resBody.replace(new RegExp(':' + bodyArgs.user_id + '(?!")', 'g'), ':"' + bodyArgs.user_id + '"');

			try {
				var jsonObj = JSON.parse(resBody)
			} catch (e) {
				return callback(e)
			}
			var errObj = null
			id.request_id = jsonObj['request_id']
			if (res.statusCode !== 200) {
				errObj = new Error(jsonObj['error_msg']);
        errObj.error_msg = jsonObj['error_msg'];
        errObj.error_code = jsonObj['error_code'];
			}
			callback(errObj, jsonObj)
		})
	})

	req.on('error', function (e) {
		callback(e, null)
	})
	req.write(bodyString)
	req.end()
}

/*
* Push
*/
function Push(options) {
	options      = options || {}
	options.host = options.host || SERVER_HOST
	var self     = this

	self.apiKey     = options.apiKey
	self.secretKey  = options.secretKey
	self.host       = options.host
	self.request_id = null
}

/*
* 基础 api
*/
Push.prototype.queryBindList = function (options, callback) {
	options  = options || {}
	callback = callback || function () {}
	var path = COMMON_PATH + (options['channel_id'] || 'channel')
	var self = this

	options['method']    = 'query_bindlist'
	options['apikey']    = self.apiKey
	options['timestamp'] = getTimestamp()
	options              = sortObject(options)

	var wrap_id = { request_id: null }
	request(options, path, self.secretKey, wrap_id, self.host, function (error, result) {
		self.request_id = wrap_id.request_id
		callback(error, result)
	})
}

Push.prototype.pushMsg = function (options, callback) {
	options  = options || {}
	callback = callback || function () {}
	var path = COMMON_PATH + 'channel'
	var self = this

	options['method']    = 'push_msg'
	options['apikey']    = self.apiKey
	options.messages     = JSON.stringify(options.messages)
	options.msg_keys     = JSON.stringify(options.msg_keys)
	options['timestamp'] = getTimestamp()
	options              = sortObject(options)

	var wrap_id = { request_id: null }
	request(options, path, self.secretKey, wrap_id, self.host, function (error, result) {
		self.request_id = wrap_id.request_id
		callback(error, result)
	})
}

/*
* 高级 api
*/
Push.prototype.verifyBind = function (options, callback) {
	options  = options || {}
	callback = callback || function () {}
	var path = COMMON_PATH + (options['channel_id'] || 'channel')
	var self = this

	options['method']    = 'verify_bind'
	options['apikey']    = self.apiKey
	options['timestamp'] = getTimestamp()
	options              = sortObject(options)

	var wrap_id = { request_id: null }
	request(options, path, self.secretKey, wrap_id, self.host, function (error, result) {
		self.request_id = wrap_id.request_id
		callback(error, result)
	})
}

Push.prototype.fetchMsg = function (options, callback) {
	options  = options || {}
	callback = callback || function () {}
	var path = COMMON_PATH + (options['channel_id'] || 'channel')
	var self = this

	options['method']    = 'fetch_msg'
	options['apikey']    = self.apiKey
	options['timestamp'] = getTimestamp()
	options              = sortObject(options)

	var wrap_id = { request_id: null }
	request(options, path, self.secretKey, wrap_id, self.host, function (error, result) {
		self.request_id = wrap_id.request_id
		callback(error, result)
	})
}

Push.prototype.fetchMsgCount = function (options, callback) {
	options  = options || {}
	callback = callback || function () {}
	var path = COMMON_PATH + (options['channel_id'] || 'channel')
	var self = this

	options['method']    = 'fetch_msgcount'
	options['apikey']    = self.apiKey
	options['timestamp'] = getTimestamp()
	options              = sortObject(options)

	var wrap_id = { request_id: null }
	request(options, path, self.secretKey, wrap_id, self.host, function (error, result) {
		self.request_id = wrap_id.request_id
		callback(error, result)
	})
}

Push.prototype.deleteMsg = function (options, callback) {
	options  = options || {}
	callback = callback || function () {}
	var path = COMMON_PATH + (options['channel_id'] || 'channel')
	var self = this

	options['method']    = 'delete_msg'
	options['apikey']    = self.apiKey
	options.msg_ids      = JSON.stringify(options.msg_ids)
	options['timestamp'] = getTimestamp()
	options              = sortObject(options)

	var wrap_id = { request_id: null }
	request(options, path, self.secretKey, wrap_id, self.host, function (error, result) {
		self.request_id = wrap_id.request_id
		callback(error, result)
	})
}

Push.prototype.setTag = function (options, callback) {
	options  = options || {}
	callback = callback || function () {}
	var path = COMMON_PATH + 'channel'
	var self = this

	options['method']    = 'set_tag'
	options['apikey']    = self.apiKey
	options['timestamp'] = getTimestamp()
	options              = sortObject(options)

	var wrap_id = { request_id: null }
	request(options, path, self.secretKey, wrap_id, self.host, function (error, result) {
		self.request_id = wrap_id.request_id
		callback(error, result)
	})
}

Push.prototype.fetchTag = function (options, callback) {
	options  = options || {}
	callback = callback || function () {}
	var path = COMMON_PATH + 'channel'
	var self = this

	options['method']    = 'fetch_tag'
	options['apikey']    = self.apiKey
	options['timestamp'] = getTimestamp()
	options              = sortObject(options)

	var wrap_id = { request_id: null }
	request(options, path, self.secretKey, wrap_id, self.host, function (error, result) {
		self.request_id = wrap_id.request_id
		callback(error, result)
	})
}

Push.prototype.deleteTag = function (options, callback) {
	options  = options || {}
	callback = callback || function () {}
	var path = COMMON_PATH + 'channel'
	var self = this

	options['method']    = 'delete_tag'
	options['apikey']    = self.apiKey
	options['timestamp'] = getTimestamp()
	options              = sortObject(options)

	var wrap_id = { request_id: null }
	request(options, path, self.secretKey, wrap_id, self.host, function (error, result) {
		self.request_id = wrap_id.request_id
		callback(error, result)
	})
}

Push.prototype.queryUserTags = function (options, callback) {
	options  = options || {}
	callback = callback || function () {}
	var path = COMMON_PATH + 'channel'
	var self = this

	options['method']    = 'query_user_tags'
	options['apikey']    = self.apiKey
	options['timestamp'] = getTimestamp()
	options              = sortObject(options)

	var wrap_id = { request_id: null }
	request(options, path, self.secretKey, wrap_id, self.host, function (error, result) {
		self.request_id = wrap_id.request_id
		callback(error, result)
	})
}

Push.prototype.queryDeviceType = function (options, callback) {
	options  = options || {}
	callback = callback || function () {}
	var path = COMMON_PATH + (options['channel_id'] || 'channel')
	var self = this

	options['method']    = 'query_device_type'
	options['apikey']    = self.apiKey
	options['timestamp'] = getTimestamp()
	options              = sortObject(options)

	var wrap_id = { request_id: null }
	request(options, path, self.secretKey, wrap_id, self.host, function (error, result) {
		self.request_id = wrap_id.request_id
		callback(error, result)
	})
}

/*
* exports
*/
exports.createClient = function (options) {
	return new Push(options)
}
