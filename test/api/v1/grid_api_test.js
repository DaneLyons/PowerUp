var should = require('should'),
  request = require('request');

describe('GET /grids', function () {
  describe("when there are no grids", function () {
    it('should return an empty array', function () {
      request({
        uri: "http://localhost:3000/api/v1/grids",
        method: "GET",
        auth: {
          user: "51d5ecc4f5ecee743f000002",
          pass: "4ad210fe-e74c-494d-8773-329fa634308b"
        }
      }, function (err, res, body) {
        console.log(err);
        console.log(res);
        if (err) { throw err; }
        body.should.equal([]);
        body.length.should.equal(0);
      });
    });
  });
});
