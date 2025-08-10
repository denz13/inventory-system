class OneLogin {

	MAIN = this;

	API_KEY = '';
	SERVER_PAGE = '';
	SERVER_PAGE_LOGIN = '';
	SERVER_LOGIN_CHECK = '';
	PAGE_LOGIN_SAVE = '';

	TOKEN = '';
	LOGIN_TOKEN = '';

	PAGE_DEFAULT = '';

	URL_SRC = '';
	URL_DST = '';

	READY = false;

	TMR_LOGIN_CHECK;
	ON_LOGIN_CHECK = false;

	constructor(token, urlSRC = '', urlDST = '', onReadyLogin = false) {

		this.MAIN = this;

		this.TOKEN = token;

		try{
			if(urlSRC == false || urlSRC === false || urlSRC === 'NaN' || urlSRC === 'undefined') {
				urlSRC = '';
			}
		}catch(err){}
		try{
			if(urlDST == false || urlDST === false || urlDST === 'NaN' || urlDST === 'undefined') {
				urlDST = '';
			}
		}catch(err){}

		this.URL_SRC = urlSRC;
		this.URL_DST = urlDST;


		this.load_settings(onReadyLogin);

	}

	__IS_READY() {
		return this.READY;
	}


	login() {
		try{
			if(!this.ON_LOGIN_CHECK) {
				this.ON_LOGIN_CHECK = true;
				this.TMR_LOGIN_CHECK = setInterval(function () {
					if(this.__IS_READY()) {
						this.__login();
						clearInterval(this.TMR_LOGIN_CHECK);
					}
				}.bind(this), 500);
			}
		}catch(err){}
	}

	__login() {
		try{
			/***/
	        /***/
	        /***/
	        var cs = this.SERVER_LOGIN_CHECK;
	        /***/
	        /***/
	        $.post(cs,
	            {
                	_token: this.TOKEN,
                	api: this.API_KEY,
                	token: this.LOGIN_TOKEN,
	                src: this.URL_SRC,
	                dst: this.URL_DST,
	            },
	            function(response) {
	                try{
	                	/*//.log(response);*/
	                    /***/
	                    var data = (response);
	                    var res_code = parseInt(data['code']);
	                    var res_msg = data['message'];
	                    /***/
	                    if(res_code > 0) {
	                        //toast_show_success("Success","Login successful. Redirecting...");
	                        //window.location.href = this.PAGE_DEFAULT;
	                        /**/
	                        this.save_login(data['data'], true);
	                        /**/
	                    }else{
	                        //toast_show_error("Error","Login session expired. Redirecting...");
	                        /**/
	                        var url = this.SERVER_PAGE_LOGIN + '?' + 'src=' + this.URL_SRC + '&dst=' + this.URL_DST;
	                        /**/
	                        window.location.href = url;
	                    }
	                    /***/
	                    /***/
	                }catch(err){  }
	                this.ON_LOGIN_CHECK = false;
	        }.bind(this))
	        .done(function() {

	        })
	        .fail(function(response) {
                this.ON_LOGIN_CHECK = false;
	        	/*//.log(response);*/
	        })
	        .always(function() {
                this.ON_LOGIN_CHECK = false;
	        });
			/***/
			/***/
		}catch(err){}
	}

	save_login(data, redirect = false) {
		try{
			/***/
	        /***/
	        /***/
	        var cs = this.PAGE_LOGIN_SAVE;
	        /***/
	        /***/
	        $.post(cs,
	            {
                	_token: this.TOKEN,
                	data: data,
	            },
	            function(response) {
	                try{
	                    /***/
	                    var data = (response);
	                    var res_code = parseInt(data['code']);
	                    var res_msg = data['message'];
	                    /***/
	                    if(res_code > 0) {
	                        /**/
	                        if(redirect) {
		                        var url = this.PAGE_DEFAULT;
		                        window.location.href = url;
	                        }
	                        /**/
	                    }else{
	                        /**/
	                        if(redirect) {
		                        var url = this.PAGE_DEFAULT;
		                        window.location.href = url;
	                        }
	                        /**/
	                    }
	                    /***/
	                    /***/
	                }catch(err){  }
	        }.bind(this))
	        .done(function() {

	        })
	        .fail(function(response) {
	        	/*//.log(response);*/
	        })
	        .always(function() {
	        });
			/***/
			/***/
		}catch(err){}
	}

	load_settings(onReadyLogin = false) {
		try{
			/***/
	        /***/
	        var cs = 'onelogin/settings/get';
	        /***/
	        $.post(cs,
	            {
                	_token: this.TOKEN,
	            },
	            function(response) {
	                try{
	                	/*//.log(response);*/
	                    /***/
	                    var data = (response);
	                    /***/
	                    this.API_KEY = data['api_key'];
	                    this.SERVER_PAGE = data['server_page'];
	                    this.SERVER_PAGE_LOGIN = data['server_page_login'];
	                    this.SERVER_LOGIN_CHECK = data['server_login_check'];
	                    /***/
	                    this.PAGE_LOGIN_SAVE = data['page_login_save'];
	                    /***/
	                    this.LOGIN_TOKEN = data['logintoken'];
	                    this.PAGE_DEFAULT = data['page_default'];
	                    /***/
	                    this.READY = true;
	                    /***/
	                    if(onReadyLogin) {
	                    	if(this.READY) {
	                    		this.__login();
	                    	}
	                    }
	                    /***/
	                }catch(err){  }
	        }.bind(this))
	        .done(function() {

	        })
	        .fail(function(response) {
	        	/*//.log(response);*/
	        })
	        .always(function() {

	        });
			/***/
			/***/
		}catch(err){}
	}

}
