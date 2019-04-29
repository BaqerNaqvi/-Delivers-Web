//#region storageConfig
let uiConfig = {
    showProgress: function () {
        $('#status').show(); // will first fade out the loading animation
        $('#preloader').show(); // will fade out the white DIV that covers the website.
    },
    hideProgress: function () {
        $('#status').fadeOut(); // will first fade out the loading animation
        $('#preloader').delay(250).fadeOut('slow'); // will fade out the white DIV that covers the website.
    }
};
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
        try {
            //navigator.geolocation.getCurrentPosition(successCallBack, errorCallBack, options);
        }
        catch (ex) {
            //
        }
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
        uiConfig.showProgress();
        userConfig.UserModel = {};
        this.jqXHR = $.ajax({
            method: "POST",
            url: "/Account/Register",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ model: user })
        }).done(function (response) {
            if (response.Success) {
                localStorage.setItem("UserModel", JSON.stringify(response.Object));
                userConfig.openPhoneVerificationModal();
                //open modal to verify 4 digit code
                toastr.success(response.Message);
            }
            else {
                toastr.error(response.Message);
            }
            //alert("success");
        }).fail(function (jqXHR, textStatus, errorThrown) {
            //alert("error");
            toastr.error(errorThrown);
        }).always(function () {
            //alert("complete");
            uiConfig.hideProgress();
        });
    },
    verifyPhoneNumber: function (model) {
        uiConfig.showProgress();
        this.jqXHR = $.ajax({
            method: "POST",
            url: "/Account/VerifyPhoneNumber",
            dataType: "json",
            data: { model: model, "__RequestVerificationToken": $('#phoneVerificationForm input[name=__RequestVerificationToken]').val() }
        }).done(function (response) {
            if (response.Success) {
                toastr.success(response.Message);
                //location.reload(true);
                window.location.href = "/Delivery/Index";
                //open modal to verify 4 digit code
            }
            else {
                toastr.error(response.Message);
            }
            //alert("success");
        }).fail(function (jqXHR, textStatus, errorThrown) {
            //alert("error");
            toastr.error(errorThrown);
        }).always(function () {
            //alert("complete");
            uiConfig.hideProgress();
        });
    },
    loginUser: function (model) {
        debugger;
        uiConfig.showProgress();
        this.jqXHR = $.ajax({
            method: "POST",
            url: "/Account/Login",
            dataType: "json",
            data: { model: model, "__RequestVerificationToken": $('#myLogin input[name=__RequestVerificationToken]').val() }
        }).done(function (response) {
            if (response.Success) {
                toastr.success(response.Message);
                if (response.Status === 1) {
                    localStorage.setItem("UserModel", JSON.stringify(response.Object));
                    location.reload(true);
                }
                else if (response.Status === 2) {
                    localStorage.setItem("UserModel", JSON.stringify(response.Object));
                    userConfig.openPhoneVerificationModal();
                }
                //window.location.href = "/Delivery/Index";
                //open modal to verify 4 digit code
            }
            else {
                toastr.error(response.Message);
            }
            //alert("success");
        }).fail(function (jqXHR, textStatus, errorThrown) {
            //alert("error");
            toastr.error(errorThrown);
        }).always(function () {
            //alert("complete");
            uiConfig.hideProgress();
        });
    },
    forgotPassword: function (model) {
        uiConfig.showProgress();
        this.jqXHR = $.ajax({
            method: "POST",
            url: "/Account/ForgotPassword",
            dataType: "json",
            data: { model: model, "__RequestVerificationToken": $('#forgotPasswordForm input[name=__RequestVerificationToken]').val() }
        }).done(function (response) {
            if (response.Success) {
                toastr.success(response.Message);
                localStorage.setItem("UserModel", JSON.stringify(response.Object));
                userConfig.openPasswordResetModal();
                //window.location.href = "/Delivery/Index";
                //open modal to verify 4 digit code
            }
            else {
                toastr.error(response.Message);
            }
            //alert("success");
        }).fail(function (jqXHR, textStatus, errorThrown) {
            //alert("error");
            toastr.error(errorThrown);
        }).always(function () {
            //alert("complete");
            uiConfig.hideProgress();
        });
    },
    resetPassword: function (model) {
        uiConfig.showProgress();
        this.jqXHR = $.ajax({
            method: "POST",
            url: "/Account/ResetPassword",
            dataType: "json",
            data: { model: model, "__RequestVerificationToken": $('#passwordResetForm input[name=__RequestVerificationToken]').val() }
        }).done(function (response) {
            if (response.Success) {
                toastr.success(response.Message);
                localStorage.setItem("UserModel", JSON.stringify(response.Object));
                location.reload(true);
            }
            else {
                toastr.error(response.Message);
            }
            //alert("success");
        }).fail(function (jqXHR, textStatus, errorThrown) {
            //alert("error");
            toastr.error(errorThrown);
        }).always(function () {
            //alert("complete");
            uiConfig.hideProgress();
        });
    },
    resendCode: function (model) {
        model = {
            PhoneNumber: JSON.parse(localStorage.getItem("UserModel")).PhoneNumber
        };
        uiConfig.showProgress();
        this.jqXHR = $.ajax({
            method: "POST",
            url: "/Account/ResendCode",
            dataType: "json",
            data: { model: model, "__RequestVerificationToken": $('#phoneVerificationForm input[name=__RequestVerificationToken]').val() }
        }).done(function (response) {
            if (response.Success) {
                toastr.success(response.Message);
                //localStorage.setItem("UserModel", JSON.stringify(response.Object));
                //location.reload(true);
            }
            else {
                toastr.error(response.Message);
            }
            //alert("success");
        }).fail(function (jqXHR, textStatus, errorThrown) {
            //alert("error");
            toastr.error(errorThrown);
        }).always(function () {
            //alert("complete");
            uiConfig.hideProgress();
        });
    },
    validateForms: function () {
        $.validator.addMethod("passwordRegex", function (value, element) {
            return this.optional(element) || /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/i.test(value);
        }, "Passwords are 8-20 characters with uppercase letters, lowercase letters and at least one number.");
        userConfig.validateRegisterationForm();
        userConfig.validatePhoneVerificationForm();
        userConfig.validateLoginForm();
        userConfig.validateForgotPasswordForm();
        userConfig.validatePasswordResetForm();
    },
    validateRegisterationForm: function () {
        $("#registrationForm").validate({
            rules: {
                FirstName: {
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
                LastName: {
                    required: {
                        depends: function () {
                            $(this).val($.trim($(this).val()));
                            return true;
                        }
                    },
                    maxlength: 20
                },
                PhoneNumber: {
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
                Password: {
                    required: true,
                    minlength: 8,
                    maxlength: 20,
                    passwordRegex: true

                },
                ConfirmPassword: {
                    equalTo: "#Password",
                    minlength: 8,
                    maxlength: 20,
                },
                //agreement: {
                //    required: true
                //}

            },
            errorPlacement: function (error, element) {
                if (element.attr("type") === "checkbox") {
                    $(element).next('label').append(error);
                } else {
                    $(element).after(error);
                }
            },
            messages: {
                //agreement: {
                //    required: "(Required)"
                //},
            },
            submitHandler: function (form) {
                console.log("Register user");
                var user = {
                    UserName: $('#PhoneNumber').val(),
                    Email: "production",
                    FirstName: $('#FirstName').val(),
                    LastName: $('#LastName').val(),
                    PhoneNumber: $('#PhoneNumber').val(),
                    Password: $('#Password').val(),
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
                try {
                    var model = {
                        UserId: JSON.parse(localStorage.getItem("UserModel")).UserId,
                        Code: $('#code').val()
                    };
                    console.log("Verify phone number");
                    userConfig.verifyPhoneNumber(model);
                }
                catch (ex) {
                    toastr.error("Invalid user");
                }
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
                loginPassword: {
                    required: true,
                    minlength: 8,
                    maxlength: 20,
                    passwordRegex: true

                }

            },
            submitHandler: function (form) {
                console.log("Login user");
                var model = {
                    PhoneNumber: $('#userName').val(),
                    Password: $('#loginPassword').val(),
                    Type: 1
                };
                userConfig.loginUser(model);
                // do other things for a valid form
                //form.submit();
            }
        });
    },
    validateForgotPasswordForm: function () {
        $("#forgotPasswordForm").validate({
            rules: {
                forgotPasswordPhoneNumber: {
                    required: {
                        depends: function () {
                            $(this).val($.trim($(this).val()));
                            return true;
                        }
                    },
                    minlength: 11,
                    maxlength: 11
                }

            },
            submitHandler: function (form) {
                console.log("Forgot Password");
                var model = {
                    PhoneNumber: $('#forgotPasswordPhoneNumber').val()
                };
                userConfig.forgotPassword(model);
                // do other things for a valid form
                //form.submit();
            }
        });
    },
    validatePasswordResetForm: function () {
        $("#passwordResetForm").validate({
            rules: {
                passwordResetCode: {
                    required: {
                        depends: function () {
                            $(this).val($.trim($(this).val()));
                            return true;
                        }
                    },
                    digits: true,
                    minlength: 6,
                    maxlength: 6
                },
                passwordResetNewPassword: {
                    required: true,
                    minlength: 8,
                    maxlength: 20,
                    passwordRegex: true

                },
                passwordResetConfirmPassword: {
                    equalTo: "#passwordResetNewPassword",
                    minlength: 8,
                    maxlength: 20,
                },

            },
            submitHandler: function (form) {
                console.log("Reset Password");
                var model = {
                    UserId: JSON.parse(localStorage.getItem("UserModel")).UserId,
                    Code: $('#passwordResetCode').val(),
                    NewPassword: $('#passwordResetNewPassword').val()
                };
                userConfig.resetPassword(model);
                // do other things for a valid form
                //form.submit();
            }
        });
    },
    openPhoneVerificationModal: function () {
        $('.close-link').trigger('click');
        $('.openPhoneVerificationModal').trigger('click');
    },
    openForgotPasswordModal: function () {
        $('.close-link').trigger('click');
        $('.openForgotPasswordModal').trigger('click');
    },
    openPasswordResetModal: function () {
        $('.close-link').trigger('click');
        $('.openPasswordResetModal').trigger('click');
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
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-bottom-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
});
//#endregion DocumentReady


function goToRegisterPage(){
    window.location.href="/Account/Register";
}