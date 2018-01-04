"use strict";

/**
 * @name responsive
 * @author JungHyunKwon
 * @since 2017-12-06
 * @version 1.0
 */
try {
	/**
	 * @name JSON psrse, stringify
	 * @link {https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/JSON}
	 */
	this.JSON = this.JSON || {
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
	 * @name 콘솔
	 * @description 콘솔객체가 없을경우 에뮬레이션이 아닌 실제 인터넷 익스플로러9이하에서 콘솔로그 버그를 막을 수 있습니다. 막지 않고 콘솔을 쓸경우 모든 스크립팅은 중단 됩니다. 대체콘솔은 console.comment에 담겨있습니다.
	 * @since 2017-10-11
	 */
	this.console = this.console || undefined;

	if(!console) {
		console = {
			method : ["assert",
					   "clear",
					   "count",
					   "debug",
					   "dir",
					   "dirxml",
					   "error",
					   "exception",
					   "group",
					   "groupCollapsed",
					   "groupEnd",
					   "info",
					   "log",
					   "markTimeline",
					   "profile",
					   "profileEnd",
					   "table",
					   "time",
					   "timeEnd",
					   "timeStamp",
					   "trace",
					   "warn"],
			comment : []
		};

		for(var i = 0; i < console.method.length; i++) {
			if(!console[console.method[i]]) {
				console[console.method[i]] = function(comment) {
					this.comment.push(comment);
				};
			}
		}
	}

	//제이쿼리가 있는지 확인
	this.jQuery = this.jQuery || undefined;

	if(jQuery) {
		//$ 중첩 방지
		(function($) {
			var _$window = $(window),
				_connectedState = _getConnectedState(),
				_setting = {};

			/**
			 * @name 변수 형태
			 * @param {*} variable
			 * @return {string}
			 */
			function _typeOf(variable) {
				var result = "";
				
				//undefined일때(ie7, ie8에서 찾지 못함)
				if(variable === undefined) {
					result = "undefined";
				
				//NaN일때(숫자로 처리되서 따로 처리함)
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
				
				//객체일때
				if(_typeOf(object) == "object") {
					result = JSON.parse(JSON.stringify(object));
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
				
				//platformCase에 platform이 있을때
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
				
				//문자 || 숫자 || 불린일때
				if(typeOf == "string" || typeOf == "number" || typeOf == "boolean") {
					name = $.makeArray(name);
				}else if(typeOf != "array") {
					name = [];
				}

				for(var i = 0; i < name.length; i++) {
					//result값에 값이 없으면 집어넣는다.
					if($.inArray(name[i], result) == -1) {
						result.push(name[i]);
					}
				}

				return result;
			}

			$(function() {
				var _$target = $("body"),
					_initialSetting = _getDefaultObject();

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
					var style = {
							visibility : "hidden",
							overflowX : "scroll",
							overflowY : "scroll",
							position : "absolute",
							top : "-100px",
							left : "-100px",
							zIndex : "-1",
							width : "100px",
							height : "100px"
						},
						$body = $("body"),
						$scrollbar = $body.children("#responsive_scrollbar"),
						result = ($scrollbar.length) ? $scrollbar.removeAttr("style").css(style)[0].offsetWidth - $scrollbar[0].clientWidth : 0;

					//스크롤바 객체가 있을때
					if(!$scrollbar.length) {
						$body.append("<div id=\"responsive_scrollbar\">&nbsp;</div>");
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
						screenWidth = (hasScrollbar.vertical) ? _$window.width() + scrollbarWidth : _$window.width(),
						screenHeight = (hasScrollbar.horizontal) ? _$window.height() + scrollbarWidth : _$window.height(),
						result = {
							isRun : false,
							range : {},
							rangeProperty : [],
							exit : [],
							lowIE : {
								is : _connectedState.browser == "ie7" || _connectedState.browser == "ie8",
								property : [],
								run : undefined
							},
							nowState : [],
							prevState : [],
							scrollbarWidth : scrollbarWidth,
							orientation : (screenWidth == screenHeight) ? "square" : (screenWidth > screenHeight) ? "landscape" : "portrait",
							screenWidth : screenWidth,
							screenHeight : screenHeight,
							loadedScreenWidth : screenWidth,
							loadedScreenHeight : screenHeight,
							browser : _connectedState.browser,
							platform : _connectedState.platform,
							hasVerticalScrollbar : hasScrollbar.vertical,
							hasHorizontalScrollbar : hasScrollbar.horizontal,
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
						setState = [],
						nowState = [];

					//중복제거
					state = _removeDuplicate(state);

					for(var i = 0; i < state.length; i++) {
						//적용시킬 상태가 있을때
						if($.inArray(state[i], _setting.nowState) == -1) {
							setState.push(state[i]);
						}else{
							nowState.push(state[i]);
						}
					}

					//적용시킬 상태가 있을때
					if(setState.length || nowState.length != _setting.nowState.length) {
						result = true;
					}

					if(result) {
						//현재상태 클래스 제거
						_$target.removeClass(_setting.nowState.join(" "));

						//새로운상태 클래스 추가
						_$target.addClass(state.join(" "));
						
						//이전상태 추가
						_setting.prevState = _setting.nowState;

						//새로운상태 추가
						_setting.nowState = state;

						//console에 상태표기
						console.log("현재상태 : " + state.join(", "));
					}

					//함수실행
					_callEvent((state.join("All, ") + "All").split(", "));
					
					//위에서 처리하고나서 불러야 해서 따로처리함
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
						setting : _freeObject(_setting)
					};

					//중복제거
					state = _removeDuplicate(state);
					
					//전역객체 갱신
					$.responsive.setting = event.setting;

					for(var i = 0; i < state.length; i++) {
						//분기값 적용
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
					var hasScrollbar = _hasScrollbar(_$target[0]);

					//가로, 세로 스크롤바 확인
					_setting.hasVerticalScrollbar = hasScrollbar.vertical;
					_setting.hasHorizontalScrollbar = hasScrollbar.horizontal;
					
					//화면이 변경되었는지 확인하는 변수
					_setting.isResize = false;
					_setting.isScreenWidthChange = false;
					_setting.isScreenHeightChange = false;
					_setting.isScreenWidthAndHeightChange = false;
					_setting.isScreenChange = false;

					//스크롤바 넓이
					_setting.scrollbarWidth = _getScrollbarWidth();

					//브라우저 스크롤바가 있을때
					if(_setting.scrollbarWidth) {
						_$target.addClass("scrollbar");
					}else{
						_$target.removeClass("scrollbar");
					}

					//화면 넓이, 높이
					_setting.screenWidth = _$window.width();
					_setting.screenHeight = _$window.height();

					//세로 스크롤바가 있을때
					if(_setting.hasVerticalScrollbar) {
						_setting.screenWidth += _setting.scrollbarWidth;
					}

					//가로 스크롤바가 있을때
					if(_setting.hasHorizontalScrollbar) {
						_setting.screenHeight += _setting.scrollbarWidth;
					}
					
					//orientation
					_$target.removeClass(_setting.orientation);

					if(_setting.screenWidth == _setting.screenHeight) {
						_setting.orientation = "square";
					}else if(_setting.screenWidth > _setting.screenHeight) {
						_setting.orientation = "landscape";
					}else{
						_setting.orientation = "portrait";
					}
					
					_$target.addClass(_setting.orientation);

					return _setting;
				}

				/**
				 * @param {object} option {range : {# : {from : n, to : n}}, lowIE : {property : ["#"]}}
				 * @return {object}
				 */
				$.responsive = function(option) {
					//현재상태가 있을경우
					if(_setting.nowState && _setting.nowState.length) {
						_$target.removeClass(_setting.nowState.join(" "));
					}

					//기본객체
					_setting = _getDefaultObject();

					//실행등록
					_setting.isRun = true;

					//브라우저, 플랫폼 클래스 추가
					_$target.addClass(_setting.browser + " " + _setting.platform);
					
					//객체가 아닐때
					if(_typeOf(option) != "object") {
						option = {};
					}

					//객체가 아닐때
					if(_typeOf(option.lowIE) != "object") {
						option.lowIE = {};
					}

					//option.lowIE.property 형태검사
					option.lowIEPropertyType = _typeOf(option.lowIE.property);
					
					//배열 또는 문자일때
					if(option.lowIEPropertyType == "array" || option.lowIEPropertyType == "string") {
						option.lowIE.property = _removeDuplicate(option.lowIE.property);
					}else{
						option.lowIE.property = [];
					}
					
					//리사이즈 종료 간격
					option.interval = 250;

					//객체가 아닐때
					if(_typeOf(option.range) != "object") {
						option.range = {};
					}
					
					//option.range에 적은 값을 기준으로 자바스크립트 코드 생성
					option.rangeCode = "option.enter = [];\n_setting.exit = [];\n\n";
					option.rangeCode += "if(!_setting.lowIE.run && _setting.lowIE.is) {\n\toption.enter = _setting.lowIE.property;\n}else{\n";
					option.rangeFilter = [];
					option.rangeProperty = [];

					for(option.i in option.range) {
						//필터링
						if(option.i != "square" && option.i != "portrait" && option.i != "landscape" && option.i.substr(-3) != "All" && option.i.substr(-7) != "Resized" && option.i != "none" && option.i.substr(-3) != "all" && option.i != "mobile" && option.i != "pc" && option.i != "scrollbar" && option.i != "ie7" && option.i != "ie8" && option.i != "ie9" && option.i != "ie10" && option.i != "ie11" && option.i != "edge" && option.i != "opera" && option.i != "chrome" && option.i != "firefox" && option.i != "safari" && option.i != "unknown") {
							//객체검사
							option.hasRangeHorizontal = (_typeOf(option.range[option.i].horizontal) == "object");
							option.hasRangeVertical = (_typeOf(option.range[option.i].vertical) == "object");
							
							//horizontal 또는 vertical이 객체일때
							if(option.hasRangeHorizontal || option.hasRangeVertical) {
								//horizontal이 객체이면서 from, to 프로퍼티가 숫자일때
								if(option.hasRangeHorizontal && _typeOf(option.range[option.i].horizontal.from) == "number" && _typeOf(option.range[option.i].horizontal.to) == "number") {
									option.rangeFilter.push(true);
								}else{
									option.rangeFilter.push(false);
								}
								
								//vertical이 객체이면서 from, to 프로퍼티가 숫자일때
								if(option.hasRangeVertical && _typeOf(option.range[option.i].vertical.from) == "number" && _typeOf(option.range[option.i].vertical.to) == "number") {
									option.rangeFilter.push(true);
								}else{
									option.rangeFilter.push(false);
								}
								
								//horizontal이 객체이면서 from, to 프로퍼티가 숫자이거나 vertical이 객체이면서 from, to 프로퍼티가 숫자일때
								if(option.rangeFilter[0] || option.rangeFilter[1]) {
									option.rangeCode += "\tif(";
									
									//horizontal이 객체이면서 from, to 프로퍼티가 숫자일때
									if(option.rangeFilter[0]) {
										option.rangeCode += "_setting.screenWidth <= " + option.range[option.i].horizontal.from + " && _setting.screenWidth >= " + option.range[option.i].horizontal.to;
									}
									
									//vertical이 객체이면서 from, to 프로퍼티가 숫자일때
									if(option.rangeFilter[1]) {
										//가로 객체가 있을경우
										if(option.hasRangeHorizontal) {
											option.rangeCode += " && ";
										}

										option.rangeCode += "_setting.screenHeight <= " + option.range[option.i].vertical.from + " && _setting.screenHeight >= " + option.range[option.i].vertical.to;
									}

									option.rangeCode += ") {\n";
									option.rangeCode += "\t\toption.enter.push(\"" + option.i + "\");\n";
									option.rangeCode += "\t}else{\n";
									option.rangeCode += "\t\t_setting.exit.push(\"" + option.i + "\");\n";
									option.rangeCode += "\t}\n\n";

									//프로퍼티명 기입
									option.rangeProperty.push(option.i);
								}else{
									//프로퍼티 삭제
									delete option.range[option.i];
								}

								//초기화
								option.rangeFilter = [];
							}
						}else{
							//프로퍼티 삭제
							delete option.range[option.i];
						}
					}

					option.rangeCode = option.rangeCode.replace(/\n$/, "");
					option.rangeCode += "}";
					_setting.range = option.range;
					_setting.rangeProperty = option.rangeProperty;
					//option.rangeCode작성 끝

					//필터링된 프로퍼티명에서 option.lowIE.property에 이름이 있는지 확인해서 없으면 제거
					option.i = 0;
					option.lowIEFilter = [];

					for(; option.i < option.lowIE.property.length; option.i++) {
						if($.inArray(option.lowIE.property[option.i], option.rangeProperty) > -1) {
							option.lowIEFilter.push(option.lowIE.property[option.i]);
						}
					}
					
					if(option.lowIEFilter.length) {
						option.lowIE.run = false;
					}else{
						option.lowIE.run = true;
					}

					_setting.lowIE.run = option.lowIE.run;

					option.lowIE.property = option.lowIEFilter;
					_setting.lowIE.property = option.lowIE.property;

					_$window.off("resize.responsive").on("resize.responsive", function(event) {
						//화면정보 갱신
						_setScreenInfo();
						
						//리사이즈 중
						_setting.isResize = true;

						//기존의 스크린 넓이와 새로부여받은 스크린 넓이가 같은지 확인
						if(_setting.screenWidth != option.screenWidth) {
							option.screenWidth = _setting.screenWidth;
							_setting.isScreenWidthChange = true;
						}

						//기존의 스크린 높이와 새로부여받은 스크린 높이가 같은지 확인
						if(_setting.screenHeight != option.screenHeight) {
							option.screenHeight = _setting.screenHeight;
							_setting.isScreenHeightChange = true;
						}

						//기존 스크린 넓이와 높이가 둘다 변경되었을때
						if(_setting.isScreenWidthChange && _setting.isScreenHeightChange) {
							_setting.isScreenWidthAndHeightChange = true;
						}

						//스크린의 넓이값 또는 세로값이 변경되었을때
						if(_setting.isScreenWidthChange || _setting.isScreenHeightChange) {
							_setting.isScreenChange = true;
						}

						//trigger로 호출하였을때
						if(event.isTrigger) {
							_setting.isResize = false;
							_setting.isScreenWidthChange = false;
							_setting.isScreenHeightChange = false;
							_setting.isScreenWidthAndHeightChange = false;
							_setting.isScreenChange = false;
						}

						//스크린의 넓이 또는 높이가 변경되었거나 trigger로 호출하였을때
						if(_setting.isScreenChange || event.isTrigger) {
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
					if(_setting.isRun) {
						_$window.off("resize.responsive");
						_$target.removeClass("scrollbar " + _setting.browser + " " + _setting.platform + " " + _setting.nowState.join(" ") + " " + _setting.orientation);
						$("body > #responsive_scrollbar").remove();
						this.setting = _freeObject(_initialSetting);
						result = true;
					}

					return result;
				};

				//전역객체
				$.responsive.setting = _freeObject(_initialSetting);
			});
		})(jQuery);
	}else{
		throw "제이쿼리가 없습니다.";
	}
}catch(e) {
	console.error(e);
}