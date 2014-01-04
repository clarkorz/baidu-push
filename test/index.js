var should = require('should')

var userId = 'a userId'
var pushOption = {
	apiKey: 'your api key',
	secretKey: 'your secret key'
}

var Push = require('../index')
var client = Push.createClient(pushOption)

testTag = {}
testTag.name = 'test-tag'

describe('base api', function () {
	it('should query bind list', function (done) {
		var option = {
			user_id: userId
		}

		client.queryBindList(option, function (error, result) {
			result.request_id.should.above(0)
			should.not.exist(error)
			should.exist(result.response_params)
			done()
		})
	})

	it('should push message', function (done) {
		var option = {
			push_type: 1,
			user_id: userId,
			messages: ["hello"],
			msg_keys: ["title"]
		}

		client.pushMsg(option, function (error, result) {
			should.not.exist(error)
			should.exist(result.response_params)
			result.response_params.success_amount.should.equal(1)
			done()
		})
	})
})

describe('advanced api', function () {
	it('should verify bind', function (done) {
		client.verifyBind({
			user_id: userId
		}, function (error, result) {
			should.not.exist(error)
			result.request_id.should.above(0)
			done()
		})
	})

	it('should fetch messages', function (done) {
		client.fetchMsg({
			user_id: userId
		}, function (error, result) {
			should.not.exist(error)
			should.exist(result.response_params)
			result.request_id.should.above(0)
			done()
		})
	})

	it('should fetch message count', function (done) {
		client.fetchMsgCount({
			user_id: userId
		}, function (error, result) {
			should.not.exist(error)
			should.exist(result.response_params)
			result.request_id.should.above(0)
			done()
		})
	})
})

describe('advanced api', function () {
	it('should fetch all tags', function (done) {
		client.fetchTag({}, function (error, result) {
			should.not.exist(error)
			result.response_params.total_num.should.above(-1)
			done()
		})
	})

	it('should set tag for user', function (done) {
		var option = {
			tag: testTag.name,
			user_id: userId
		}

	client.setTag(option, function (error, result) {
		if (error) console.log(error)
		result.request_id.should.above(0)
		done()
		})
	})

	it('should query user tag', function (done) {
		var option = {
			user_id: userId
		}

		client.queryUserTags(option, function (error, result) {
			should.not.exist(error)
			result.response_params.tag_num.should.above(-1)
			var tags = result.response_params.tags
			var flag = 0
			tags.forEach(function (tag) {
				if (tag.name === testTag.name) {
					flag++
				}
			})
			flag.should.equal(1)
			done()
		})
	})

	it('should fetch all tags', function (done) {
		client.fetchTag({}, function (error, result) {
			should.not.exist(error)
			result.response_params.total_num.should.above(0)
			var tags = result.response_params.tags
			tags.forEach(function (tag) {
				if (tag.name === testTag.name) {
					testTag.tid = tag.tid
				}
			})
			testTag.should.have.property('tid')
			done()
		})
	})

	it('should push message by tag', function (done) {
		client.pushMsg({
			push_type: 2,
			tag: testTag.name,
			messages: ["push by tag"],
			msg_keys: ["title"]
		}, function (error, result) {
			should.not.exist(error)
			result.response_params.success_amount.should.equal(1)
			done()
		})
	})

	it('should delete user tag', function (done) {
		client.deleteTag({
			tag: testTag.name,
			user_id: userId
		}, function (error, result) {
			should.not.exist(error)
			result.request_id.should.above(0)
			done()
		})
	})

	it('should query user tag', function (done) {
		client.queryUserTags({
			user_id: userId
		}, function (error, result) {
			should.not.exist(error)
			result.response_params.tag_num.should.above(-1)
			var tags = result.response_params.tags
			var flag = 0
			tags.forEach(function (tag) {
			if (tag.name === testTag.name) {
					flag++
				}
			})
			flag.should.equal(0)
			done()
		})
	})

	it('should delete app tag', function (done) {
		client.deleteTag({
			tag: testTag.name
		}, function (error, result) {
			should.not.exist(error)
			result.request_id.should.above(0)
			done()
		})
	})

	it('should fetch app tag', function (done) {
		client.fetchTag({}, function (error, result) {
			should.not.exist(error)
			result.response_params.total_num.should.above(-1)
			var tags = result.response_params.tags
			var flag = 0
			tags.forEach(function (tag) {
				if (tag.name === testTag.name) {
					flag++
				}
			})
			flag.should.equal(0)
			done()
		})
	})
})
