'use strict';

/**
 * @author JungHyunKwon
 * @version 1.0
 */
try {
	//제이쿼리가 있는지 확인
	if(typeof window.jQuery === 'function') {
		//$ 중첩 방지
		(function($) {
			var _$window = $(window),
				_connectedState = _getConnectedState(),
				_setting = {},
				_consoleType = _getTypeof(window.console),
				_cookie = {
					/**
					 * @name 쿠키 사용가능 여부
					 * @since 2017-01-16
					 */
					support : navigator.cookieEnabled,

					/**
					 * @name 쿠키 생성
					 * @since 2017-01-16
					 * @param {string} name
					 * @param {string} value
					 * @param {number} day
					 * @return {boolean}
					 */
					set : function(name, value, day) {
						var date = new Date(),
							result = false;

						if(!day) {
							day = -1;
						}

						value = escape(value);
						date.setDate(date.getDate() + day);
						
						document.cookie = name + '=' + value + '; expires=' + date.toUTCString() + '; path=/;';
						
						//쿠키생성 후 확인해서 있으면
						if(this.get(name)) {
							result = true;
						}

						return result;
					},

					/**
					 * @name 쿠키값 얻기
					 * @since 2017-01-16
					 * @param {string} name
					 * @return {string}
					 */
					get : function(name) {
						var cookie = document.cookie.split(';'),
							result = 'none';

						for(var i = 0, cookieLength = cookie.length; i < cookieLength; i++) {
							while(cookie[i].charAt(0) == ' ') {
								cookie[i] = cookie[i].substring(1);
								break;
							}

							if(cookie[i].indexOf(name) > -1) {
								result = unescape(cookie[i].substring(name.length + 1, cookie[i].length));
								break;
							}
						}

						return result;
					}
				};

			/**
			 * @name 형태얻기
			 * @since 2017-12-18
			 * @param {*} value
			 * @return {string}
			 */
			function _getTypeof(value) {
				var result = 'none';
				
				//매개변수가 있을때
				if(arguments.length) {
					result = Object.prototype.toString.call(value).toLowerCase().replace('[object ', '').replace(']', '');

					//undefined일때(ie7, ie8에서 찾지 못함)
					if(value === undefined) {
						result = 'undefined';
					
					//NaN일때(숫자로 처리되서 따로 처리함)
					}else if(result === 'number' && isNaN(value)) {
						result = 'NaN';
					
					//Infinity일때(숫자로 처리되서 따로 처리함)
					}else if(result === 'number' && !isFinite(value)) {
						if(value.toString() === '-Infinity') {
							result = '-Infinity';
						}else{
						    result = 'Infinity';
						}

					//document일때
					}else if(result.substr(-8) === 'document') {
						result = 'document';

					//엘리먼트일때
					}else if(result.substr(-7) === 'element') {
						result = 'element';

					//제이쿼리 객체일때
					}else if(typeof window.jQuery === 'function' && value instanceof window.jQuery) {
						var iCount = 0;

						for(var i in value) {
							var iType = _getTypeof(value[i]);

							if((iType === 'window' || iType === 'document' || iType === 'element') && !isNaN(Number(i))) {
								iCount++;
							}
						}
                        
						//제이쿼리 엘리먼트일때
						if(value.length && value.length === iCount) {
							result = 'jQueryElement';
						}else{
							result = 'jQueryObject';
						}
					
					//Invalid Date일때(date로 처리되서 따로 처리함)
					}else if(result === 'date' && isNaN(new Date(value))) {
						result = 'Invalid Date';
					
					//class일때
					}else if(result === 'function' && /^class\s/.test(value.toString())) {
						result = 'class';
					}
				}

				return result;
			}

			/**
			 * @name 콘솔오류방지
			 * @description 콘솔객체가 없을경우 에뮬레이션이 아닌 실제 인터넷 익스플로러9이하에서 콘솔로그 버그를 막을 수 있습니다. 막지 않고 콘솔을 쓸경우 모든 스크립팅은 중단 됩니다. 대체콘솔은 console.comment에 담겨있습니다.
			 * @since 2017-10-11
			 */
			if(_consoleType !== 'object' && _consoleType !== 'console') {
				window.console = {
					method : [
						'assert',
						'clear',
						'count',
						'debug',
						'dir',
						'dirxml',
						'error',
						'exception',
						'group',
						'groupCollapsed',
						'groupEnd',
						'info',
						'log',
						'markTimeline',
						'profile',
						'profileEnd',
						'table',
						'time',
						'timeEnd',
						'timeStamp',
						'trace',
						'warn'
					],
					comment : []
				};

				for(var i = 0, consoleMethodLength = window.console.method.length; i < consoleMethodLength; i++) {
					if(_getTypeof(window.console[window.console.method[i]]) !== 'function') {
						window.console[window.console.method[i]] = function() {
							var result = [],
								argumentsLength = arguments.length;
                        
							if(argumentsLength > 1) {
								for(var i = 0; i < argumentsLength; i++) {
									result.push(arguments[i]);
								}
							}else if(argumentsLength === 1) {
								result = arguments[0];
							}
                            
							if(argumentsLength) {
							    this.comment.push(result);
							}

							return result;
						};
					}
				}
			}

			/**
			 * @name 객체 복사
			 * @since 2017-12-06
			 * @param {object} value
			 * @return {object}
			 */
			function _copyObject(value) {
				return (_getTypeof(value) === 'object') ? $.extend(true, {}, value) : value;
			}

			/**
			 * @name 접속상태 가져오기
			 * @since 2017-12-06
			 * @return {object}
			 */
			function _getConnectedState() {
				var userAgent = navigator.userAgent.toLowerCase(),
					platform = navigator.platform.toLowerCase(),
					platformCase = ['win16', 'win32', 'win64', 'mac', 'linux'],
					result = {};

				if(userAgent.indexOf('msie 7.0') > -1) {
					result.browser = 'ie7';
				}else if(userAgent.indexOf('msie 8.0') > -1) {
					result.browser = 'ie8';
				}else if(userAgent.indexOf('msie 9.0') > -1) {
					result.browser = 'ie9';
				}else if(userAgent.indexOf('msie 10.0') > -1) {
					result.browser = 'ie10';
				}else if(userAgent.indexOf('trident/7.0') > -1) {
					result.browser = 'ie11';
				}else if(userAgent.indexOf('edge') > -1) {
					result.browser = 'edge';
				}else if(userAgent.indexOf('opr') > -1) {
					result.browser = 'opera'; 
				}else if(userAgent.indexOf('chrome') > -1) {
					result.browser = 'chrome';
				}else if(userAgent.indexOf('firefox') > -1) {
					result.browser = 'firefox'; 
				}else if(userAgent.indexOf('safari') > -1) {
					result.browser = 'safari';
				}else{
					result.browser = 'unknown';
				}
				
				//platformCase에 platform이 있을때
				if($.inArray(platform, platformCase) > -1) {
					result.platform = 'pc';
				}else{
					result.platform = 'mobile';
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
				var result = [];
				
				//배열이 아닐때
				if(_getTypeof(name) !== 'array') {
					name = $.makeArray(name);
				}

				for(var i = 0, nameLength = name.length; i < nameLength; i++) {
					//result값에 값이 없으면 집어넣는다.
					if($.inArray(name[i], result) === -1) {
						result.push(name[i]);
					}
				}

				return result;
			}
			
			/**
			 * @name 문자열 공백 제거
			 * @since 2017-12-06
			 * @param {string} value
			 * @return {string}
			 */
			function _removeBlank(value) {
				var result = "";

				if(_getTypeof(value) === 'string') {
					result = value.replace(/\s/, '');
				}
				
				return result;
			}
			
			/**
			 * @name state에 대한 쿠키얻기
			 * @since 2017-12-06
			 * @return {array}
			 */
			function _getStateCookie() {
				return $.map(_removeDuplicate(_removeBlank(_cookie.get('state')).split(',')), function(value, index) {
					if($.inArray(value, _setting.rangeProperty) > -1) {
						return value;
					}
				});
			}

			$(function() {
				var _$target = $('body'),
					_initialSetting = _getDefaultObject();

				/**
				 * @name 스크롤바 존재여부
				 * @since 2017-12-06
				 * @param {element || jQueryElement} object
				 * @return {object}
				 */
				function _hasScrollbar(object) {
					var $this,
						objectType = _getTypeof(object),
						result = {
							horizontal : false,
							vertical : false
						};
					
					if(objectType === 'element') {
						$this = $(object);
					}else if(objectType === 'jQueryElement') {
						$this = object;
					}

					if(_getTypeof($this) === 'jQueryElement') {
						var $parents = $this.add($this.parents()),
							horizontal = [],
							vertical = [];
						
						$parents.each(function(index, element) {
							var $this = $(element),
								overflow = {
									x : $this.css('overflow-x'),
									y : $this.css('overflow-y')
								};

							//매핑한 객체의 넓이가 넘치면서 overflow:hidden이 아니거나 스크롤을 강제 지정한경우 스크롤이 있는걸로 간주
							if((element.scrollWidth > element.clientWidth && overflow.x !== 'hidden') || overflow.x === 'scroll') {
								horizontal.push(true);
							}else{
								horizontal.push(false);
							}
							
							//매핑한 객체의 높이가가 넘치면서 overflow:hidden이 아니거나 스크롤을 강제 지정한경우 스크롤이 있는걸로 간주
							if((element.scrollHeight > element.clientHeight && overflow.y !== 'hidden') || overflow.y === 'scroll') {
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
							visibility : 'hidden',
							overflowX : 'scroll',
							overflowY : 'scroll',
							position : 'absolute',
							top : -100,
							left : -100,
							zIndex : -1,
							width : 100,
							height : 100
						},
						$body = $('body'),
						$scrollbar = $body.children('#responsive_scrollbar'),
						result = ($scrollbar.length) ? $scrollbar.removeAttr('style').css(style)[0].offsetWidth - $scrollbar[0].clientWidth : 0;

					//스크롤바 객체가 없을때
					if(!$scrollbar.length) {
						$body.append('<div id="responsive_scrollbar">&nbsp;</div>');
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
						screenHeight = (hasScrollbar.horizontal) ? _$window.height() + scrollbarWidth : _$window.height();

					return _copyObject({
						isRun : false,
						range : {},
						rangeProperty : [],
						exit : [],
						lowIE : {
							is : _connectedState.browser === 'ie7' || _connectedState.browser === 'ie8',
							property : [],
							run : true
						},
						nowState : [],
						prevState : [],
						scrollbarWidth : scrollbarWidth,
						orientation : (screenWidth === screenHeight) ? 'square' : (screenWidth > screenHeight) ? 'landscape' : 'portrait',
						screenWidth : screenWidth,
						screenHeight : screenHeight,
						loadedScreenWidth : screenWidth,
						loadedScreenHeight : screenHeight,
						browser : _connectedState.browser,
						platform : _connectedState.platform,
						hasVerticalScrollbar : hasScrollbar.vertical,
						hasHorizontalScrollbar : hasScrollbar.horizontal,
						isResize : false,
						triggerType : '',
						isScreenChange : false,
						isScreenWidthChange : false,
						isScreenHeightChange : false,
						isScreenWidthAndHeightChange : false,
						inheritClass : {
							property : [],
							is : false	
						}
					});
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
						nowState = [],
						inheritClass = [],
						stateCookie = _getStateCookie(),
						stateLength,
						i;

					//중복제거
					state = _removeDuplicate(state);

					//적용시킬 쿠키가 있을때
					if(stateCookie.length) {
						state = stateCookie;
					}
						
					stateLength = state.length;

					for(i = 0; i < stateLength; i++) {
						//적용시킬 상태가 있을때
						if($.inArray(state[i], _setting.nowState) === -1) {
							setState.push(state[i]);
						}else{
							nowState.push(state[i]);
						}
					}

					//적용시킬 상태가 있을때
					if(this === 'outer' || setState.length || nowState.length !== _setting.nowState.length) {
						result = true;
					}

					if(result) {
						//현재상태 클래스 제거
						_$target.removeClass(_setting.nowState.join(' '));

						//클래스 상속 옵션을 허용했을 때
						if(_setting.inheritClass.is) {
							var nowStateLastIndex = $.inArray(state[state.length - 1], _setting.rangeProperty);

							//상속 클래스 제거
							if(_setting.inheritClass.property.length) {
								_$target.removeClass(_setting.inheritClass.property.join(' '));
							}

							for(i = 0; i < nowStateLastIndex; i++) {
								//현재상태에 없을때
								if($.inArray(_setting.rangeProperty[i], state) === -1) {
									inheritClass.push(_setting.rangeProperty[i]);
								}
							}

							//상속 클래스 추가
							if(inheritClass.length) {
								_$target.addClass(inheritClass.join(' '));
							}
							
							//상속된 프로퍼티명 추가
							_setting.inheritClass.property = inheritClass;
						}

						//새로운상태 클래스 추가
						_$target.addClass(state.join(' '));

						//이전상태 추가
						_setting.prevState = _setting.nowState;

						//새로운상태 추가
						_setting.nowState = state;

						//console에 상태표기
						console.log('현재상태 : ' + state.join(', '));
					}

					//함수실행
					_callEvent((state.join('All, ') + 'All').split(', '));
					
					//위에서 처리하고나서 불러야 해서 따로 처리함
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
					var event = $.Event('responsive', {
						setting : _copyObject(_setting)
					});

					//중복제거
					state = _removeDuplicate(state);
					
					//전역객체 갱신
					$.responsive.setting = event.setting;

					for(var i = 0, stateLength = state.length; i < stateLength; i++) {
						//분기값 적용
						event.state = state[i];

						//모든 이벤트 호출
						_$window.triggerHandler(event);

						//필터 이벤트 호출
						event.type = 'responsive:' + state[i];
						_$window.triggerHandler(event);
					}

					return event;
				}
				
				/**
				 * @name 화면정보 입력
				 * @since 2017-12-06
				 * @param {object} event
				 * @return {object}
				 */
				function _setScreenInfo(event) {
					var hasScrollbar = _hasScrollbar(_$target[0]);
					
					//객체가 아닐때
					if(_getTypeof(event) !== 'object') {
						event = {};
					}

					//트리거
					if(event.isTrigger === 2) {
						_setting.triggerType = 'triggerHandler';
					}else if(event.isTrigger === 3) {
						_setting.triggerType = 'trigger';
					}else{
						_setting.triggerType = '';
					}

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
						_$target.addClass('scrollbar');
					}else{
						_$target.removeClass('scrollbar');
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
					
					//방향
					_$target.removeClass(_setting.orientation);

					if(_setting.screenWidth === _setting.screenHeight) {
						_setting.orientation = 'square';
					}else if(_setting.screenWidth > _setting.screenHeight) {
						_setting.orientation = 'landscape';
					}else{
						_setting.orientation = 'portrait';
					}
					
					_$target.addClass(_setting.orientation);

					return _setting;
				}

				/**
				 * @name responsive
				 * @since 2017-12-06
				 * @param {object} option {range : {# : {from : n, to : n}}, lowIE : {property : ['#']}, inheritClass : boolean}
				 * @return {object}
				 */
				$.responsive = function(option) {
					//현재상태가 있을경우
					if(_getTypeof(_setting.nowState) === 'array' && _setting.nowState.length) {
						_$target.removeClass(_setting.nowState.join(' '));
					}

					//상속된 클래스가 있을경우
					if(_getTypeof(_setting.inheritClass) === 'object' && _getTypeof(_setting.inheritClass.property) === 'array' && _setting.inheritClass.property.length) {
						_$target.removeClass(_setting.inheritClass.property.join(' '));
					}

					//기본객체
					_setting = _getDefaultObject();

					//실행등록
					_setting.isRun = true;

					//브라우저, 플랫폼 클래스 추가
					_$target.addClass(_setting.browser + ' ' + _setting.platform);
					
					//객체가 아닐때
					if(_getTypeof(option) !== 'object') {
						option = {};
					}

					//객체가 아닐때
					if(_getTypeof(option.lowIE) !== 'object') {
						option.lowIE = {};
					}

					//option.lowIE.property 형태검사
					option.lowIEPropertyType = _getTypeof(option.lowIE.property);
					
					//배열 또는 문자일때
					if(option.lowIEPropertyType === 'array' || option.lowIEPropertyType === 'string') {
						option.lowIE.property = _removeDuplicate(option.lowIE.property);
					}else{
						option.lowIE.property = [];
					}
					
					//불린이 아닐경우
					if(_getTypeof(option.inheritClass) !== 'boolean') {
						option.inheritClass = false;
					}
					
					//클래스 상속여부
					_setting.inheritClass.is = option.inheritClass;

					//리사이즈 종료 간격
					option.interval = 250;

					//객체가 아닐때
					if(_getTypeof(option.range) !== 'object') {
						option.range = {};
					}
					
					//option.range에 적은 값을 기준으로 자바스크립트 코드 생성
					var i;

					option.rangeCode = 'option.enter = [];\n_setting.exit = [];\n\n';
					option.rangeCode += 'if(!_setting.lowIE.run && _setting.lowIE.is) {\n\toption.enter = _setting.lowIE.property;\n}else{\n';
					option.rangeFilter = [];
					option.rangeProperty = [];

					for(i in option.range) {
						//필터링
						if(i !== 'square' && i !== 'portrait' && i !== 'landscape' && i.substr(-3) !== 'All' && i.substr(-7) !== 'Resized' && i !== 'none' && i.substr(-3) !== 'all' && i !== 'mobile' && i !== 'pc' && i !== 'scrollbar' && i !== 'ie7' && i !== 'ie8' && i !== 'ie9' && i !== 'ie10' && i !== 'ie11' && i !== 'edge' && i !== 'opera' && i !== 'chrome' && i !== 'firefox' && i !== 'safari' && i !== 'unknown') {
							//객체검사
							option.hasRangeHorizontal = (_getTypeof(option.range[i].horizontal) === 'object');
							option.hasRangeVertical = (_getTypeof(option.range[i].vertical) === 'object');

							//horizontal 또는 vertical이 객체일때
							if(option.hasRangeHorizontal || option.hasRangeVertical) {
								//horizontal이 객체이면서 from, to 프로퍼티가 숫자일때
								if(option.hasRangeHorizontal && _getTypeof(option.range[i].horizontal.from) === 'number' && _getTypeof(option.range[i].horizontal.to) === 'number') {
									option.rangeFilter.push(true);
								}else{
									option.rangeFilter.push(false);
								}
								
								//vertical이 객체이면서 from, to 프로퍼티가 숫자일때
								if(option.hasRangeVertical && _getTypeof(option.range[i].vertical.from) === 'number' && _getTypeof(option.range[i].vertical.to) === 'number') {
									option.rangeFilter.push(true);
								}else{
									option.rangeFilter.push(false);
								}
								
								//horizontal이 객체이면서 from, to 프로퍼티가 숫자이거나 vertical이 객체이면서 from, to 프로퍼티가 숫자일때
								if(option.rangeFilter[0] || option.rangeFilter[1]) {
									option.rangeCode += '\tif(';
									
									//horizontal이 객체이면서 from, to 프로퍼티가 숫자일때
									if(option.rangeFilter[0]) {
										option.rangeCode += '_setting.screenWidth <= ' + option.range[i].horizontal.from + ' && _setting.screenWidth >= ' + option.range[i].horizontal.to;
									}
									
									//vertical이 객체이면서 from, to 프로퍼티가 숫자일때
									if(option.rangeFilter[1]) {
										//가로 객체가 있을경우
										if(option.hasRangeHorizontal) {
											option.rangeCode += ' && ';
										}

										option.rangeCode += '_setting.screenHeight <= ' + option.range[i].vertical.from + ' && _setting.screenHeight >= ' + option.range[i].vertical.to;
									}

									option.rangeCode += ') {\n';
									option.rangeCode += '\t\toption.enter.push("' + i + '");\n';
									option.rangeCode += '\t}else{\n';
									option.rangeCode += '\t\t_setting.exit.push("' + i + '");\n';
									option.rangeCode += '\t}\n\n';

									//프로퍼티명 기입
									option.rangeProperty.push(i);
								}else{
									//프로퍼티 삭제
									delete option.range[i];
								}

								//초기화
								option.rangeFilter = [];
							}
						}else{
							//프로퍼티 삭제
							delete option.range[i];
						}
					}

					option.rangeCode = option.rangeCode.replace(/\n$/, '');
					option.rangeCode += '}';
					_setting.range = option.range;
					_setting.rangeProperty = option.rangeProperty;
					//option.rangeCode작성 끝

					//필터링된 프로퍼티명에서 option.lowIE.property에 이름이 있는지 확인해서 없으면 제거
					var lowIEPropertyLength = option.lowIE.property.length;

					option.lowIEFilter = [];

					for(i = 0; i < lowIEPropertyLength; i++) {
						if($.inArray(option.lowIE.property[i], option.rangeProperty) > -1) {
							option.lowIEFilter.push(option.lowIE.property[i]);
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

					_$window.off('resize.responsive').on('resize.responsive', function(event) {
						//화면정보 갱신
						_setScreenInfo(event);

						//리사이즈 중
						_setting.isResize = true;

						//기존의 스크린 넓이와 새로부여받은 스크린 넓이가 같은지 확인
						if(_setting.screenWidth !== option.screenWidth) {
							option.screenWidth = _setting.screenWidth;
							_setting.isScreenWidthChange = true;
						}

						//기존의 스크린 높이와 새로부여받은 스크린 높이가 같은지 확인
						if(_setting.screenHeight !== option.screenHeight) {
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
						if(_setting.triggerType) {
							_setting.isResize = false;
							_setting.isScreenWidthChange = false;
							_setting.isScreenHeightChange = false;
							_setting.isScreenWidthAndHeightChange = false;
							_setting.isScreenChange = false;
						}

						//스크린의 넓이 또는 높이가 변경되었거나 trigger로 호출하였을때
						if(_setting.isScreenChange || _setting.triggerType) {
							//전체범위 함수 호출
							_callEvent('all');
							
							//범위실행
							eval(option.rangeCode);

							//상태적용, 이벤트 호출
							if(option.enter.length) {
								_setState(option.enter);
							}else{
								_setState('none');
							}

							//돌던 setTimeout이 있으면 중단
							if(option.timer) {
								clearTimeout(option.timer);
								option.timer = 0;
							}
							
							//setTimeout 재등록
							option.timer = setTimeout(function() {
								//화면정보 갱신
								_setScreenInfo(event);

								//전체범위 함수 호출
								_callEvent('allResized');

								//상태적용, 이벤트 호출
								if(option.enter.length) {
									_callEvent((option.enter.join('AllResized, ') + 'AllResized').split(', '));
								}else{
									_callEvent('noneAllResized');
								}
								
								//트리거 갱신
								if(_setting.triggerType) {
									_setting.triggerType = '';
									$.responsive.setting = _copyObject(_setting);
								}
							}, option.interval);
						}
					}).triggerHandler('resize.responsive');

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
						_$window.off('resize.responsive');
						_$target.removeClass('scrollbar ' + _setting.browser + ' ' + _setting.platform + ' ' + _setting.nowState.join(' ') + ' ' + _setting.orientation + ' ' + _setting.inheritClass.property.join(' '));
						$('body > #responsive_scrollbar').remove();
						this.setting = _copyObject(_initialSetting);
						result = true;
						_setting.isRun = false;
					}

					return result;
				};

				/**
				 * @description _setState 함수를 사용자에게 제공합니다.
				 */
				$.responsive.setState = function(state, day) {
					var stateType = _getTypeof(state),
						setState = [],
						result = false;
					
					//배열일때
					if(stateType === 'array') {
						for(var i = 0, stateLength = state.length; i < stateLength; i++) {
							if($.inArray(state[i], _setting.rangeProperty) > -1) {
								setState.push(state[i]);
							}
						}
					
					//문자열일때
					}else if(stateType === 'string' && $.inArray(state, _setting.rangeProperty) > -1) {
						setState.push(state);
					}

					//숫자일때
					if(_getTypeof(day) === 'number') {
						_cookie.set('state', setState.join(', '), day);
					}
					
					//적용시킬 상태가 있으면
					if(setState.length) {
						result = _setState.call('outer', setState);
					}

					return result;
				};
				
				/**
				 * @description _getStateCookie 함수를 사용자에게 제공합니다.
				 */
				$.responsive.getStateCookie = _getStateCookie;

				/**
				 * @description 기본 객체를 사용자에게 제공합니다.
				 */
				$.responsive.setting = _copyObject(_initialSetting);
			});
		})(jQuery);
	}else{
		throw '제이쿼리가 없습니다.';
	}
}catch(e) {
	console.error(e);
}