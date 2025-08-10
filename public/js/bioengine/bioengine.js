class BioEngine {

	MAIN = this;

	BASEPATH = '';

	API_KEY = '';

	TOKEN = '';

	READY = false;
	BIO_CONNECTED = false;

	URL_BASE = '';
	URL_CHECK = '';
	URL_FP_GET = '';
	URL_FP_SYNC_LOCAL = '';
	URL_FP_SYNC_LOCAL_ALL = '';
	URL_FP_ACTION = '';
	URL_CLIENT = '';
	URL_CLIENT_SYNC_TO_LOCAL = '';

	CONN_TIMEOUT = 1000;
	COM_INTERVAL = 1000;

	CHECK_RESULT_COUNT_MAX = 10;
	CHECK_RESULT_COUNT_CURRENT = 0;

	FP_SAMPLE_COUNT = 1;

	ENABLE_AUTO_FP_GETDATA = false;

	ON_FP_DATA_GET = false;
	ON_CHECK_MODE_SET_RESULT = false;

	TMR_1 = null;

	CALLBACK_FP_GETDATA = null;
	CALLBACK_FP_SAVE = null;
	CALLBACK_FP_REGISTER = null;
	CALLBACK_FP_COMMON = null;
	CALLBACK_FP_CHECK = null;

	MODE_BIO_REGISTER = false;
	MODE_BIO_VERIFY = false;

	RECENT_RID = '';

	TAG_MODE_SET = 'fp_mode_set';
	TAG_MODE_TYPE_REGISTER = 'register';
	TAG_MODE_TYPE_VERIFY = 'verify';
	TAG_MODE_TYPE_SM_REGISTER = 'sm_register';
	TAG_MODE_TYPE_SM_VERIFY = 'sm_verify';
	TAG_MODE_SET_STATUS = 'fp_mode_set_status';
	TAG_CHECK_FP_DATA = 'fp_data_check';
	TAG_DATA_SYNC_TO_LOCAL = 'fp_data_sync';
	TAG_DATA_SYNC_TO_LOCAL_ALL = 'fp_data_sync_all';
	TAG_TO_LOCAL = 'to_local';
	TAG_FP_REGISTER_CANCEL = 'fp_register_cancel';
	TAG_FP_VERIFY_CANCEL = 'fp_verify_cancel';

	DATA_KEY_SAMPLE_COUNT = 'status_sample_count';
	DATA_KEY_PROCESS_STATUS = 'status';

	VERIFY_TYPE = '';



	constructor(token, basepath = '') {

		this.MAIN = this;

		this.TOKEN = token;
		this.BASEPATH = basepath;

		this.load_settings();



	}

	isReady() {
		return this.READY;
	}

	setupFPGetDataInterval() {
		this.TMR_1 = setInterval(function () {
			if(this.ENABLE_AUTO_FP_GETDATA) {
				this.fpGetData(this.CALLBACK_FP_GETDATA);
				//console.log(1);
			}
		}.bind(this), this.COM_INTERVAL);
	}


	load_settings() {
		try{
			/***/
	        /***/
	        var cs = this.BASEPATH + '/bioengine/settings/get';
	        /***/
	        $.post(cs,
	            {
                	_token: this.TOKEN,
	            },
	            function(response) {
	                try{
	                	/*console.log(response);*/
	                    /***/
	                    var data = (response);
	                    /***/
	                    this.API_KEY = data['api_key'];
	                    /***/
	                    this.URL_BASE = data['url_base'];
	                    this.URL_CHECK = data['url_check'];
	                    this.URL_FP_GET = data['url_fp_get'];
	                    this.URL_FP_SYNC_LOCAL = data['url_fp_sync_local'];
	                    this.URL_FP_SYNC_LOCAL_ALL = data['url_fp_sync_local_all'];
	                    this.URL_FP_ACTION = data['url_fp_action'];
	                    /***/
	                    this.URL_CLIENT = data['url_client'];
	                    this.URL_CLIENT_SYNC_TO_LOCAL = data['url_client_sync_tolocal'];
	                    /***/
	                    this.CONN_TIMEOUT = parseInt(data['conn_timeout']);
	                    /***/
	                    this.COM_INTERVAL = parseInt(data['com_interval']);
	                    /***/
	                    this.CHECK_RESULT_COUNT_MAX = parseInt(data['check_result_count_max']);
	                    this.CHECK_RESULT_COUNT_CURRENT = 0;
	                    /***/
	                    this.FP_SAMPLE_COUNT = parseInt(data['fp_sample_count']);
	                    /***/
	                    /***/
	                    try{
	                    	let val = parseInt(data['auto_fp_data_get']);
	                    	if(val > 0) {
	                    		this.ENABLE_AUTO_FP_GETDATA = true;
	                    		this.setupFPGetDataInterval();
	                    	}else{
	                    		this.ENABLE_AUTO_FP_GETDATA = false;
	                    		this.TMR_1 = null;
	                    	}
	                    }catch(err){}
	                    /***/
	                    /***/
	                    this.READY = true;
	                    /***/
	                    this.deviceBioConnectionCheck();
	                    /***/
	                }catch(err){  }
	        }.bind(this))
	        .done(function() {

	        })
	        .fail(function(response) {
	        	/*console.log(response);*/
	        })
	        .always(function() {

	        });
			/***/
			/***/
		}catch(err){}
	}


	setAutoFPGetData(value) {
		this.ENABLE_AUTO_FP_GETDATA = value;
	}

	setCallbackFPCheck(callback) {
		this.CALLBACK_FP_CHECK = callback;
	}
	setCallbackFPGetCommon(callback) {
		this.CALLBACK_FP_COMMON = callback;
	}
	setCallbackFPGetData(callback) {
		this.CALLBACK_FP_GETDATA = callback;
	}
	setCallbackFPRegister(callback) {
		this.CALLBACK_FP_REGISTER = callback;
	}
	setCallbackSaveFingerprint(callback) {
		this.CALLBACK_FP_SAVE = callback;
	}

	deviceFPCheck(callback) {
		try{
			if(this.READY) {
				/***/
		        /***/
		        var params = "";
		        var cs = this.URL_CHECK + params;
		        /***/
				$.ajax({
					url: cs,
					type: "GET",
					timeout: this.CONN_TIMEOUT,
					data: {
		            	api_key:this.API_KEY,
					},
					success: function(response) {
						try{
		                	/*console.log(response);*/
		                    /***/
		                    var data = (response);
		                    /***/
		                    callback(data);
		                    /***/
						}catch(err){}
					},
					error: function(response) {
						try{
		                	/*console.log(response);*/
				        	var data = { code: "-1", message: "Error.", content: "Error." };
				            callback(data);
						}catch(err){}
					}
				});
		        /***/
				/***/
				/***/
			}
		}catch(err){}
	}

	fpGetData(callback) {
		try{
			if(this.READY && this.BIO_CONNECTED && !this.ON_FP_DATA_GET) {
				/***/
				this.ON_FP_DATA_GET = true;
		        /***/
		        var doProcess = false;
		        /***/
		        var params = "";
		        var cs = this.URL_CHECK + params;
		        /***/
		        var fact = 'check';
		        var fval = '';
		        /***/
		        if(this.ON_CHECK_MODE_SET_RESULT) {
		        	fact = this.TAG_MODE_SET_STATUS;
		        	fval = 'status';
		        	if(this.CHECK_RESULT_COUNT_CURRENT <= this.CHECK_RESULT_COUNT_MAX) {
		        		doProcess = true;
		        		this.CHECK_RESULT_COUNT_CURRENT = this.CHECK_RESULT_COUNT_CURRENT + 1;
		        	}else{
		        		doProcess = false;
		        		this.ON_CHECK_MODE_SET_RESULT = false;
		        	}
		        }
		        /***/
		        if(!this.ON_CHECK_MODE_SET_RESULT) {
		        	if(this.MODE_BIO_REGISTER) {
		        		doProcess = true;
		        		fact = this.TAG_CHECK_FP_DATA;
		        		fval = 'get';
		        	}
		        	if(this.MODE_BIO_VERIFY) {
		        		doProcess = true;
		        		fact = this.TAG_CHECK_FP_DATA;
		        		fval = 'get';
		        	}
		        }
		        /***/
		        /***/
		        if(doProcess) {
					$.ajax({
						url: cs,
						type: "GET",
						timeout: this.CONN_TIMEOUT,
						data: {
			            	api_key:this.API_KEY,
			            	action:fact,
			            	value:fval,
						},
						success: function(response) {
							try{
			                	/*console.log(response);*/
			                    /***/
			                    this.ON_FP_DATA_GET = false;
			                    /***/
			                    /***/
			                    var data = (response);
			                    /***/
			                    if(this.ON_CHECK_MODE_SET_RESULT) {
			                    	if(data != null && data != undefined) {
			                    		try{
			                    			console.log(data);
			                    			let tc = parseInt(data['code']);
			                    			if(tc > 0) {
			                    				this.ON_CHECK_MODE_SET_RESULT = false;
			                    				/*console.log("READER READY");*/
		                    					this.processResultData(data['data']);
			                    			}else{

			                    			}
			                    		}catch(err){}
			                    	}
			                    }else{
						        	if(this.MODE_BIO_REGISTER) {
						        		this.processResultData(data['data']);
						        	}
						        	if(this.MODE_BIO_VERIFY) {
						        		this.processResultData(data['data']);
						        	}
			                    }
			                    /***/
			                    if(callback !== null && callback !== undefined) {
			                    	callback(data);
			                    }
			                    /***/
							}catch(err){}
						}.bind(this),
						error: function(response) {
							try{
			                	/*console.log(response);*/
			                    /***/
			                    this.ON_FP_DATA_GET = false;
			                    /***/
			                    if(callback !== null && callback !== undefined) {
						        	var data = { code: "-1", message: "Error.", content: "Error." };
						            callback(data);
						        }
			                    /***/
							}catch(err){}
						}.bind(this),
						fail: function(response) {
							try{
			                    /***/
			                	/*console.log(response);*/
			                    /***/
			                    this.ON_FP_DATA_GET = false;
			                    /***/
			                    if(callback !== null && callback !== undefined) {
						        	var data = { code: "-1", message: "Error.", content: "Error." };
						            callback(data);
						        }
			                    /***/
			                    /***/
							}catch(err){}
						}.bind(this)
					});
				}else{
					this.ON_FP_DATA_GET = false;
				}
		        /***/
				/***/
				/***/
			}
		}catch(err){  }
	}

	fpSendAction_Register() {
		this.fpSendAction(this.TAG_MODE_SET, this.TAG_MODE_TYPE_REGISTER);
	}
	fpSendAction_Verify() {
		this.fpSendAction(this.TAG_MODE_SET, this.TAG_MODE_TYPE_VERIFY);
	}
	fpSendAction_RegisterCancel() {
		this.fpSendAction(this.TAG_FP_REGISTER_CANCEL, this.TAG_FP_REGISTER_CANCEL);
	}
	fpSendAction_VerifyCancel() {
		this.fpSendAction(this.TAG_FP_VERIFY_CANCEL, this.TAG_FP_VERIFY_CANCEL);
	}
	fpSendAction(action, value) {
		try{
			if(this.READY && this.BIO_CONNECTED) {
				/***/
		        /***/
		        var params = "";
		        var cs = this.URL_FP_ACTION + params;
		        /***/
		        var fact = action;
		        var fval = value;
		        /***/
		        /***/
				$.ajax({
					url: cs,
					type: "GET",
					timeout: this.CONN_TIMEOUT,
					data: {
		            	api_key:this.API_KEY,
		            	action:fact,
		            	value:fval,
					},
					success: function(response) {
						try{
		                	/*console.log(response);*/
		                    /***/
		                    /***/
		                    /***/
		                    var data = (response);
		                    /***/
		                    /* CHECK */
		                    if(fact.toLowerCase().trim() == this.TAG_MODE_SET.toLowerCase().trim()) {
		                    	if(data != null && data != undefined) {
		                    		try{
		                    			let tc = parseInt(data['code']);
		                    			if(tc > 0) {
		                    				/*this.ON_CHECK_MODE_SET_RESULT = false;
		                    				console.log("REGISTER ACTIVATED");*/
		                    				this.ON_CHECK_MODE_SET_RESULT = false;
		                    				this.CHECK_RESULT_COUNT_CURRENT = 0;
		                    				this.processResultData(data['data']);
		                    				//this.setModeBioRegister
		                    			}else{
		                    				//this.ON_CHECK_MODE_SET_RESULT = true;
		                    				this.CHECK_RESULT_COUNT_CURRENT = 0;
		                    				this.fpSendAction(action, value);
		                    			}
		                    		}catch(err){}
		                    	}
		                    }
		                    /***/
		                    /* REGISTER CANCEL */
		                    try{
		                    	var rtype = data['data']['type'];
		                    	if(rtype != null && rtype != undefined) {
				                    if(rtype.toLowerCase().trim() == this.TAG_FP_REGISTER_CANCEL.toLowerCase().trim()) {
			                    		try{
			                    			let tc = parseInt(data['code']);
			                    			if(tc > 0) {
			                    				this.resetModes();
												if(this.CALLBACK_FP_COMMON != null && this.CALLBACK_FP_COMMON != undefined) {
													var td = { action:'register-cancel', value:'', featuresNeeded:this.FP_SAMPLE_COUNT, };
													this.CALLBACK_FP_COMMON(td);
												}
			                    			}
			                    		}catch(err){}
				                    }
		                    	}
		                    }catch(err){}
		                    /* VERIFY CANCEL */
		                    try{
		                    	var rtype = data['data']['type'];
		                    	if(rtype != null && rtype != undefined) {
				                    if(rtype.toLowerCase().trim() == this.TAG_FP_VERIFY_CANCEL.toLowerCase().trim()) {
			                    		try{
			                    			let tc = parseInt(data['code']);
			                    			if(tc > 0) {
			                    				this.resetModes();
												if(this.CALLBACK_FP_COMMON != null && this.CALLBACK_FP_COMMON != undefined) {
													var td = { action:'verify-cancel', value:'', featuresNeeded:this.FP_SAMPLE_COUNT, };
													this.CALLBACK_FP_COMMON(td);
												}
			                    			}
			                    		}catch(err){}
				                    }
		                    	}
		                    }catch(err){}
		                    /***/
		                    /***/
		                    if(this.CALLBACK_FP_GETDATA !== null && this.CALLBACK_FP_GETDATA !== undefined) {
		                    	//this.CALLBACK_FP_GETDATA(data);
		                    }
		                    /***/
						}catch(err){}
					}.bind(this),
					error: function(response) {
						try{
		                	/*console.log(response);*/
		                    /***/
		                    /***/
			                if(fact.toLowerCase().trim() == this.TAG_MODE_SET.toLowerCase().trim()) {
			                	this.ON_CHECK_MODE_SET_RESULT = true;
                				this.CHECK_RESULT_COUNT_CURRENT = 0;
			                }
		                    /***/
		                    if(this.CALLBACK_FP_GETDATA !== null && this.CALLBACK_FP_GETDATA !== undefined) {
					        	var data = { code: "-1", message: "Error.", content: "Error." };
					            this.CALLBACK_FP_GETDATA(data);
					        }
		                    /***/
						}catch(err){}
					}.bind(this),
					fail: function(response) {
						try{
		                    /***/
		                	/*console.log(response);*/
		                    /***/
		                    /***/
			                if(fact.toLowerCase().trim() == this.TAG_MODE_SET.toLowerCase().trim()) {
			                	this.ON_CHECK_MODE_SET_RESULT = true;
                				this.CHECK_RESULT_COUNT_CURRENT = 0;
			                }
		                    /***/
		                    if(this.CALLBACK_FP_GETDATA !== null && this.CALLBACK_FP_GETDATA !== undefined) {
					        	var data = { code: "-1", message: "Error.", content: "Error." };
					            this.CALLBACK_FP_GETDATA(data);
					        }
		                    /***/
		                    /***/
						}catch(err){}
					}.bind(this)
				});
		        /***/
				/***/
				/***/
			}
		}catch(err){  }
	}

	deviceBioConnectionCheck(callback) {
		try{
			if(this.READY && !this.ON_FP_DATA_GET) {
				/***/
				this.ON_FP_DATA_GET = true;
		        /***/
		        var params = "";
		        var cs = this.URL_CHECK + params;
		        /***/
				$.ajax({
					url: cs,
					type: "GET",
					data: {
		            	api_key:this.API_KEY,
		            	action:'check',
		            	value:'',
					},
					success: function(response) {
						try{
		                	/*console.log(response);*/
		                    /***/
		                    this.ON_FP_DATA_GET = false;
		                    /***/
		                    /***/
		                    var data = (response);
		                    /***/
		                    var code = parseInt(data['code']);
		                    var message = (data['message']);
		                    /***/
		                    if(code > 0) {
		                    	this.BIO_CONNECTED = true;
		                    	/***/
		                    	/***/
		                    }else{
		                    	this.BIO_CONNECTED = false;
		                    }
		                    /***/
							if(this.CALLBACK_FP_CHECK != null && this.CALLBACK_FP_CHECK != undefined) {
								var td = { status:code, message:message, data:data, };
								this.CALLBACK_FP_CHECK(td);
							}
		                    /***/
						}catch(err){  }
					}.bind(this),
					error: function(response) {
						try{
		                	/*console.log(response);*/
		                    /***/
		                    this.ON_FP_DATA_GET = false;
		                    this.BIO_CONNECTED = false;
		                    $('#' + 'suc_dev_status_error').removeClass('hidden');
		                    /***/
							if(this.CALLBACK_FP_CHECK != null && this.CALLBACK_FP_CHECK != undefined) {
								var td = { status:0, data:data, };
								this.CALLBACK_FP_CHECK(td);
							}
		                    /***/
						}catch(err){}
					}.bind(this),
					fail: function(response) {
						try{
		                    /***/
		                	/*console.log(response);*/
		                    /***/
		                    this.ON_FP_DATA_GET = false;
		                    this.BIO_CONNECTED = false;
		                    $('#' + 'suc_dev_status_error').removeClass('hidden');
		                    /***/
							if(this.CALLBACK_FP_CHECK != null && this.CALLBACK_FP_CHECK != undefined) {
								var td = { status:0, data:data, };
								this.CALLBACK_FP_CHECK(td);
							}
		                    /***/
						}catch(err){}
					}
				});
		        /***/
				/***/
				/***/
			}
		}catch(err){  }
	}

	processResultData(data) {
		try{
			if(data != null && data != undefined) {
				if(!this.MODE_BIO_REGISTER && !this.MODE_BIO_VERIFY) {
					/***/
					var type = data['type'];
					if(type.toLowerCase().trim() == this.TAG_MODE_TYPE_SM_REGISTER.toLowerCase().trim()) {
						this.setModeBioRegister();
						/*console.log("SET REGISTER");*/
						if(this.CALLBACK_FP_COMMON != null && this.CALLBACK_FP_COMMON != undefined) {
							var td = { action:'show-reg', value:'', featuresNeeded:this.FP_SAMPLE_COUNT, };
							this.CALLBACK_FP_COMMON(td);
						}
						//console.log("SET REGISTER");
					}
					if(type.toLowerCase().trim() == this.TAG_MODE_TYPE_SM_VERIFY.toLowerCase().trim()) {
						this.setModeBioVerify();
						/*console.log("SET VERIFY");*/
						if(this.CALLBACK_FP_COMMON != null && this.CALLBACK_FP_COMMON != undefined) {
							var td = { action:'show-verify', value:'', featuresNeeded:1, verifytype:this.VERIFY_TYPE, };
							this.CALLBACK_FP_COMMON(td);
						}
						//console.log("SET VERIFY");
					}
					/***/
				}else{
					/***/
					if(this.MODE_BIO_REGISTER || this.MODE_BIO_VERIFY) {
						var type = data['type'];
						var rid = data['rid'];
						var procStatus = data[this.DATA_KEY_PROCESS_STATUS];
						if(rid.toLowerCase().trim() != this.RECENT_RID.toLowerCase().trim()) {
							this.RECENT_RID = rid;
							/***/
							if(type.toLowerCase().trim() == this.TAG_MODE_TYPE_REGISTER.toLowerCase().trim()) {
								var sample_count = this.FP_SAMPLE_COUNT;
								try{
									sample_count = parseInt(data[this.DATA_KEY_SAMPLE_COUNT]);
									if(isNaN(sample_count)) {
										sample_count = this.FP_SAMPLE_COUNT;
									}
								}catch(err){ }
								/***/
								try{
									if(this.CALLBACK_FP_REGISTER != null && this.CALLBACK_FP_REGISTER != undefined) {
										var tmpd = { featuresMax:this.FP_SAMPLE_COUNT, featuresNeeded:sample_count, };
										var td = { data:data, data2:tmpd, };
										this.CALLBACK_FP_REGISTER(td);
									}
								}catch(err){}
								/***/
								if(procStatus.toLowerCase().trim() == "complete".toLowerCase().trim() ||
									procStatus.toLowerCase().trim() == "completed".toLowerCase().trim()) {
									/***/
									if(type.toLowerCase().trim() == this.TAG_MODE_TYPE_REGISTER.toLowerCase().trim()) {
										this.resetModes();
										try{
											/***/
											if(this.CALLBACK_FP_SAVE != null && this.CALLBACK_FP_SAVE != undefined) {
												this.CALLBACK_FP_SAVE(data);
											}
											/***/
										}catch(err){}
									}
									/***/
								}
							}
							/***/
							/***/
							/* VERIFY START */
							/***/
							if(type.toLowerCase().trim() == this.TAG_MODE_TYPE_VERIFY.toLowerCase().trim()) {
								try{
									/***/
									if(procStatus.toLowerCase().trim() == "success".toLowerCase().trim() ||
										procStatus.toLowerCase().trim() == "success".toLowerCase().trim()) {
										/***/
										//console.log("ID: " + data['id']);
										//console.log("VERIFY SUCCESS");
										if(this.CALLBACK_FP_COMMON != null && this.CALLBACK_FP_COMMON != undefined) {
											var td = { action:'verify-result', value:'success', featuresNeeded:1, verifytype:this.VERIFY_TYPE, data:data, };
											this.CALLBACK_FP_COMMON(td);
										}
										/***/
									}
									if(procStatus.toLowerCase().trim() == "error".toLowerCase().trim() ||
										procStatus.toLowerCase().trim() == "error".toLowerCase().trim()) {
										/***/
										//console.log("VERIFY ERROR");
										if(this.CALLBACK_FP_COMMON != null && this.CALLBACK_FP_COMMON != undefined) {
											var td = { action:'verify-result', value:'error', featuresNeeded:1, verifytype:this.VERIFY_TYPE, data:data, };
											this.CALLBACK_FP_COMMON(td);
										}
										/***/
									}
									/***/
								}catch(err){}
							}
							/***/
							/* VERIFY END */
							/***/
						}
					}
					/***/
				}
			}
		}catch(err){}
	}

	fpSyncDataToLocal(data) {
		try{
			if(this.READY && this.BIO_CONNECTED) {
				/***/
		        /***/
		        var params = "";
		        var cs = this.URL_FP_SYNC_LOCAL + params;
		        /***/
		        var fact = this.TAG_DATA_SYNC_TO_LOCAL;
		        var fval = this.TAG_TO_LOCAL;
		        /***/
		        /***/
		        if(data != null && data != undefined) {
		        	var uid = data['agencyid'];
		        	var fpdata = data['fingerprint'];
		        	/***/
					$.ajax({
						url: cs,
						type: "GET",
						timeout: this.CONN_TIMEOUT,
						data: {
			            	api_key:this.API_KEY,
			            	action:fact,
			            	value:fval,
			            	uid:uid,
			            	fpdata:fpdata,
						},
						success: function(response) {
							try{
			                	/*console.log(response);*/
			                    /***/
			                    var data = (response);
			                    /***/
			                    if(this.CALLBACK_FP_COMMON !== null && this.CALLBACK_FP_COMMON !== undefined) {
									var td = { action:'sync-to-local', value:'', data:data, };
						            this.CALLBACK_FP_COMMON(td);
						        }
			                    /***/
			                    /***/
							}catch(err){}
						}.bind(this),
						error: function(response) {
							try{
			                	/*console.log(response);*/
			                    /***/
			                    /***/
							}catch(err){}
						}.bind(this),
						fail: function(response) {
							try{
			                    /***/
			                	/*console.log(response);*/
			                    /***/
			                    /***/
							}catch(err){}
						}.bind(this)
					});
		        	/***/
		        }
		        /***/
				/***/
				/***/
			}
		}catch(err){  }
	}

	fpSyncDataToLocalAllData(data) {
		try{
			if(this.READY && this.BIO_CONNECTED) {
				/***/
		        /***/
		        var params = "";
		        var cs = this.URL_FP_SYNC_LOCAL_ALL + params;
		        /***/
		        var fact = this.TAG_DATA_SYNC_TO_LOCAL_ALL;
		        var fval = this.TAG_TO_LOCAL;
		        /***/
		        /***/
		        if(data != null && data != undefined) {
		        	/***/
					$.ajax({
						url: cs,
						type: "GET",
						timeout: this.CONN_TIMEOUT,
						data: {
			            	api_key:this.API_KEY,
			            	action:fact,
			            	value:fval,
						},
						success: function(response) {
							try{
			                	/*console.log(response);*/
			                    /***/
			                    var data = (response);
			                    /***/
			                    if(this.CALLBACK_FP_COMMON !== null && this.CALLBACK_FP_COMMON !== undefined) {
									var td = { action:'sync-to-local-all', value:'', data:data, };
						            this.CALLBACK_FP_COMMON(td);
						        }
			                    /***/
			                    /***/
							}catch(err){}
						}.bind(this),
						error: function(response) {
							try{
			                	/*console.log(response);*/
			                    /***/
			                    /***/
							}catch(err){}
						}.bind(this),
						fail: function(response) {
							try{
			                    /***/
			                	/*console.log(response);*/
			                    /***/
			                    /***/
							}catch(err){}
						}.bind(this)
					});
		        	/***/
		        }
		        /***/
				/***/
				/***/
			}
		}catch(err){  }
	}


	resetModes() {
		this.MODE_BIO_REGISTER = false;
		this.MODE_BIO_VERIFY = false;
	}
	setModeBioRegister() {
		try{
			if(this.READY && this.BIO_CONNECTED) {
				/***/
				this.resetModes();
				/***/
				this.MODE_BIO_REGISTER = true;
				/***/
			}else{
				this.resetModes();
			}
		}catch(err){  }
	}
	setModeBioVerify() {
		try{
			if(this.READY && this.BIO_CONNECTED) {
				/***/
				this.resetModes();
				/***/
				this.MODE_BIO_VERIFY = true;
				/***/
			}else{
				this.resetModes();
			}
		}catch(err){  }
	}

	setVerifyType(type = '') {
		try{
			var tn = 0;
			if(type.toLowerCase().trim() == "time-in".toLowerCase().trim()) {
				tn++;
				this.VERIFY_TYPE = "time-in";
			}
			if(type.toLowerCase().trim() == "time-out".toLowerCase().trim()) {
				tn++;
				this.VERIFY_TYPE = "time-out";
			}
			if(type.toLowerCase().trim() == "log-in".toLowerCase().trim()) {
				tn++;
				this.VERIFY_TYPE = "log-in";
			}
			/***/
			/***/
			if(tn <= 0) {
				this.VERIFY_TYPE = "";
			}
		}catch(err){  }
	}

}
