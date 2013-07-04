module.exports = (function defineTypes() {

    var AuthenticationError,
        InvalidSessionError,
        InvalidApplicationError,
        InvalidRequestError;

    // Ensure that error details are stringified.
    function stringifyDetails(details) {
        if (details && typeof details !== 'string' && details.toString) {
            details = details.toString();
        }

        return details;
    }

    function ServiceError(details) {
        // TODO: could pass back the stack trace as well with error.stack

        // Default error code to 10,000: this represents an unknown/unexpected error
        this.errorCode = 10000;
        this.message = "An unexpected error has occurred.";
        this.details = stringifyDetails(details);
    }

    /* Expose the stringify details function. This is exposed as such to ensure
     it is accessible from the ServiceError constructor as well. */
    ServiceError.prototype.stringifyDetails = stringifyDetails;

    // This function serves as an overridable read-only property to return the appropriate status code
    ServiceError.prototype.getStatusCode = function getStatusCode() {
        return 400;
    };

    // Creates a new child of ServiceError using a form of prototypical inheritance.
    ServiceError.subClass = function subClass(errorCode, message, statusCode) {
        // Define the object's constructor
        var obj = function (details) {
            ServiceError.call(this, details);
            this.message = message;
            this.errorCode = errorCode;
        };

        // Set it's prototype to our 'base class'
        obj.prototype = new ServiceError();

        //If status code is provided, override our base implmentation to return the correct status
        if (statusCode) {
            obj.prototype.getStatusCode = function getStatusCode() { return statusCode; };
        }

        return obj;
    };

    // Define custom error types
    AuthenticationError     = ServiceError.subClass(10001, "Invalid username or password.", 401),
        InvalidSessionError     = ServiceError.subClass(10002, "Session is either missing or no longer valid.", 401),
        InvalidApplicationError = ServiceError.subClass(10003, "The specified application id does not exist."),
        InvalidRequestError     = ServiceError.subClass(10004, "The request format is not correct.");

    // Parses request body into a connection object for login
    function CrmConnection(requestBody) {
        this.user = requestBody.user;
        this.password = requestBody.password;
    }

    return {
        ServiceError: ServiceError,
        AuthenticationError: AuthenticationError,
        InvalidSessionError: InvalidSessionError,
        InvalidApplicationError: InvalidApplicationError,
        InvalidRequestError: InvalidRequestError,
        CrmConnection: CrmConnection
    };
}());