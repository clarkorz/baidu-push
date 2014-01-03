var should = require('should');

var userId = 'a userId';

var Push = require('../index');

var pushOption = {
  apiKey: 'your api key',
  secretKey: 'your secret key'
}

var client = new Push(pushOption);

testTag = {};
testTag.name = 'test-tag';

describe('test baidu push', function () {
  it('should push message success', function (done) {
    var option = {
      push_type: 1,
      user_id: userId,
      messages: ["hello"],
      msg_keys: ["title"]
    }

    client.pushMessage(option, function (error, result) {
      if (error) console.log(error);
      result.response_params.success_amount.should.equal(1);
      done();
    })
  })

  it('should push message success(old api should work)', function (done) {
    var option = {
      push_type: 1,
      user_id: userId,
      messages: JSON.stringify(["hello"]),
      msg_keys: JSON.stringify(["title"])
    }

    client.pushMessage(option, function (error, result) {
      if (error) console.log(error);
      result.response_params.success_amount.should.equal(1);
      done();
    })
  })

  it('should fetch all tags', function (done) {
    client.fetchTag({}, function (error, result) {
      if (error) console.log(error);
      result.response_params.total_num.should.above(-1);
      done();
    })
  })

  it('should set tag for user', function (done) {
    var option = {
      tag: testTag.name,
      user_id: userId
    }

    client.setTag(option, function (error, result) {
      if (error) console.log(error);
      result.request_id.should.above(0);
      done();
    })
  })

  it('should query user tag', function (done) {
    var option = {
      user_id: userId
    }

    client.queryTag(option, function (error, result) {
      if (error) console.log(error);

      result.response_params.tag_num.should.above(-1);
      var tags = result.response_params.tags;
      var flag = 0;
      tags.forEach(function (tag) {
        if (tag.name === testTag.name) {
          flag++;
        }
      })
      flag.should.equal(1);
      done();
    })
  })

  it('should fetch all tags', function (done) {
    var option = {};

    client.fetchTag(option, function (error, result) {
      if (error) console.log(error);

      result.response_params.total_num.should.above(0);
      var tags = result.response_params.tags;
      tags.forEach(function (tag) {
        if (tag.name === testTag.name) {
          testTag.tid = tag.tid;
        }
      })
      testTag.should.have.property('tid');
      done();
    })
  })

  it('should push message by tag', function (done) {
    var option = {
      push_type: 2,
      tag: testTag.name,
      messages: ["push by tag"],
      msg_keys: ["title"]
    }

    client.pushMessage(option, function (error, result) {
      if (error) console.log(error);
      result.response_params.success_amount.should.equal(1);
      done();
    })
  })

  it('should push message by tag(old api should work)', function (done) {
    var option = {
      push_type: 2,
      tag: testTag.name,
      messages: JSON.stringify(["push by tag"]),
      msg_keys: JSON.stringify(["title"])
    }

    client.pushMessage(option, function (error, result) {
      if (error) console.log(error);
      result.response_params.success_amount.should.equal(1);
      done();
    })
  })

  it('should delete user tag', function (done) {
    var option = {
      tag: testTag.name,
      user_id: userId
    }

    client.deleteTag(option, function (error, result) {
      if (error) console.log(error);
      result.request_id.should.above(0);
      done();
    })
  })


  it('should query user tag', function (done) {
    var option = {
      user_id: userId
    }

    client.queryTag(option, function (error, result) {
      if (error) console.log(error);

      result.response_params.tag_num.should.above(-1);
      var tags = result.response_params.tags;
      var flag = 0;
      tags.forEach(function (tag) {
        if (tag.name === testTag.name) {
          flag++;
        }
      })
      flag.should.equal(0);
      done();
    })
  })

  it('should delete app tag', function (done) {
    var option = {
      tag: testTag.name
    }

    client.deleteTag(option, function (error, result) {
      if (error) console.log(error);
      result.request_id.should.above(0);
      done();
    })
  })

  it('should fetch app tag', function (done) {
    var option = {};

    client.fetchTag(option, function (error, result) {
      if (error) console.log(error);

      result.response_params.total_num.should.above(-1);
      var tags = result.response_params.tags;
      var flag = 0;
      tags.forEach(function (tag) {
        if (tag.name === testTag.name) {
          flag++;
        }
      })
      flag.should.equal(0);
      done();
    })
  })

  it('should query bind list success', function () {
    var option = {
      user_id: userId
    }

    client.queryBindList(option, function (error, result) {
      if (error) console.log(error);
      result.request_id.should.above(0);
    })
  })
})
