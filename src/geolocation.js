function Location(){

    if (navigator.geolocation) {
        function PositionError(code, message) {
            this.code = code;
            this.message = message;
        }

        PositionError.PERMISSION_DENIED = 1;
        PositionError.POSITION_UNAVAILABLE = 2;
        PositionError.TIMEOUT = 3;
        PositionError.prototype = new Error();

        navigator.geolocation._getCurrentPosition = navigator.geolocation.getCurrentPosition;

        navigator.geolocation.getCurrentPosition = function(success, failure, options) {
            var successHandler = function(position) {
                if ((position.coords.latitude == 0 && position.coords.longitude == 0) ||
                    (position.coords.latitude == 37.38600158691406 && position.coords.longitude == -122.08200073242188))
                    return failureHandler(new PositionError(PositionError.POSITION_UNAVAILABLE, 'Position unavailable'));

                failureHandler = function() {};
                success(position);
            }

            var failureHandler = function(error) {
                failureHandler = function() {};
                failure(error);
            }

            navigator.geolocation._getCurrentPosition(successHandler, failureHandler, options);

            window.setTimeout(function() { failureHandler(new PositionError(PositionError.TIMEOUT, 'Timed out')) }, 10000);
        }
    }
}
