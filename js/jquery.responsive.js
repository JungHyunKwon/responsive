'use strict';

/**
 * @author JungHyunKwon
 * @version 1.0.0
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

						if(_getTypeof(name) === 'string' && _getTypeof(value) === 'string') {
							if(_getTypeof(day) !== 'number') {
								day = -1;
							}

							value = escape(value);
							date.setDate(date.getDate() + day);
							document.cookie = name + '=' + value + '; expires=' + date.toUTCString() + '; path=/;';

							//쿠키생성 후 확인해서 있으면
							if(this.get(name) !== 'none') {
								result = true;
							}
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
						
						if(_getTypeof(name) === 'string') {
							for(var i = 0, cookieLength = cookie.length; i < cookieLength; i++) {
								while(cookie[i].charAt(0) === ' ') {
									cookie[i] = cookie[i].substring(1);
									break;
								}

								if(cookie[i].indexOf(name) > -1) {
									result = unescape(cookie[i].substring(name.length + 1, cookie[i].length));
									break;
								}
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
						result = value.toString();

					//window일때
					}else if(value === window) {
						result = 'window';

					//document일때
					}else if(value === document) {
						result = 'document';

					//엘리먼트일때
					}else if(value.tagName) {
						result = 'element';

					//제이쿼리 객체일때
					}else if(typeof window.jQuery === 'function' && value instanceof window.jQuery) {
						var element = window.jQuery.map(value, function(element, index) {
								var elementType = _getTypeof(element);

								if(elementType === 'window' || elementType === 'document' || elementType === 'element') {
									return element;
								}
							}),
							elementLength = element.length;

						//제이쿼리 엘리먼트일때
						if(value.length === elementLength && elementLength) {
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
					//함수가아닐때
					if(_getTypeof(window.console[window.console.method[i]]) !== 'function') {
						window.console[window.console.method[i]] = function() {
							var result = [],
								argumentsLength = arguments.length;
                        
							//매개변수가 2개이상일때
							if(argumentsLength > 1) {
								for(var i = 0; i < argumentsLength; i++) {
									result.push(arguments[i]);
								}
							
							//매개변수가 한개일때
							}else if(argumentsLength === 1) {
								result = arguments[0];
							}
                           
							//console.comment에 기입
							if(argumentsLength) {
							    this.comment.push(result);
							}

							return result;
						};
					}
				}
			}

			/**
			 * @name 엘리먼트 인지 구하기
			 * @since 2017-12-06
			 * @param {window || document || element || jQueryElement} element
			 * @return {boolean}
			 */
			function _isElement(element) {
				var elementType = _getTypeof(element),
					result = false;

				if(elementType === 'window' || elementType === 'document' || elementType === 'element' || elementType === 'jQueryElement') {
					result = true;						
				}

				return result;
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
			 * @since 2017-12-06
			 * @param {array || string} value
			 * @return {array}
			 */
			function _removeDuplicate(value) {
				var result = [],
					valueType = _getTypeof(value);
				
				//문자형일때
				if(valueType === 'string') {
					value = value.split();
				
				//배열이 아닐때
				}else if(valueType !== 'array') {
					value = [];
				}

				for(var i = 0, valueLength = value.length; i < valueLength; i++) {
					//result값에 값이 없으면 집어넣는다.
					if($.inArray(value[i], result) === -1) {
						result.push(value[i]);
					}
				}

				return result;
			}
			
			/**
			 * @name 문자열 모든공백 제거
			 * @since 2017-12-06
			 * @param {string} value
			 * @return {string}
			 */
			function _removeBlank(value) {
				return (_getTypeof(value) === 'string') ? value.replace(/\s/g, '') : value;
			}
			
			/**
			 * @name state에 대한 쿠키얻기
			 * @since 2017-12-06
			 * @return {array}
			 */
			function _getStateCookie() {
				//state에 대한 쿠키를 얻어서 콤마 단위로 자르고 모든 공백을 없애고 중복제거를한다.
				return $.map(_removeDuplicate(_removeBlank(_cookie.get('state')).split(',')), function(value, index) {
					if($.inArray(value, _setting.rangeProperty) > -1) {
						return value;
					}
				});
			}

			$(function() {
				var _$body = $('body'),
					_initialSetting = _getDefaultObject();

				/**
				 * @name 스크롤바 넓이 구하기
				 * @since 2017-12-06
				 * @param {element || jQueryElement} element
				 * @return {array || number}
				 */
				function _getScrollbarWidth(element) {
					var $this = $(element),
						result = [];
					
					//요소가 없을때 대체
					if(!_isElement(element)) {
						$this = $('#scrollbar');
						
						//스크롤바 객체가 없을때
						if(!$this.length) {
							$this = $('<div id="scrollbar">&nbsp;</div>').appendTo('body');
						}
					}
					
					$this.each(function(index, element) {
						//NaN이 나오면 0으로 대체
						result.push(element.offsetWidth - element.clientWidth || 0);
					});
					
					//결과가 1개일때
					if(result.length === 1) {
						result = result[0];
					
					//결과가 없을때
					}else if(!result.length) {
						result = 0;
					}

					return result;
				}

				/**
				 * @name 스크롤바 존재여부
				 * @since 2017-12-06
				 * @param {element || jQueryElement} element
				 * @param {string} type
				 * @return {object || array}
				 */
				function _hasScrollbar(element, type) {
					var $this = $(element),
						result = [];
					
					//소문자 치환
					if(_getTypeof(type) === 'string') {
						type = type.toLowerCase();
					}
					
					//받은요소 갯수만큼 루프
					$this.each(function(index, element) {
						var $this = $(element),
							overflow = {
								x : $this.css('overflow-x'),
								y : $this.css('overflow-y')
							},
							scrollbar = {
								horizontal : false,
								vertical : false
							};
						
						//요소확인
						if(_isElement(element)) {
							//부모까지 조사시키는 타입이 들어왔을때
							if(type === 'parents') {
								scrollbar.horizontal = [];
								scrollbar.vertical = [];
								
								//상위부모 루핑
								$this.add($this.parents()).each(function(index, element) {
									var hasScrollbar = _hasScrollbar(element);

									scrollbar.horizontal.push(hasScrollbar.horizontal);
									scrollbar.vertical.push(hasScrollbar.vertical);
								});

								//가로스크롤바가 하나라도 있을경우
								if($.inArray(true, scrollbar.horizontal) > -1) {
									scrollbar.horizontal = true;
								}else{
									scrollbar.horizontal = false;
								}
								
								//세로스크롤바가 하나라도 있을경우
								if($.inArray(true, scrollbar.vertical) > -1) {
									scrollbar.vertical = true;
								}else{
									scrollbar.vertical = false;
								}
							}else{
								//clineWidth보다 scrollWidth가 더 크면서 overflow-x가 hidden이 아니거나 overflow-x가 scroll일때
								if((element.scrollWidth > element.clientWidth && overflow.x !== 'hidden') || overflow.x === 'scroll') {
									scrollbar.horizontal = true;
								}
								
								//clineHeight보다 scrollHeight가 더 크면서 overflow-y가 hidden이 아니거나 overflow-y가 scroll일때
								if((element.scrollHeight > element.clientHeight && overflow.y !== 'hidden') || overflow.y === 'scroll') {
									scrollbar.vertical = true;
								}
							}
						}
						
						//결과 기입
						result.push(scrollbar);
					});
					
					//결과가 1개일때
					if(result.length === 1) {
						result = result[0];
					
					//결과가 없을때
					}else if(!result.length) {
						result = 0;
					}

					return result;
				}

				/**
				 * @name 기본옵션 객체 얻기
				 * @since 2017-12-06
				 * @return {object}
				 */
				function _getDefaultObject() {
					var hasScrollbar = _hasScrollbar(_$body[0], 'parents'),
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
						isScreenWidthAndHeightChange : false
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
						_$body.removeClass(_setting.nowState.join(' '));

						//새로운상태 클래스 추가
						_$body.addClass(state.join(' '));

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
					var event = {
						setting : _copyObject(_setting)
					};

					//중복제거
					state = _removeDuplicate(state);
					
					//전역객체 갱신
					$.responsive.setting = event.setting;

					for(var i = 0, stateLength = state.length; i < stateLength; i++) {
						//분기값 적용
						event.state = state[i];

						//모든 이벤트 호출
						_$window.triggerHandler($.Event('responsive', event));

						//필터 이벤트 호출
						_$window.triggerHandler($.Event('responsive:' + state[i], event));
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
					var hasScrollbar = _hasScrollbar(_$body[0], 'parents');

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
						_$body.addClass('scrollbar');
					}else{
						_$body.removeClass('scrollbar');
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
					_$body.removeClass(_setting.orientation);
					
					//화면이 가로세로가 같을때
					if(_setting.screenWidth === _setting.screenHeight) {
						_setting.orientation = 'square';
					
					//화면이 세로보다 가로가 클때
					}else if(_setting.screenWidth > _setting.screenHeight) {
						_setting.orientation = 'landscape';
					
					//화면이 가로보다 세로가 클때
					}else{
						_setting.orientation = 'portrait';
					}
					
					_$body.addClass(_setting.orientation);

					return _setting;
				}

				/**
				 * @name responsive
				 * @since 2017-12-06
				 * @param {object} option {range : {string || number : {from : number, to : number}}, lowIE : {property : array[string] || string}}
				 * @return {jqueryElement}
				 */
				$.responsive = function(option) {
					//소멸
					$.responsive.destroy();

					//기본객체
					_setting = _getDefaultObject();

					//실행등록
					_setting.isRun = true;

					//브라우저, 플랫폼 클래스 추가
					_$body.addClass(_setting.browser + ' ' + _setting.platform);
					
					//객체가 아닐때
					if(_getTypeof(option) !== 'object') {
						option = {};
					}

					//객체가 아닐때
					if(_getTypeof(option.lowIE) !== 'object') {
						option.lowIE = {};
					}

					//형태검사
					option.lowIEPropertyType = _getTypeof(option.lowIE.property);
					
					//배열 또는 문자일때
					if(option.lowIEPropertyType === 'array' || option.lowIEPropertyType === 'string') {
						option.lowIE.property = _removeDuplicate(option.lowIE.property);
					}else{
						option.lowIE.property = [];
					}

					//리사이즈 종료 간격
					option.interval = 250;

					//객체가 아닐때
					if(_getTypeof(option.range) !== 'object') {
						option.range = {};
					}
					
					//option.range에 적은 값을 기준으로 자바스크립트 코드 생성
					option.rangeCode = 'option.enter = [];\n_setting.exit = [];\n\n';
					option.rangeCode += 'if(!_setting.lowIE.run && _setting.lowIE.is) {\n\toption.enter = _setting.lowIE.property;\n}else{\n';
					option.rangeFilter = [];
					option.rangeProperty = [];

					for(option.i in option.range) {
						//필터링
						if(option.i !== 'square' && option.i !== 'portrait' && option.i !== 'landscape' && option.i.substr(-3) !== 'All' && option.i.substr(-7) !== 'Resized' && option.i !== 'none' && option.i.substr(-3) !== 'all' && option.i !== 'mobile' && option.i !== 'pc' && option.i !== 'ie7' && option.i !== 'ie8' && option.i !== 'ie9' && option.i !== 'ie10' && option.i !== 'ie11' && option.i !== 'scrollbar' && option.i !== 'edge' && option.i !== 'opera' && option.i !== 'chrome' && option.i !== 'firefox' && option.i !== 'safari' && option.i !== 'unknown') {
							//객체검사
							option.hasRangeHorizontal = (_getTypeof(option.range[option.i].horizontal) === 'object');
							option.hasRangeVertical = (_getTypeof(option.range[option.i].vertical) === 'object');

							//horizontal 또는 vertical이 객체일때
							if(option.hasRangeHorizontal || option.hasRangeVertical) {
								//horizontal이 객체이면서 from, to 프로퍼티가 숫자일때
								if(option.hasRangeHorizontal && _getTypeof(option.range[option.i].horizontal.from) === 'number' && _getTypeof(option.range[option.i].horizontal.to) === 'number') {
									option.rangeFilter.push(true);
								}else{
									option.rangeFilter.push(false);
								}
								
								//vertical이 객체이면서 from, to 프로퍼티가 숫자일때
								if(option.hasRangeVertical && _getTypeof(option.range[option.i].vertical.from) === 'number' && _getTypeof(option.range[option.i].vertical.to) === 'number') {
									option.rangeFilter.push(true);
								}else{
									option.rangeFilter.push(false);
								}
								
								//horizontal이 객체이면서 from, to 프로퍼티가 숫자이거나 vertical이 객체이면서 from, to 프로퍼티가 숫자일때
								if(option.rangeFilter[0] || option.rangeFilter[1]) {
									option.rangeCode += '\tif(';
									
									//horizontal이 객체이면서 from, to 프로퍼티가 숫자일때
									if(option.rangeFilter[0]) {
										option.rangeCode += '_setting.screenWidth <= ' + option.range[option.i].horizontal.from + ' && _setting.screenWidth >= ' + option.range[option.i].horizontal.to;
									}
									
									//vertical이 객체이면서 from, to 프로퍼티가 숫자일때
									if(option.rangeFilter[1]) {
										//가로 객체가 있을경우
										if(option.hasRangeHorizontal) {
											option.rangeCode += ' && ';
										}

										option.rangeCode += '_setting.screenHeight <= ' + option.range[option.i].vertical.from + ' && _setting.screenHeight >= ' + option.range[option.i].vertical.to;
									}

									option.rangeCode += ') {\n';
									option.rangeCode += '\t\toption.enter.push("' + option.i + '");\n';
									option.rangeCode += '\t}else{\n';
									option.rangeCode += '\t\t_setting.exit.push("' + option.i + '");\n';
									option.rangeCode += '\t}\n\n';

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

					option.rangeCode = option.rangeCode.replace(/\n$/, '');
					option.rangeCode += '}';
					_setting.range = option.range;
					_setting.rangeProperty = option.rangeProperty;
					//option.rangeCode작성 끝

					//필터링된 프로퍼티명에서 option.lowIE.property에 이름이 있는지 확인해서 없으면 제거
					option.lowIEFilter = [];

					for(option.i = 0; option.i < option.lowIE.property.length; option.i++) {
						//lowIE에 적은 프로퍼티명이 있을때
						if($.inArray(option.lowIE.property[option.i], option.rangeProperty) > -1) {
							option.lowIEFilter.push(option.lowIE.property[option.i]);
						}
					}
					
					//걸려나온게 있을때
					if(option.lowIEFilter.length) {
						option.lowIE.run = false;
					}else{
						option.lowIE.run = true;
					}

					_setting.lowIE.run = option.lowIE.run;

					option.lowIE.property = option.lowIEFilter;
					_setting.lowIE.property = option.lowIE.property;

					_$window.on('resize.responsive', function(event) {
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
					return _$body;
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
						_$body.removeClass('scrollbar ' + _setting.browser + ' ' + _setting.platform + ' ' + _setting.nowState.join(' ') + ' ' + _setting.orientation);
						$('#scrollbar').remove();
						this.setting = _copyObject(_initialSetting);
						_setting.isRun = false;
						result = true;
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
							//분기명이 있을때
							if($.inArray(state[i], _setting.rangeProperty) > -1) {
								setState.push(state[i]);
							}
						}
					
					//문자열일때 && 분기명이 있을때
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