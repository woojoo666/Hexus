///// FULLTILT.DeviceMotion //////

FULLTILT.DeviceMotion = function (options) {

	this.options = options || {}; // placeholder object since no options are currently supported

};

FULLTILT.DeviceMotion.prototype = {

	constructor: FULLTILT.DeviceMotion,

	start: function ( callback ) {

		if ( callback && Object.prototype.toString.call( callback ) == '[object Function]' ) {

			sensors.motion.callbacks.push( callback );

		}

		if( !screenActive ) {

			if ( hasScreenOrientationAPI ) {

				window.screen.orientation.addEventListener( 'change', handleScreenOrientationChange, false );

			} else {

				window.addEventListener( 'orientationchange', handleScreenOrientationChange, false );

			}

		}

		if ( !sensors.motion.active ) {

			window.addEventListener( 'devicemotion', handleDeviceMotionChange, false );

			sensors.motion.active = true;

		}

	},

	stop: function () {

		if ( sensors.motion.active ) {

			window.removeEventListener( 'devicemotion', handleDeviceMotionChange, false );

			sensors.motion.active = false;

		}

	},

	listen: function( callback ) {

		this.start( callback );

	},

	getScreenAdjustedAcceleration: function () {

		var accData = sensors.motion.data && sensors.motion.data.acceleration ? sensors.motion.data.acceleration : { x: 0, y: 0, z: 0 };
		var screenAccData = {};

		switch ( screenOrientationAngle ) {
			case SCREEN_ROTATION_90:
				screenAccData.x = - accData.y;
				screenAccData.y =   accData.x;
				break;
			case SCREEN_ROTATION_180:
				screenAccData.x = - accData.x;
				screenAccData.y = - accData.y;
				break;
			case SCREEN_ROTATION_270:
			case SCREEN_ROTATION_MINUS_90:
				screenAccData.x =   accData.y;
				screenAccData.y = - accData.x;
				break;
			default: // SCREEN_ROTATION_0
				screenAccData.x =   accData.x;
				screenAccData.y =   accData.y;
				break;
		}

		screenAccData.z = accData.z;

		return screenAccData;

	},

	getScreenAdjustedAccelerationIncludingGravity: function () {

		var accGData = sensors.motion.data && sensors.motion.data.accelerationIncludingGravity ? sensors.motion.data.accelerationIncludingGravity : { x: 0, y: 0, z: 0 };
		var screenAccGData = {};

		switch ( screenOrientationAngle ) {
			case SCREEN_ROTATION_90:
				screenAccGData.x = - accGData.y;
				screenAccGData.y =   accGData.x;
				break;
			case SCREEN_ROTATION_180:
				screenAccGData.x = - accGData.x;
				screenAccGData.y = - accGData.y;
				break;
			case SCREEN_ROTATION_270:
			case SCREEN_ROTATION_MINUS_90:
				screenAccGData.x =   accGData.y;
				screenAccGData.y = - accGData.x;
				break;
			default: // SCREEN_ROTATION_0
				screenAccGData.x =   accGData.x;
				screenAccGData.y =   accGData.y;
				break;
		}

		screenAccGData.z = accGData.z;

		return screenAccGData;

	},

	getScreenAdjustedRotationRate: function () {

		var rotRateData = sensors.motion.data && sensors.motion.data.rotationRate ? sensors.motion.data.rotationRate : { alpha: 0, beta: 0, gamma: 0 };
		var screenRotRateData = {};

		switch ( screenOrientationAngle ) {
			case SCREEN_ROTATION_90:
				screenRotRateData.beta  = - rotRateData.gamma;
				screenRotRateData.gamma =   rotRateData.beta;
				break;
			case SCREEN_ROTATION_180:
				screenRotRateData.beta  = - rotRateData.beta;
				screenRotRateData.gamma = - rotRateData.gamma;
				break;
			case SCREEN_ROTATION_270:
			case SCREEN_ROTATION_MINUS_90:
				screenRotRateData.beta  =   rotRateData.gamma;
				screenRotRateData.gamma = - rotRateData.beta;
				break;
			default: // SCREEN_ROTATION_0
				screenRotRateData.beta  =   rotRateData.beta;
				screenRotRateData.gamma =   rotRateData.gamma;
				break;
		}

		screenRotRateData.alpha = rotRateData.alpha;

		return screenRotRateData;

	},

	getLastRawEventData: function () {

		return sensors.motion.data || {};

	},

	_accelerationXAvailable: false,
	_accelerationYAvailable: false,
	_accelerationZAvailable: false,

	_accelerationIncludingGravityXAvailable: false,
	_accelerationIncludingGravityYAvailable: false,
	_accelerationIncludingGravityZAvailable: false,

	_rotationRateAlphaAvailable: false,
	_rotationRateBetaAvailable: false,
	_rotationRateGammaAvailable: false,

	isAvailable: function(_valueType){

		switch(_valueType){
			case this.ACCELERATION_X:
				return this._accelerationXAvailable;

			case this.ACCELERATION_Y:
				return this._accelerationYAvailable;

			case this.ACCELERATION_Z:
				return this._accelerationZAvailable;

			case this.ACCELERATION_INCLUDING_GRAVITY_X:
				return this._accelerationIncludingGravityXAvailable;

			case this.ACCELERATION_INCLUDING_GRAVITY_Y:
				return this._accelerationIncludingGravityYAvailable;

			case this.ACCELERATION_INCLUDING_GRAVITY_Z:
				return this._accelerationIncludingGravityZAvailable;

			case this.ROTATION_RATE_ALPHA:
				return this._rotationRateAlphaAvailable;

			case this.ROTATION_RATE_BETA:
				return this._rotationRateBetaAvailable;

			case this.ROTATION_RATE_GAMMA:
				return this._rotationRateGammaAvailable;
		}
	},

	ACCELERATION_X: 'accelerationX',
	ACCELERATION_Y: 'accelerationY',
	ACCELERATION_Z: 'accelerationZ',

	ACCELERATION_INCLUDING_GRAVITY_X: 'accelerationIncludingGravityX',
	ACCELERATION_INCLUDING_GRAVITY_Y: 'accelerationIncludingGravityY',
	ACCELERATION_INCLUDING_GRAVITY_Z: 'accelerationIncludingGravityZ',

	ROTATION_RATE_ALPHA: 'rotationRateAlpha',
	ROTATION_RATE_BETA: 'rotationRateBeta',
	ROTATION_RATE_GAMMA: 'rotationRateGamma'

};