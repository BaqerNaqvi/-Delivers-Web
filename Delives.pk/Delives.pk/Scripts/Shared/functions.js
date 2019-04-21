//#region storageConfig
let storageConfig = {
    storageAvailable: function (type) {
        var storage;
        try {
            storage = window[type];
            var x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        }
        catch (e) {
            return e instanceof DOMException && (
                // everything except Firefox
                e.code === 22 ||
                // Firefox
                e.code === 1014 ||
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === 'QuotaExceededError' ||
                // Firefox
                e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
                // acknowledge QuotaExceededError only if there's something already stored
                (storage && storage.length !== 0);
        }
    },
    storageForBrowserCompatibility: function () {
        {
            Object.defineProperty(window, "localStorage", new (function () {
                var aKeys = [], oStorage = {};
                Object.defineProperty(oStorage, "getItem", {
                    value: function (sKey) { return this[sKey] ? this[sKey] : null; },
                    writable: false,
                    configurable: false,
                    enumerable: false
                });
                Object.defineProperty(oStorage, "key", {
                    value: function (nKeyId) { return aKeys[nKeyId]; },
                    writable: false,
                    configurable: false,
                    enumerable: false
                });
                Object.defineProperty(oStorage, "setItem", {
                    value: function (sKey, sValue) {
                        if (!sKey) { return; }
                        document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
                    },
                    writable: false,
                    configurable: false,
                    enumerable: false
                });
                Object.defineProperty(oStorage, "length", {
                    get: function () { return aKeys.length; },
                    configurable: false,
                    enumerable: false
                });
                Object.defineProperty(oStorage, "removeItem", {
                    value: function (sKey) {
                        if (!sKey) { return; }
                        document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
                    },
                    writable: false,
                    configurable: false,
                    enumerable: false
                });
                Object.defineProperty(oStorage, "clear", {
                    value: function () {
                        if (!aKeys.length) { return; }
                        for (var sKey in oStorage) {
                            document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
                        }
                    },
                    writable: false,
                    configurable: false,
                    enumerable: false
                });
                this.get = function () {
                    var iThisIndx;
                    for (var sKey in oStorage) {
                        iThisIndx = aKeys.indexOf(sKey);
                        if (iThisIndx === -1) { oStorage.setItem(sKey, oStorage[sKey]); }
                        else { aKeys.splice(iThisIndx, 1); }
                        delete oStorage[sKey];
                    }
                    for (aKeys; aKeys.length > 0; aKeys.splice(0, 1)) { oStorage.removeItem(aKeys[0]); }
                    for (var aCouple, iKey, nIdx = 0, aCouples = document.cookie.split(/\s*;\s*/); nIdx < aCouples.length; nIdx++) {
                        aCouple = aCouples[nIdx].split(/\s*=\s*/);
                        if (aCouple.length > 1) {
                            oStorage[iKey = unescape(aCouple[0])] = unescape(aCouple[1]);
                            aKeys.push(iKey);
                        }
                    }
                    return oStorage;
                };
                this.configurable = false;
                this.enumerable = true;
            })());
        }
    },
    initalizeStorage: function () {
        if (!storageConfig.storageAvailable('localStorage')) {
            storageConfig.storageForBrowserCompatibility();
        }
    }
};
//#endregion storageConfig
//#region LocationConfig
let locationConfig = {
    defaultLatitude: 32.1611321,
    defaultLongitude: 74.1765673,
    defaultCoords: "32.1611321_74.1765673",
    currentPosition: null,
    latitude: null,
    longitude: null,
    coords: null,
    isGeoLocationSupported: false,
    errorCode: null,
    geoLocationOptions: {
        maximumAge: 5 * 60 * 1000, //tell the browser to use a recently obtained geolocation result
        timeout: 10 * 1000,  //Unless you set a timeout, your request for the current position might never return.
        enableHighAccuracy: true //Prefer a coarse location over a fine-grained location
    },
    geoLocationSuccess: function (position) {
        locationConfig.currentPosition = position;
        locationConfig.latitude = locationConfig.currentPosition.coords.latitude;
        locationConfig.longitude = locationConfig.currentPosition.coords.longitude;
        locationConfig.coords = locationConfig.latitude + "_" + locationConfig.longitude;
        locationConfig.saveToLocalStorage(locationConfig.coords);
        console.log(position);
        return locationConfig.coords;
    },
    geoLocationError: function (error) {
        locationConfig.errorCode = error.code;
        console.log('Error occurred. Error code: ' + error.code);
        // error.code can be:
        //   0: unknown error
        //   1: permission denied
        //   2: position unavailable (error response from location provider)
        //   3: timed out
    },
    getGeoLocation: function (successCallBack = locationConfig.geoLocationSuccess, errorCallBack = locationConfig.geoLocationError, options = locationConfig.geoLocationOptions) {
        navigator.geolocation.getCurrentPosition(successCallBack, errorCallBack, options);
    },
    checkGeoLocationSupported: function () {
        if (navigator.geolocation) {
            console.log('Geolocation is supported!');
            locationConfig.isGeoLocationSupported = true;
            //navigator.geolocation.getCurrentPosition(showPosition);
            return true;
        } else {
            console.log('Geolocation is not supported for this Browser/OS.');
            locationConfig.isGeoLocationSupported = false;
            return false;
            //x.innerHTML = "Geolocation is not supported by this browser.";
        }
    },
    saveToLocalStorage: function (coords) {
        if (storageConfig.storageAvailable('localStorage')) {
            localStorage.setItem("coords", coords);
        }
        else {
            console.log("Browser does not support local storage");
        }
    },
    getCoords: function () {
        if (storageConfig.storageAvailable('localStorage')) {
            var coords = localStorage.getItem("coords");
            if (coords === null && locationConfig.errorCode === null && locationConfig.isGeoLocationSupported) {
                locationConfig.getGeoLocation();
                return locationConfig.defaultCoords;
            }
            else {
                return coords;
            }
        }
        else if (locationConfig.coords !== null) {
            return locationConfig.coords;
        }
        else {
            console.log("Browser does not support local storage");
            return locationConfig.defaultCoords;
        }
    }
};
//#endregion LocationConfig

//#region userConfig
let userConfig = {
    emptyGuid: "00000000-0000-0000-0000-000000000000",
    errorMessage: "Something went wrong",
    successMessage: "Operation Successful",
    totalItems: 10,
    jqXHR: null,
    UserModel: {},
    registerUser: function (user) {
        userConfig.UserModel = {};
        this.jqXHR = $.ajax({
            method: "POST",
            url: "/Account/Register",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ model: user })
        }).done(function (response) {
            if (response.Success) {
                userConfig.UserModel = response.Object;
                userConfig.openPhoneVerificationModal();
                //open modal to verify 4 digit code
                console.log(response.Message);
            }
            else {
                console.log(response.Message);
            }
            //alert("success");
        }).fail(function (jqXHR, textStatus, errorThrown) {
            //alert("error");
            console.log(errorThrown);
        }).always(function () {
            //alert("complete");
        });
    },
    verifyPhoneNumber: function (model) {
        this.jqXHR = $.ajax({
            method: "POST",
            url: "/Account/VerifyPhoneNumber",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ model: model })
        }).done(function (response) {
            if (response.Success) {
                window.location.href = "/Delivery/Index";
                //open modal to verify 4 digit code
                console.log(response.Message);
            }
            else {
                console.log(response.Message);
            }
            //alert("success");
        }).fail(function (jqXHR, textStatus, errorThrown) {
            //alert("error");
            console.log(errorThrown);
        }).always(function () {
            //alert("complete");
        });
    },
    loginUser: function (model) {
        this.jqXHR = $.ajax({
            method: "POST",
            url: "/Account/Login",
            dataType: "json",
            data: { model: model, "__RequestVerificationToken": $('input[name=__RequestVerificationToken]').val() }
        }).done(function (response) {
            if (response.Success) {
                window.location.href = "/Delivery/Index";
                //open modal to verify 4 digit code
                console.log(response.Message);
            }
            else {
                console.log(response.Message);
            }
            //alert("success");
        }).fail(function (jqXHR, textStatus, errorThrown) {
            //alert("error");
            console.log(errorThrown);
        }).always(function () {
            //alert("complete");
        });
    },
    validateForms: function () {
        $.validator.addMethod("passwordRegex", function (value, element) {
            return this.optional(element) || /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/i.test(value);
        }, "Passwords are 8-20 characters with uppercase letters, lowercase letters and at least one number.");
        userConfig.validateRegisterationForm();
        userConfig.validatePhoneVerificationForm();
        userConfig.validateLoginForm();
    },
    validateRegisterationForm: function () {
        $("#myRegister").validate({
            rules: {
                name: {
                    required: {
                        depends: function () {
                            $(this).val($.trim($(this).val()));
                            return true;
                        }
                    },
                    maxlength: 20,
                    //normalizer: function (value) {
                    //    return $.trim(value);

                    //}
                },
                lastName: {
                    required: {
                        depends: function () {
                            $(this).val($.trim($(this).val()));
                            return true;
                        }
                    },
                    maxlength: 20
                },
                phoneNumber: {
                    required: {
                        depends: function () {
                            $(this).val($.trim($(this).val()));
                            return true;
                        }
                    },
                    digits: true,
                    minlength: 11,
                    maxlength: 11
                },
                password: {
                    required: true,
                    minlength: 8,
                    maxlength: 20,
                    passwordRegex: true

                },
                confirmPassword: {
                    equalTo: "#password",
                    minlength: 8,
                    maxlength: 20,
                },
                agreement: {
                    required: true
                }

            },
            errorPlacement: function (error, element) {
                if (element.attr("type") === "checkbox") {
                    $(element).next('label').append(error);
                } else {
                    $(element).after(error);
                }
            },
            messages: {
                agreement: {
                    required: "(Required)"
                },
            },
            submitHandler: function (form) {
                console.log("Register user");
                var user = {
                    UserName: $('#phoneNumber').val(),
                    Email: "production",
                    FirstName: $('#name').val(),
                    LastName: $('#lastName').val(),
                    PhoneNumber: $('#phoneNumber').val(),
                    Password: $('#password').val(),
                    Type: 1
                };
                userConfig.registerUser(user);
                // do other things for a valid form
                //form.submit();
            }
        });
    },
    validatePhoneVerificationForm: function () {
        $("#phoneVerificationForm").validate({
            rules: {
                code: {
                    required: {
                        depends: function () {
                            $(this).val($.trim($(this).val()));
                            return true;
                        }
                    },
                    digits: true,
                    minlength: 6,
                    maxlength: 6
                }
            },
            submitHandler: function (form) {
                var model = {
                    UserId: userConfig.UserModel.UserId ,
                    Code: $('#code').val()
                };
                console.log("Verify phone number");
                userConfig.verifyPhoneNumber(model);
                // do other things for a valid form
                //form.submit();
            }
        });
    },
    validateLoginForm: function () {
        $("#myLogin").validate({
            rules: {
                userName: {
                    required: {
                        depends: function () {
                            $(this).val($.trim($(this).val()));
                            return true;
                        }
                    },
                    maxlength: 20
                },
                password: {
                    required: true,
                    minlength: 8,
                    maxlength: 20,
                    passwordRegex: true

                }

            },
            submitHandler: function (form) {
                console.log("Login user");
                var model = {
                    UserName: $('#userName').val(),
                    Password: $('#password').val(),
                    Type: 1
                };
                userConfig.loginUser(model);
                // do other things for a valid form
                //form.submit();
            }
        });
    },
    openPhoneVerificationModal: function () {
        $('.close-link').trigger('click');
        $('.openPhoneVerificationModal').trigger('click');
    }
};
//#endregion userConfig

//#region DocumentReady
$(() => {
    storageConfig.initalizeStorage();
    if (locationConfig.checkGeoLocationSupported()) {
        locationConfig.getGeoLocation();
    }
    userConfig.validateForms();
});
//#endregion DocumentReady

