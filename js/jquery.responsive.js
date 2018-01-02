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
				_timestamp = new Date().getTime(),
				_connectedState = _getConnectedState(),
				/**
				 * @name JSON psrse, stringify
				 * @link {https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/JSON}
				 */
				_JSON = {
					parse : function(sJSON) {
						return eval("(" + sJSON + ")");
					},
					stringify : (function() {
						var toString = Object.prototype.toString,
							isArray = Array.isArray || function(a) {
								return toString.call(a) === "[object Array]";
							},
							escMap = {
								"\"" : "\\\"",
								"\\" : "\\\\",
								"\b" : "\\b",
								"\f" : "\\f",
								"\n" : "\\n",
								"\r" : "\\r",
								"\t" : "\\t"
							},
							escFunc = function(m) {
								return escMap[m] || "\\u" + (m.charCodeAt(0) + 0x10000).toString(16).substr(1);
							},
							escRE = /[\\"\u0000-\u001F\u2028\u2029]/g;

						return function stringify(value) {
							if(value == null) {
								return "null";
							}else if(typeof value === "number") {
								return isFinite(value) ? value.toString() : "null";
							}else if(typeof value === "boolean") {
								return value.toString();
							}else if(typeof value === "object") {
								if(typeof value.toJSON === "function") {
									return stringify(value.toJSON());
								}else if(isArray(value)) {
									var res = "[";

									for (var i = 0; i < value.length; i++) {
										res += (i ? ", " : "") + stringify(value[i]);
									}

									return res + ']';
								}else if(toString.call(value) === "[object Object]") {
									var tmp = [];

									for(var k in value) {
										if(value.hasOwnProperty(k)) {
											tmp.push(stringify(k) + " : " + stringify(value[k]));
										}
									}

									return "{" + tmp.join(", ") + "}";
								}
							}

							return "\"" + value.toString().replace(escRE, escFunc) + "\"";
						};
					})()
				};

			/**
			 * @name 변수 형태
			 * @param {*} variable
			 * @return {string}
			 */
			function _typeOf(variable) {
				var result = "";
				
				if(variable === undefined) {
					result = "undefined";
				}else if(typeof variable === "number" && isNaN(variable)) {
					result = "NaN";
				}else{
					result = Object.prototype.toString.call(variable).toLowerCase().replace("[object ", "").replace("]", "");
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
					_option = {};

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
						data = $scrollbar.data(),
						result = ($scrollbar.length) ? $scrollbar[0].offsetWidth - $scrollbar[0].clientWidth : 0;
					
					//data가 없을경우
					if(!data) {
						data = {
							timestamp : undefined
						};
					}

					if(data.timestamp != _timestamp) {
						if($scrollbar.length) {
							$scrollbar.remove();
						}

						$body.append("<div id=\"responsive_scrollbar\" style=\"visibility:hidden; overflow-x:scroll; overflow-y:scroll; position:absolute; top:-100px; left:-100px; z-index:-1; width:100px; height:100px;\"  data-timestamp=\"" + _timestamp + "\">&nbsp;</div>");
						_getScrollbarWidth();
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
							exit : [],
							nowState : [],
							prevState : [],
							lowIERun : false,
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
							isResize : false,
							isScreenChange : false,
 							isScreenWidthChange : false,
 							isScreenHeightChange : false,
 							isScreenWidthAndHeightChange : false
						};

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
						setState = [];

					//중복제거
					state = _removeDuplicate(state);

					//적용시킬 상태가 있는지 확인
					for(var i = 0; i < state.length; i++) {
						if($.inArray(state[i], _option.nowState) == -1) {
							setState.push(state[i]);
						}
					}
				
					//적용시킬 상태가 있으면 true
					if(setState.length) {
						result = true;
					}

					if(result) {
						//현재상태 클래스 제거
						_$target.removeClass(_option.nowState.join(" "));

						//새로운상태 클래스 추가
						_$target.addClass(state.join(" "));
						
						//이전상태 추가
						_option.prevState = _option.nowState;

						//새로운상태 추가
						_option.nowState = state;

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
					//중복제거
					state = _removeDuplicate(state);

					//사용자 객체 갱신
					$.responsive.setting = _freeObject(_option);

					for(var i = 0; i < state.length; i++) {
						//모든 이벤트 호출
						_$window.triggerHandler($.Event("responsive", {state : state[i]}));

						//필터 이벤트 호출
						_$window.triggerHandler($.Event("responsive:" + state[i], {state : state[i]}));
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
					_option.hasVerticalScrollbar = hasScrollbar.vertical;
					_option.hasHorizontalScrollbar = hasScrollbar.horizontal;

					//스크롤바 넓이 갱신
					_option.scrollbarWidth = _getScrollbarWidth();

					//브라우저 스크롤바가 있을때
					if(_option.scrollbarWidth) {
						_$target.addClass("scrollbar");
					}else{
						_$target.removeClass("scrollbar");
					}

					//화면정보 등록
					_option.windowWidth = _$window.width();
					_option.windowHeight = _$window.height();

					//세로 스크롤바가 있을때
					if(_option.hasVerticalScrollbar) {
						_option.windowWidth += _option.scrollbarWidth;
					}

					//가로 스크롤바가 있을때
					if(_option.hasHorizontalScrollbar) {
						_option.windowHeight += _option.scrollbarWidth;
					}

					return _option;
				}

				/**
				 * @param {object} option {range : {# : {from : n, to : n}}, lowIE : {state : ["#"]}}
				 * @return {object}
				 */
				$.responsive = function(option) {
					//현재상태가 있을경우
					if(_option.nowState && _option.nowState.length) {
						_$target.removeClass(_option.nowState.join(" "));
					}

					//기본객체 등록
					_option = _getDefaultObject();

					//실행등록
					_option.isRun = true;

					//브라우저, 플랫폼 클래스 추가
					_$target.addClass(_option.browser + " " + _option.platform);
					
					//option이 객체가 아닐경우
					if(_typeOf(option) != "object") {
						option = {};
					}

					//ie7, ie8 객체
					if(_typeOf(option.lowIE) != "object") {
						option.lowIE = {};
					}

					//option.lowIE.state 형태검사
					option.lowIE.stateType = _typeOf(option.lowIE.state);
					
					//option.lowIE.state가 배열 또는 문자이면
					if(option.lowIE.stateType == "array" || option.lowIE.stateType == "string") {
						option.lowIE.state = _removeDuplicate(option.lowIE.state);
					}else{
						option.lowIE.state = [];
					}

					//option.range가 없으면
					if(_typeOf(option.range) != "object") {
						option.range = {};
					}
					
					//리사이즈가 끝나고 함수실행 간격
					option.interval = 250;

					//분기에 들어온 프로퍼티 명
					option.enter = [];

					//화면범위로 만든 코드
					option.rangeCode = "";

					//화면범위 프로퍼티 명
					option.rangeProperty = [];

					//option.rangeCode작성 시작

					//option.range에 적은 값을 기준으로 자바스크립트 코드 생성
					for(option.i in option.range) {
						//소문자 변경
						option.i = option.i.toLowerCase();

						//필터링
						if(option.i.substr(-7) != "resized" && option.i.substr(-4) != "none" && option.i.substr(-3) != "all" && option.i != "mobile" && option.i != "pc" && option.i != "scrollbar" && option.i != "ie7" && option.i != "ie8" && option.i != "ie9" && option.i != "ie10" && option.i != "ie11" && option.i != "edge" && option.i != "whale" && option.i != "samsung" && option.i != "opera" && option.i != "chrome" && option.i != "firefox" && option.i != "safari" && option.i != "unknown") {
							//프로퍼티명 기입
							option.rangeProperty.push(option.i);
							
							//객체가 아닐경우
							if(_typeOf(option.range[option.i]) != "object") {
								option.range[option.i] = {};
							}

							//값이 없거나 문자일 경우
							if(_typeOf(option.range[option.i].from) != "number") {
								option.range[option.i].from = 9999;	
							}

							//값이 없거나 문자일 경우
							if(_typeOf(option.range[option.i].to) != "number") {
								option.range[option.i].to = 0;
							}

							option.rangeCode += "\tif(_option.windowWidth <= " + option.range[option.i].from + " && _option.windowWidth >= " + option.range[option.i].to + ") {\n";
							option.rangeCode += "\t\toption.enter.push(\"" + option.i + "\");\n";
							option.rangeCode += "\t}else{\n";
							option.rangeCode += "\t\t_option.exit.push(\"" + option.i + "\");\n";
							option.rangeCode += "\t}\n\n";
						}
					}

					option.rangeCode += "}";

					//필터링된 프로퍼티명에서 option.lowIE.state에 이름이 있는지 확인해서 없으면 제거
					option.i = 0;

					for(; option.i < option.lowIE.state.length; option.i++) {
						if($.inArray(option.lowIE.state[option.i], option.rangeProperty) == -1) {
							option.lowIE.state[option.i] = "none";
						}
					}

					//ie7 && ie8에서 적용할 상태가 있을경우
					if(option.lowIE.state.length) {
						option.lowIE.state = option.lowIE.state.join(", ").replace(/, none/g, "").split(", ");
						_option.lowIERun = true;
					}

					//결합
					option.rangeCode = "option.enter = [];\n_option.exit = [];\n\nif(_option.lowIERun && _option.isLowIE) {\n\toption.enter = option.lowIE.state;\n}else{\n" + option.rangeCode;

					//option.rangeCode작성 끝

					_$window.off("resize.responsive").on("resize.responsive", function(event) {
						//화면이 변경되었는지 확인하는 변수
						_option.isResize = true;
						_option.isScreenWidthChange = false;
						_option.isScreenHeightChange = false;
						_option.isScreenWidthAndHeightChange = false;
						_option.isScreenChange = false;

						//화면정보 갱신
						_setScreenInfo();

						//기존의 스크린 넓이와 새로부여받은 스크린 넓이가 같은지 확인
						if(_option.windowWidth != option.windowWidth) {
							option.windowWidth = _option.windowWidth;
							_option.isScreenWidthChange = true;
						}

						//기존의 스크린 높이와 새로부여받은 스크린 높이가 같은지 확인
						if(_option.windowHeight != option.windowHeight) {
							option.windowHeight = _option.windowHeight;
							_option.isScreenHeightChange = true;
						}

						//기존 스크린 넓이와 높이가 둘다 변경되었을때
						if(_option.isScreenWidthChange && _option.isScreenHeightChange) {
							_option.isScreenWidthAndHeightChange = true;
						}

						//스크린의 넓이값 또는 세로값이 변경되었을때
						if(_option.isScreenWidthChange || _option.isScreenHeightChange) {
							_option.isScreenChange = true;
						}

						//스크린의 넓이값이 변경되었을 때
						if(_option.isScreenWidthChange) {
							//전체범위 함수 호출
							_callEvent("all");

							//범위실행
							eval(option.rangeCode);

							//상태적용, 이벤트 호출
							if(option.enter.length) {
								_setState(option.enter);
							}else{
								_setState("none");
							}

							//돌던 setTimeout이 있으면 중단
							if(option.timer) {
								clearTimeout(option.timer);
								option.timer = 0;
							}
							
							//setTimeout 재등록
							option.timer = setTimeout(function() {
								//화면정보 갱신
								_setScreenInfo();

								//전체범위 함수 호출
								_callEvent("allResized");
								
								//상태적용, 이벤트 호출
								if(option.enter.length) {
									_callEvent((option.enter.join("AllResized, ") + "AllResized").split(", "));
								}else{
									_callEvent("noneAllResized");
								}
							}, option.interval);
						}

						//화면이 변경되었는지 확인하는 변수 초기화
						_option.isResize = false;
						_option.isScreenWidthChange = false;
						_option.isScreenHeightChange = false;
						_option.isScreenWidthAndHeightChange = false;
						_option.isScreenChange = false;
					}).triggerHandler("resize.responsive");

					//객체 반환
					return _$target;
				};

				/**
				 * @name 반응형 플러그인 소멸
				 * @since 2017-12-06
				 * @return {boolean}
				 */
				$.responsive.destroy = function() {
					var result = false;
					
					//플러그인을 실행중일때
					if(_option.isRun) {
						_$window.off("resize.responsive");
						_$target.removeClass("scrollbar " + _option.browser + " " + _option.platform + " " + _option.nowState.join(" "));
						_option.isRun = false;
						$("body > #responsive_scrollbar").remove();
						this.setting = undefined;
						result = true;
					}

					return result;
				};

				//사용자 객체 제공
				$.responsive.setting = _getDefaultObject();
			});
		})(jQuery);
	}else{
		throw "제이쿼리가 없습니다.";
	}
}catch(e) {
	console.error(e);
}