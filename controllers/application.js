var types = require('../lib/types'),
    authentication = require('../lib/authentication');


function index(req, res) {
	res.render('index', { title: 'Welcome to Node.ACS!' });
}



function login(req, res, next) {

    if (!req.body.user) { throw new types.InvalidRequestError("Missing required parameter: user"); }
    if (!req.body.password) { throw new types.InvalidRequestError("Missing required parameter: password"); }

    authentication.crmOnlineLogin(new types.CrmConnection(req.body))
        .then(function handleLoginResponse(response) {

            var sessionToken = authentication.serializeAuthToken(response.token);
            res.setHeader('x-session', sessionToken)
            res.json({
                sessionToken: sessionToken,
                sessionExpires: response.expires
            });
        })
        .fail(function (err) {

            if (err instanceof types.ServiceError) {
                next(err);
            }
            else {
                next(new types.AuthenticationError(err));
            }
        });


}


function access(req, res) {

    console.log('request.headers', req.headers);

    res.json({headers:req.headers});
}