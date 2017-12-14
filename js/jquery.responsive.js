"use strict";

/**
 * @name responsive
 * @author JungHyunKwon
 * @since 2017-12-06
 * @version 1.0
 */
try {
	//제이쿼리가 있는지 확인
	this.jQuery = this.jQuery || undefined;

	if(jQuery) {
		//$ 중첩 방지
		(function($) {
			var _$window = $(window),
				_isWindowLoad = false,
				_windowTempWidth = 0,
				_windowTempHeight = 0,
				_connectedState = _getConnectedState(),
				_range = {},
				_rangeCode = "",
				_rangeProperty = [],
				_timeout = 0,
				_interval = 0,
				/**
				 * @name JSON psrse, stringify
				 * @link {https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/JSON}
				 */
				_JSON = {
				parse: function(sJSON) {
					return eval('(' + sJSON + ')');
				},

				stringify: (function() {
					var toString = Object.prototype.toString;
					var isArray = Array.isArray || function(a) {
						return toString.call(a) === '[object Array]';
					};
					var escMap = {
						'"': '\\"',
						'\\': '\\\\',
						'\b': '\\b',
						'\f': '\\f',
						'\n': '\\n',
						'\r': '\\r',
						'\t': '\\t'
					};
					var escFunc = function(m) {
						return escMap[m] || '\\u' + (m.charCodeAt(0) + 0x10000).toString(16).substr(1);
					};
					var escRE = /[\\"\u0000-\u001F\u2028\u2029]/g;
					return function stringify(value) {
						if (value == null) {
							return 'null';
						} else if (typeof value === 'number') {
							return isFinite(value) ? value.toString() : 'null';
						} else if (typeof value === 'boolean') {
							return value.toString();
						} else if (typeof value === 'object') {
							if (typeof value.toJSON === 'function') {
								return stringify(value.toJSON());
							} else if (isArray(value)) {
								var res = '[';
								for (var i = 0; i < value.length; i++)
									res += (i ? ', ' : '') + stringify(value[i]);
								return res + ']';
							} else if (toString.call(value) === '[object Object]') {
								var tmp = [];
								for (var k in value) {
									if (value.hasOwnProperty(k))
										tmp.push(stringify(k) + ': ' + stringify(value[k]));
								}
								return '{' + tmp.join(', ') + '}';
							}
						}
						return '"' + value.toString().replace(escRE, escFunc) + '"';
					};
				})()
			};

			/**
			 * @name 변수 형태
			 * @param {*} variable
			 * @return {string}
			 */
			function _typeOf(variable) {
				var result = Object.prototype.toString.call(variable).toLowerCase().replace("[object ", "").replace("]", "");
				
				//ie7, ie8 fixed
				if(variable == undefined) {
					result = "undefined";
				}

				return result;
			}

			/**
			 * @name 가비지 컬렉션
			 * @since 2017-12-06
			 * @param {object} object
			 * @return {object}
			 */
			function _freeObject(object) {
				var result = {};

				if(_typeOf(object) == "object") {
					result = _JSON.parse(_JSON.stringify(object));
				}

				return result;
			}

			/**
			 * @name 접속상태 가져오기
			 * @since 2017-12-06
			 * @return {object}
			 */
			function _getConnectedState() {
				var userAgent = navigator.userAgent.toLowerCase(),
					platform = navigator.platform.toLowerCase(),
					platformCase = ["win16", "win32", "win64", "mac", "linux"],
					result = {browser : "", platform : ""};

				if(userAgent.indexOf("msie 7.0") > -1) {
					result.browser = "ie7";
				}else if(userAgent.indexOf("msie 8.0") > -1) {
					result.browser = "ie8";
				}else if(userAgent.indexOf("msie 9.0") > -1) {
					result.browser = "ie9";
				}else if(userAgent.indexOf("msie 10.0") > -1) {
					result.browser = "ie10";
				}else if(userAgent.indexOf("trident/7.0") > -1) {
					result.browser = "ie11";
				}else if(userAgent.indexOf("edge") > -1) {
					result.browser = "edge";
				}else if(userAgent.indexOf("opr") > -1) {
					result.browser = "opera"; 
				}else if(userAgent.indexOf("chrome") > -1) {
					result.browser = "chrome";
				}else if(userAgent.indexOf("firefox") > -1) {
					result.browser = "firefox"; 
				}else if(userAgent.indexOf("safari") > -1) {
					result.browser = "safari";
				}else{
					result.browser = "unknown";
				}
				
				if($.inArray(platform, platformCase) > -1) {
					result.platform = "pc";
				}else{
					result.platform = "mobile";
				}

				return result;
			}

			/**
			 * @name 배열 중복값 제거
			 * @description name에서 중복값을 제거합니다.
			 * @since 2017-12-06
			 * @param {array || string} name
			 * @return {array}
			 */
			function _removeDuplicate(name) {
				var result = [],
					typeOf = _typeOf(name);
				
				//문자, 숫자, 불린일 경우 배열로 만든다.
				if(typeOf == "string" || typeOf == "number" || typeOf == "boolean") {
					name = $.makeArray(name);
				}else if(typeOf != "array") {
					name = [];
				}

				//result값에 값이 없으면 집어넣는다.
				for(var i = 0; i < name.length; i++) {
					if($.inArray(name[i], result) == -1) {
						result.push(name[i]);
					}
				}

				return result;
			}

			$(function() {
				var _$target = $("body"),
					_responsive = _getDefaultObject();

				/**
				 * @name 스크롤바 존재여부
				 * @since 2017-12-06
				 * @param {object} object
				 * @return {object}
				 */
				function _hasScrollbar(object) {
					var $this = $(object).first(),
						$target = $this.add($this.parents()),
						horizontal = [],
						vertical = [],
						result = {horizontal : false, vertical : false};
					
					//스크롤바 탐지
					$target.each(function(index, element) {
						var $this = $(element),
							overflow = {
								x : $this.css("overflow-x"),
								y : $this.css("overflow-y")
							};

						//매핑한 객체의 넓이가 넘치면서 overflow:hidden이 아니거나 스크롤을 강제 지정한경우 스크롤이 있는걸로 간주
						if((element.scrollWidth > element.clientWidth && overflow.x != "hidden") || overflow.x == "scroll") {
							horizontal.push(true);
						}else{
							horizontal.push(false);
						}
						
						//매핑한 객체의 높이가가 넘치면서 overflow:hidden이 아니거나 스크롤을 강제 지정한경우 스크롤이 있는걸로 간주
						if((element.scrollHeight > element.clientHeight && overflow.y != "hidden") || overflow.y == "scroll") {
							vertical.push(true);
						}else{
							vertical.push(false);
						}
					});
					
					//가로스크롤바가 하나라도 있을경우
					if($.inArray(true, horizontal) > -1) {
						result.horizontal = true;
					}
					
					//세로스크롤바가 하나라도 있을경우
					if($.inArray(true, vertical) > -1) {
						result.vertical = true;
					}

					return result;
				}

				/**
				 * @name 스크롤바 넓이 구하기
				 * @since 2017-12-06
				 * @return {number}
				 */
				function _getScrollbarWidth() {
					var $body = $("body"),
						$scrollbar = $body.children("#responsive_scrollbar"),
						result = ($scrollbar.length) ? $scrollbar[0].offsetWidth - $scrollbar[0].clientWidth : 0;
					
					//객체가 없을경우
					if(!$scrollbar.length) {
						$body.append("<div id=\"responsive_scrollbar\" style=\"visibility:hidden; overflow:scroll; position:absolute; top:-100px; left:-100px; z-index:-1; width:100px; height:100px;\">&nbsp;</div>");
						result = _getScrollbarWidth();
					}

					return result;
				}

				/**
				 * @name 기본옵션 객체 얻기
				 * @since 2017-12-06
				 * @return {object}
				 */
				function _getDefaultObject() {
					var hasScrollbar = _hasScrollbar(_$target[0]),
						scrollbarWidth = _getScrollbarWidth(),
						windowWidth = (hasScrollbar.vertical) ? _$window.width() + scrollbarWidth : _$window.width(),
						windowHeight = (hasScrollbar.horizontal) ? _$window.height() + scrollbarWidth : _$window.height(),
						result = {
							isRun : false,
							enter : [],
							exit : [],
							nowState : [],
							prevState : [],
							lowIERange : [],
							scrollbarWidth : scrollbarWidth,
							windowWidth : windowWidth,
							windowHeight : windowHeight,
							windowLoadedWidth : windowWidth,
							windowLoadedHeight : windowHeight,
							browser : _connectedState.browser,
							platform : _connectedState.platform,
							hasVerticalScrollbar : hasScrollbar.vertical,
							hasHorizontalScrollbar : hasScrollbar.horizontal,
							isLowIE : _connectedState.browser == "ie7" || _connectedState.browser == "ie8",
							lowIERun : false,
							isScreenChange : false,
							isScreenWidthChange : false,
							isScreenHeightChange : false,
							isScreenWidthAndHeightChange : false
						};
					
					//스크롤바 객체제거
					$("body > #responsive_scrollbar").remove();

					return _freeObject(result);
				}

				/**
				 * @name 분기 적용
				 * @since 2017-12-06
				 * @param {array[string] || string} state
				 * @return {boolean}
				 */
				function _setState(state) {
					var result = false,
						setState = [],
						nowState = [];

					//중복제거
					state = _removeDuplicate(state);

					//적용시킬 상태가 있는지 확인
					for(var i = 0; i < state.length; i++) {
						if($.inArray(state[i], _responsive.nowState) == -1) {
							setState.push(state[i]);
						}else{
							nowState.push(state[i]);
						}
					}
				
					//적용시킬 상태가 있으면 true
					if(setState.length) {
						result = true;
					}

					if(result) {
						//현재상태 클래스 제거
						_$target.removeClass(nowState.join(" "));

						//새로운상태 클래스 추가
						_$target.addClass(state.join(" "));
						
						//이전상태 추가
						_responsive.prevState = nowState;

						//새로운상태 추가
						_responsive.nowState = state;

						//console에 새로운상태 표기
						console.log("현재상태 : " + state.join(", "));
					}
					
					//함수실행
					_callEvent((state.join("All, ") + "All").split(", "));
					
					if(result) {
						_callEvent(state);					
					}

					return result;
				}

				/**
				 * @name 분기이벤트 실행
				 * @since 2017-12-06
				 * @param {array[string] || string} state
				 * @return {array}
				 */
				function _callEvent(state) {
					var event = {
							responsive : _freeObject(_responsive)
						};

					//중복제거
					state = _removeDuplicate(state);

					//사용자 제공 객체 갱신
					$.responsive.setting = event.responsive;

					for(var i = 0; i < state.length; i++) {
						//상태기입
						event.state = state[i];

						//모든 이벤트 호출
						_$window.triggerHandler($.Event("responsive", event));

						//필터 이벤트 호출
						_$window.triggerHandler($.Event("responsive:" + state[i], event));
					}

					return state;
				}
				
				/**
				 * @name 화면정보 입력
				 * @since 2017-12-06
				 * @return {object}
				 */
				function _setScreenInfo() {
					//스크롤바 유무
					var hasScrollbar = _hasScrollbar(_$target[0]);

					//가로, 세로 스크롤바가 있는지 갱신
					_responsive.hasVerticalScrollbar = hasScrollbar.vertical;
					_responsive.hasHorizontalScrollbar = hasScrollbar.horizontal;

					//스크롤바 넓이 갱신
					_responsive.scrollbarWidth = _getScrollbarWidth();

					//브라우저 스크롤바가 있을때
					if(_responsive.scrollbarWidth) {
						_$target.addClass("scrollbar");
					}else{
						_$target.removeClass("scrollbar");
					}

					//화면정보 등록
					_responsive.windowWidth = _$window.width();
					_responsive.windowHeight = _$window.height();

					//세로 스크롤바가 있을때
					if(_responsive.hasVerticalScrollbar) {
						_responsive.windowWidth += _responsive.scrollbarWidth;
					}

					//가로 스크롤바가 있을때
					if(_responsive.hasHorizontalScrollbar) {
						_responsive.windowHeight += _responsive.scrollbarWidth;
					}

					return _responsive;
				}

				/**
				 * @param {object} option {range : {# : {from : n || "*", to : n || "*"}}, lowIERun : boolean, lowIERange : ["#"], interval : n}
				 * @return {object}
				 */
				$.responsive = function(option) {
					//중복실행 검사 && 윈도우 로드 검사
					if(!_responsive.isRun && _isWindowLoad) {
						//실행등록
						_responsive.isRun = true;

						//브라우저, 플랫폼 클래스 추가
						_$target.addClass(_responsive.browser + " " + _responsive.platform);
						
						//옵션이 객체가 아닐경우
						if(_typeOf(option) != "object") {
							option = {};
						}

						//ie7, ie8에서 분기 실행여부
						if(_typeOf(option.lowIERun) == "boolean") {
							_responsive.lowIERun = option.lowIERun;
						}else{
							_responsive.lowIERun = false;
						}
						
						//lowIERun을 true로 지정했을때 나타나는 분기
						var typeofLowIERange = _typeOf(option.lowIERange);

						if(typeofLowIERange == "array" || typeofLowIERange == "string") {
							_responsive.lowIERange = _removeDuplicate(option.lowIERange);
						}else{
							_responsive.lowIERange = ["web"];
						}

						//리사이즈 종료간격 추가
						if(_typeOf(option.interval) == "number") {
							_interval = option.interval;
						}else{
							_interval = 250;
						}

						//초기화면 정보
						if(_typeOf(option.range) == "object") {
							_range = option.range;
						}else{
							_range = {
								wide : {
									from : 9999,
									to : 1201
								},

								web : {
									from : 1200,
									to : 801
								},

								tablet : {
									from : 800,
									to : 641
								},

								phone : {
									from : 640,
									to : 0
								}
							};
						}

						//초기화
						_rangeCode = "_responsive.enter = [];\n_responsive.exit = [];\n\n";
						
						//rangeCode작성 시작

						//ie7 && ie8일때 예외처리
						_rangeCode += "if(!_responsive.lowIERun && _responsive.isLowIE) {\n\t_responsive.enter = _responsive.lowIERange;\n}else{\n";

						//range에 적은 값을 기준으로 자바스크립트 코드 생성
						var i;

						for(i in _range) {
							//소문자 변경
							i = i.toLowerCase();

							//필터링
							if(i.substr(-7) != "resized" && i.substr(-4) != "none" && i.substr(-3) != "all" && i != "mobile" && i != "pc" && i != "scrollbar" && i != "ie7" && i != "ie8" && i != "ie9" && i != "ie10" && i != "ie11" && i != "edge" && i != "whale" && i != "samsung" && i != "opera" && i != "chrome" && i != "firefox" && i != "safari" && i != "unknown") {
								//프로퍼티명 기입
								_rangeProperty.push(i);
								
								//객체가 아닐경우
								if(_typeOf(_range[i]) != "object") {
									_range[i] = {};
								}

								//값이 없거나 문자일 경우
								if(_typeOf(_range[i].from) != "number") {
									_range[i].from = 9999;	
								}

								//값이 없거나 문자일 경우
								if(_typeOf(_range[i].to) != "number") {
									_range[i].to = 0;
								}
							
								_rangeCode += "\tif(_responsive.windowWidth <= _range[\"" + i + "\"].from && _responsive.windowWidth >= _range[\"" + i + "\"].to) {\n";
								_rangeCode += "\t\t_responsive.enter.push(\"" + i + "\");\n";
								_rangeCode += "\t}else{\n";
								_rangeCode += "\t\t_responsive.exit.push(\"" + i + "\");\n";
								_rangeCode += "\t}\n\n";
							}
						}

						_rangeCode += "}";
						
						//필터링된 프로퍼티명에서 lowIERange명이 있는지 확인해서 없으면 공백처리
						i = 0;
						for(; i < _responsive.lowIERange.length; i++) {
							if($.inArray(_responsive.lowIERange[i], _rangeProperty) == -1) {
								_responsive.lowIERange[i] = "none";
							}
						}

						//하위IE에서 적용시킬 상태가 한개이면서 첫번째가 공백일경우
						if(_responsive.lowIERange.length == 1 && _responsive.lowIERange[0] == "none") {
							_responsive.lowIERange = ["none"];
						}else{
							_responsive.lowIERange = _responsive.lowIERange.join(", ").replace(/, none/g, "").split(", ");
						}
						
						//rangeCode작성 끝

						_$window.on("resize.responsive", function(event) {
							//화면이 변경되었는지 확인하는 변수
							_responsive.isScreenChange = false;
							_responsive.isScreenWidthChange = false;
							_responsive.isScreenHeightChange = false;
							_responsive.isScreenWidthAndHeightChange = false;
							
							//화면정보 갱신
							_setScreenInfo();

							//기존의 스크린 넓이와 새로부여받은 스크린 넓이가 같은지 확인
							if(_responsive.windowWidth != _windowTempWidth) {
								_windowTempWidth = _responsive.windowWidth;
								_responsive.isScreenWidthChange = true;
							}
							
							//기존의 스크린 높이와 새로부여받은 스크린 높이가 같은지 확인
							if(_responsive.windowHeight != _windowTempHeight) {
								_windowTempHeight = _responsive.windowHeight;
								_responsive.isScreenHeightChange = true;
							}
							
							//기존 스크린 넓이와 높이가 둘다 변경되었을때
							if(_responsive.isScreenWidthChange && _responsive.isScreenHeightChange) {
								_responsive.isScreenWidthAndHeightChange = true;
							}

							//스크린의 넓이값 또는 세로값이 변경되었을때
							if(_responsive.isScreenWidthChange || _responsive.isScreenHeightChange) {
								_responsive.isScreenChange = true;
							}
							
							//스크린의 넓이값이 변경되었을 때
							if(_responsive.isScreenWidthChange) {
								//리사이즈 확인 함수
								_responsive.isResize = true;

								//전체범위 함수 호출
								_callEvent("all");

								//범위실행
								eval(_rangeCode);

								//상태적용, 이벤트 호출
								if(_responsive.enter.length) {
									_setState(_responsive.enter);
								}else{
									_setState("none");
								}

								//돌던 setTimeout이 있으면 중단
								if(_timeout) {
									clearTimeout(_timeout);
									_timeout = 0;
								}
								
								//setTimeout 재등록
								_timeout = setTimeout(function() {
									//리사이즈가 종료되어 플래그 변경
									_responsive.isResize = false;
									
									//화면정보 갱신
									_setScreenInfo();
									
									//전체범위 함수 호출
									_callEvent("allResized");
									
									//상태적용, 이벤트 호출
									if(_responsive.enter.length) {
										_callEvent((_responsive.enter.join("AllResized, ") + "AllResized").split(", "));
									}else{
										_callEvent("noneAllResized");
									}
								}, _interval);
							}
						}).triggerHandler("resize.responsive");
					}else{
						throw "이미 실행 중 이거나 윈도우가 로드되지 않았습니다.";
					}
					
					//객체 반환
					return this;
				};

				/**
				 * @name 반응형 플러그인 소멸
				 * @since 2017-12-06
				 * @return {object}
				 */
				$.responsive.destroy = function() {
					var result = false;
					
					//플러그인을 실행중일때
					if(_responsive.isRun) {
						_$window.off("resize.responsive");
						_$target.removeClass("scrollbar " + _responsive.browser + " " + _responsive.platform + " " + _responsive.nowState.join(" "));
						_responsive = _getDefaultObject();
						_windowTempWidth = 0;
						_windowTempHeight = 0;
						this.setting = undefined;
						result = true;
					}

					return result;
				};

				//사용자 객체 제공
				$.responsive.setting = _freeObject(_responsive);
			});

			_$window.on("load.responsive", function(event) {
				_isWindowLoad = true;
			});
		})(jQuery);
	}else{
		throw "제이쿼리가 없습니다.";
	}
}catch(e) {
	console.error(e);
}