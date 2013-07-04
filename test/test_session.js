var request = require('request'),
    u = require('util');

var host = 'http://localhost:3000';
//host = 'http://1dc27cbfdc6258c2e6fedff355ac6f2478acd3fa.cloud-services.appcelerator.com'; //dev

//using https throws error:  [Error: UNABLE_TO_VERIFY_LEAF_SIGNATURE]
host = 'http://0a2bb49c7166abd4c7ff64a2f8bbbe3ad1878770.cloudapp-enterprise.appcelerator.com'; //enterprise cluster
host = 'http://cd0b8d850902c93f14ac94e3897cb18cefa71279.cloudapp.appcelerator.com'; //community cluster



var authToken = null;
exports.testLogin = function(test) {

    request.post(host + '/login',
        {form:{user:'admin', password:'P@ss1234'},
            followAllRedirects:true},

        function(error, response, body) {
            console.log('error: ', error);


            try {
                if(response) {
                    console.log('response code: ', response.statusCode);
                    console.log('response header', response.headers);
                }

                console.log('response body', body);

                body = JSON.parse(body);
                authToken = body.sessionToken;

            } catch(E) {
                console.log(E);
            }
            test.expect(1);
            test.ok(true, "this assertion should pass");
            test.done();

        });

};



exports.testAccess = function(test) {
    request.get(host + '/access',
        {headers: {'x-session': authToken}},

        function(error, response, body) {
        console.log('error: ', error);
        if(response)
            console.log('response code: ', response.statusCode);
        console.log(body)

        test.done();
    })

};

