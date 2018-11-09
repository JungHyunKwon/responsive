/**
 * @author JungHyunKwon
 * @version 1.0.0
 */
try {
	'use strict';

	(function($) {
		//제이쿼리가 함수일 때
		if(typeof $ === 'function') {
			$(function() {
				var _$window = $(window),
					_html = document.documentElement,
					_htmlCSS = _html.currentStyle || window.getComputedStyle(_html),
					_$html = $(_html),
					_scrollbar = document.getElementById('scrollbar'),
					_connectedState = _getConnectedState(),
					_isLowIE = _connectedState.browser === 'ie7' || _connectedState.browser === 'ie8',
					_settings = {},
					_initSettings = {},
					_loadedScreenWidth = 0,
					_loadedScreenHeight = 0,
					_interval = 250,
					_cookie = {
						/**
						 * @name 쿠키 사용가능 여부
						 * @since 2017-01-16
						 */
						isSupport : navigator.cookieEnabled,

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
							
							//문자일 때
							if(typeof name === 'string' && typeof value === 'string') {
								//숫자가 아닐 때
								if(!_isNumber(day)) {
									day = -1;
								}

								date.setDate(date.getDate() + day);
								document.cookie = name + '=' + escape(value) + '; expires=' + date.toUTCString() + '; path=/;';

								//쿠키생성 후 확인해서 있으면
								if(this.get(name) === value) {
									result = true;
								}
							}

							return result;
						},

						/**
						 * @name 쿠키 값 얻기
						 * @since 2017-01-16
						 * @param {string} name
						 * @return {string}
						 */
						get : function(name) {
							var cookie = document.cookie.split(';'),
								result = '';
							
							//문자일 때
							if(typeof name === 'string') {
								for(var i = 0, cookieLength = cookie.length; i < cookieLength; i++) {
									var cookieI = cookie[i];
									
									//첫번째 글자가 공백일 때
									while(cookieI.charAt(0) === ' ') {
										cookieI = cookieI.substring(1);
										break;
									}
									
									//쿠키값이 있을 때
									if(cookieI.indexOf(name) > -1) {
										result = unescape(cookieI.substring(name.length + 1, cookieI.length));
										break;
									}
								}
							}

							return result;
						}
					};

				//요소가 없을 때
				if(!_scrollbar) {
					_scrollbar = document.createElement('div');
					_scrollbar.id = 'scrollbar';

					document.body.appendChild(_scrollbar);
				}
				
				//초기 셋팅 옵션
				_initSettings = _getDefaultOptions();

				//로드된 화면 넓이
				_loadedScreenWidth = _initSettings.screenWidth;
				
				//로드된 화면 높이
				_loadedScreenHeight = _initSettings.screenHeight;
				
				//초기 셋팅에 로드된 화면 넓이 갱신
				_initSettings.loadedScreenWidth = _loadedScreenWidth;
				
				//초기 셋팅에 로드된 화면 높이 갱신
				_initSettings.loadedScreenHeight = _loadedScreenHeight;

				/**
				 * @name 숫자 확인
				 * @since 2017-12-06
				 * @param {*} value
				 * @return {boolean}
				 */
				function _isNumber(value) {
					return typeof value === 'number' && !isNaN(value) && isFinite(value);
				}

				/**
				 * @name 배열 확인
				 * @since 2017-12-06
				 * @param {*} value
				 * @return {boolean}
				 */
				function _isArray(value) {
					return Object.prototype.toString.call(value).slice(8, -1).toLowerCase() === 'array';
				}

				/**
				 * @name 객체 복사
				 * @since 2017-12-06
				 * @param {object} value
				 * @return {object}
				 */
				function _copyObject(value) {
					return $.extend({}, value);
				}

				/**
				 * @name 배열 복사
				 * @since 2017-12-06
				 * @param {array} value
				 * @return {array}
				 */
				function _copyArray(value) {
					return (_isArray(value)) ? value.slice() : value;
				}

				/**
				 * @name 접속 상태 가져오기
				 * @since 2017-12-06
				 * @return {object}
				 */
				function _getConnectedState() {
					var userAgent = window.navigator.userAgent.toLowerCase(),
						result = {
							platform : 'mobile',
							browser : 'unknown'
						};

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
					}
					
					if('win16|win32|win64|macintel|mac'.indexOf(window.navigator.platform.toLowerCase()) > -1) {
						result.platform = 'pc';
					}

					return result;
				}

				/**
				 * @name 배열 중복 값 제거
				 * @since 2017-12-06
				 * @param {array || string} value
				 * @return {array}
				 */
				function _removeDuplicate(value) {
					var result = [];
					
					//문자일 때
					if(typeof value === 'string') {
						value = [value];
					}
					
					//배열일 때
					if(_isArray(value)) {
						for(var i = 0, valueLength = value.length; i < valueLength; i++) {
							var valueI = value[i];
							
							//배열 result에 매개변수 value에 i 번째 값이 없으면 집어넣는다.
							if($.inArray(valueI, result) === -1) {
								result.push(valueI);
							}
						}
					}

					return result;
				}

				/**
				 * @name 거르기
				 * @since 2017-12-06
				 * @param {array || string} value
				 * @param {array} array
				 * @return {object}
				 */
				function _filter(value, array) {
					var result = {
						truth : [],
						untruth : []
					};
					
					//배열일 때
					if(_isArray(array)) {
						//문자일 때
						if(typeof value === 'string') {
							value = [value];
						}
						
						//배열일 때
						if(_isArray(value)) {
							for(var i = 0, valueLength = value.length; i < valueLength; i++) {
								var valueI = value[i],
									index = $.inArray(valueI, array);

								if(index > -1) {
									result.truth[index] = value[i];
								}else{
									result.untruth.push(valueI);
								}
							}
						}
					}

					return result;
				}

				/**
				 * @name 상태 쿠키 얻기
				 * @since 2017-12-06
				 * @return {array}
				 */
				function _getStateCookie() {
					return _removeDuplicate(_filter(_cookie.get('state').split(','), _settings.rangeProperty).truth);
				}

				/**
				 * @name 스크롤바 넓이 구하기
				 * @since 2017-12-06
				 * @return {number}
				 */
				function _getScrollbarWidth() {
					return _scrollbar.offsetWidth - _scrollbar.clientWidth;
				}

				/**
				 * @name 스크롤바 존재 여부
				 * @since 2017-12-06
				 * @return {object}
				 */
				function _hasScrollbar() {
					var overflowX = _htmlCSS.overflowX,
						overflowY = _htmlCSS.overflowY,
						result = {
							horizontal : false,
							vertical : false
						};

					//clineWidth보다 scrollWidth가 더 크면서 overflow-x가 hidden이 아니거나 overflow-x가 scroll 일 때
					if((_html.scrollWidth > _html.clientWidth && overflowX !== 'hidden') || overflowX === 'scroll') {
						result.horizontal = true;
					}
					
					//clineHeight보다 scrollHeight가 더 크면서 overflow-y가 hidden이 아니거나 overflow-y가 scroll 일 때
					if((_html.scrollHeight > _html.clientHeight && overflowY !== 'hidden') || overflowY === 'scroll') {
						result.vertical = true;
					}

					return result;
				}

				/**
				 * @name 기본 옵션 얻기
				 * @since 2017-12-06
				 * @return {object}
				 */
				function _getDefaultOptions() {
					var hasScrollbar = _hasScrollbar(),
						scrollbarWidth = _getScrollbarWidth(),
						windowWidth = _$window.width(),
						windowHeight = _$window.height(),
						screenWidth = (hasScrollbar.vertical) ? windowWidth + scrollbarWidth : windowWidth,
						screenHeight = (hasScrollbar.horizontal) ? windowHeight + scrollbarWidth : windowHeight;

					return {
						isRun : false,
						range : {},
						rangeProperty : [],
						lowIE : {
							is : _isLowIE,
							property : [],
							run : false
						},
						nowState : [],
						prevState : [],
						scrollbarWidth : scrollbarWidth,
						orientation : (screenWidth === screenHeight) ? 'square' : (screenWidth > screenHeight) ? 'landscape' : 'portrait',
						screenWidth : screenWidth,
						screenHeight : screenHeight,
						loadedScreenWidth : _loadedScreenWidth,
						loadedScreenHeight : _loadedScreenHeight,
						browser : _connectedState.browser,
						platform : _connectedState.platform,
						hasVerticalScrollbar : hasScrollbar.vertical,
						hasHorizontalScrollbar : hasScrollbar.horizontal,
						triggerType : '',
						isScreenWidthChange : false,
						isScreenHeightChange : false,
						isScreenWidthAndHeightChange : false,
						isScreenChange : false
					};
				}

				/**
				 * @name 상태 적용
				 * @since 2017-12-06
				 * @param {array || string} value
				 * @return {array}
				 */
				function _setState(value) {
					var state = _removeDuplicate(value),
						nowState = _settings.nowState,
						result = _filter(_filter(state, _settings.rangeProperty).truth, nowState).untruth;

					//현재상태와 적용시킬 상태가 다를 때
					if(result.length) {
						//현재 상태 클래스 제거
						_$html.removeClass(nowState.join(' '));

						//새로운 상태 클래스 추가
						_$html.addClass(state.join(' '));

						//이전 상태 추가
						_settings.prevState = nowState;

						//새로운 상태 추가
						_settings.nowState = state;

						//console에 상태표기
						console.log('현재 상태 : ' + state.join(', '));
					}
					
					return result;
				}

				/**
				 * @name 분기 이벤트 실행
				 * @since 2017-12-06
				 * @param {array || string} value
				 */
				function _callEvent(value) {
					var state = _removeDuplicate(value),
						event = {
							settings : _copyObject(_settings)
						};

					//전역 객체 갱신
					$.responsive.settings = event.settings;

					for(var i = 0, stateLength = state.length; i < stateLength; i++) {
						var stateI = state[i];

						//분기 값 적용
						event.state = stateI;

						//모든 이벤트 호출
						_$window.triggerHandler($.Event('responsive', event));

						//필터 이벤트 호출
						_$window.triggerHandler($.Event('responsive:' + stateI, event));
					}
				}

				/**
				 * @name 화면 정보 입력
				 * @since 2017-12-06
				 * @param {object} event
				 */
				function _setScreenInfo(event) {
					var hasScrollbar = _hasScrollbar();

					//트리거
					if(event instanceof $.Event) {
						if(event.isTrigger === 2) {
							_settings.triggerType = 'triggerHandler';
						}else if(event.isTrigger === 3) {
							_settings.triggerType = 'trigger';
						}else{
							_settings.triggerType = '';
						}
					}
					
					//가로, 세로 스크롤바 확인
					_settings.hasVerticalScrollbar = hasScrollbar.vertical;
					_settings.hasHorizontalScrollbar = hasScrollbar.horizontal;

					//화면이 변경되었는지 확인하는 변수
					_settings.isScreenWidthChange = false;
					_settings.isScreenHeightChange = false;
					_settings.isScreenWidthAndHeightChange = false;
					_settings.isScreenChange = false;

					//스크롤바 넓이
					_settings.scrollbarWidth = _getScrollbarWidth();

					//브라우저 스크롤바가 있을 때
					if(_settings.scrollbarWidth) {
						_$html.addClass('scrollbar');
					}else{
						_$html.removeClass('scrollbar');
					}

					//화면 넓이, 높이
					_settings.screenWidth = _$window.width();
					_settings.screenHeight = _$window.height();
				
					//세로 스크롤바가 있을 때
					if(_settings.hasVerticalScrollbar) {
						_settings.screenWidth += _settings.scrollbarWidth;
					}

					//가로 스크롤바가 있을 때
					if(_settings.hasHorizontalScrollbar) {
						_settings.screenHeight += _settings.scrollbarWidth;
					}

					//방향
					_$html.removeClass(_settings.orientation);
					
					//화면이 가로세로가 같을 때
					if(_settings.screenWidth === _settings.screenHeight) {
						_settings.orientation = 'square';
					
					//화면이 세로보다 가로가 클 때
					}else if(_settings.screenWidth > _settings.screenHeight) {
						_settings.orientation = 'landscape';
					
					//화면이 가로보다 세로가 클 때
					}else{
						_settings.orientation = 'portrait';
					}

					_$html.addClass(_settings.orientation);
				}

				/**
				 * @name 소멸
				 * @since 2017-12-06
				 * @return {boolean}
				 */
				function _destroy() {
					var result = false;
					
					//플러그인을 실행 중일 때
					if(_settings.isRun) {
						//이벤트 제거
						_$window.off('resize.responsive');

						//클래스 제거
						_$html.removeClass('scrollbar ' + _settings.browser + ' ' + _settings.platform + ' ' + _settings.nowState.join(' ') + ' ' + _settings.orientation);
						
						//스크롤바 요소 제거
						$(_scrollbar).remove();
						
						//셋팅 초기화
						$.responsive.settings = _getDefaultOptions();

						//실행 플래그 초기화
						_settings.isRun = false;
						
						//결과 기입
						result = true;
					}

					return result;
				}

				/**
				 * @name responsive
				 * @since 2017-12-06
				 * @param {object} options {
					   range : {
					       # : {
						       from : number,
							   to : number
						   }
					   },
					   lowIE : array || string
				   }
				 * @return {jQueryElement}
				 */
				$.responsive = function(options) {
					var settings = _copyObject(options),
						screenWidth = 0,
						screenHeight = 0,
						timer = 0;

					//소멸
					_destroy();

					//기본 객체
					_settings = _getDefaultOptions();

					//실행 등록
					_settings.isRun = true;

					//브라우저, 플랫폼 클래스 추가
					_$html.addClass(_settings.browser + ' ' + _settings.platform);

					//객체가 아닐 때
					if(!settings.lowIE) {
						settings.lowIE = {};
					}
					
					//객체가 아닐 때
					if(!settings.range) {
						settings.range = {};
					}

					//자바스크립트 코드 생성
					var _lowIE = _settings.lowIE,
						lowIE = settings.lowIE,
						range = settings.range,
						rangeCode = 'var enter = [],\n\texit = [];\n\nif(_lowIE.run) {\n\tenter = _lowIE.property;\n}else{\n';

					for(var i in range) {
						var rangeI = range[i];

						//필터링
						if(rangeI && i !== 'square' && i !== 'portrait' && i !== 'landscape' && i.substr(-3) !== 'All' && i.substr(-7) !== 'Resized' && i !== 'none' && i.substr(-3) !== 'all' && i !== 'mobile' && i !== 'pc' && i !== 'ie7' && i !== 'ie8' && i !== 'ie9' && i !== 'ie10' && i !== 'ie11' && i !== 'scrollbar' && i !== 'edge' && i !== 'opera' && i !== 'chrome' && i !== 'firefox' && i !== 'safari' && i !== 'unknown') {
							var horizontal = rangeI.horizontal,
								horizontalFrom = -1,
								horizontalTo = -1,
								hasHorizontal = false,
								vertical = rangeI.vertical,
								verticalFrom = -1,
								verticalTo = -1,
								hasVertical = false;
							
							//객체가 있을 때
							if(horizontal) {
								var _horizontalFrom = horizontal.from,
									_horizontalTo = horizontal.to;

								//숫자일 때
								if(_isNumber(_horizontalFrom)) {
									horizontalFrom = _horizontalFrom;
								}
								
								//숫자일 때
								if(_isNumber(_horizontalTo)) {
									horizontalTo = _horizontalTo;
								}
								
								//from이 0 이상이면서 to가 0 이상이면서 from보다 to가 이상일 때
								if(horizontalFrom >= 0 && horizontalTo >= 0 && horizontalFrom >= horizontalTo) {
									hasHorizontal = true;
								}
							}
							
							//객체가 있을 때
							if(vertical) {
								var _verticalFrom = vertical.from,
									_verticalTo = vertical.to;

								//숫자일 때
								if(_isNumber(_verticalFrom)) {
									verticalFrom = _verticalFrom;
								}
								
								//숫자일 때
								if(_isNumber(_verticalTo)) {
									verticalTo = _verticalTo;
								}
								
								//from이 0 이상이면서 to가 0 이상이면서 from보다 to가 이상일 때
								if(verticalFrom >= 0 && verticalTo >= 0 && verticalFrom >= verticalTo) {
									hasVertical = true;
								}
							}

							if(hasHorizontal || hasVertical) {
								rangeCode += '\tif(';
								
								//horizontal이 객체이면서 from, to 속성이 숫자일 때
								if(hasHorizontal) {
									rangeCode += 'screenWidth <= ' + horizontalFrom + ' && screenWidth >= ' + horizontalTo;
								}
								
								//vertical이 객체이면서 from, to 속성이 숫자일 때
								if(hasVertical) {
									//가로가 있을경우
									if(hasHorizontal) {
										rangeCode += ' && ';
									}

									rangeCode += 'screenHeight <= ' + verticalFrom + ' && screenHeight >= ' + verticalTo;
								}

								rangeCode += ') {\n';
								rangeCode += '\t\tenter.push(\'' + i + '\');\n';
								rangeCode += '\t}else{\n';
								rangeCode += '\t\texit.push(\'' + i + '\');\n';
								rangeCode += '\t}\n\n';

								_settings.rangeProperty.push(i);
								_settings.range[i] = rangeI;
							}
						}
					}

					rangeCode = rangeCode.replace(/\n$/, '');
					rangeCode += '}';

					//문자 또는 배열일 때
					if(typeof lowIE.property === 'string' || _isArray(lowIE.property)) {
						_lowIE.property = _filter(_removeDuplicate(lowIE.property), _settings.rangeProperty).truth;
					}

					//ie7, 8이면서 사용할 속성이 있을 때
					if(_isLowIE && _lowIE.property.length) {
						_lowIE.run = true;
					}

					_$window.on('resize.responsive', function(event) {
						var state = ['all'],
							resizedState = ['allResized'],
							stateCookie = _getStateCookie();

						//화면 정보 갱신
						_setScreenInfo(event);

						//화면이 변경되었을 때
						_settings.isScreenChange = true;

						//기존의 스크린 넓이와 새로부여받은 스크린 넓이가 다를 때
						if(_settings.screenWidth !== screenWidth) {
							screenWidth = _settings.screenWidth;
							_settings.isScreenWidthChange = true;
						}

						//기존의 스크린 높이와 새로부여받은 스크린 높이가 다를 때
						if(_settings.screenHeight !== screenHeight) {
							screenHeight = _settings.screenHeight;
							_settings.isScreenHeightChange = true;
						}

						//기존 스크린 넓이와 높이가 둘다 변경되었을 때
						if(_settings.isScreenWidthChange && _settings.isScreenHeightChange) {
							_settings.isScreenWidthAndHeightChange = true;
						}

						//trigger로 호출하였을 때
						if(_settings.triggerType) {
							_settings.isScreenWidthChange = false;
							_settings.isScreenHeightChange = false;
							_settings.isScreenWidthAndHeightChange = false;
							_settings.isScreenChange = false;
						}

						//범위 실행
						eval(rangeCode);

						//적용시킬 분기가 없을 때
						if(!enter.length) {
							enter[0] = 'none';
						}

						//적용시킬 쿠키가 있을 때
						if(stateCookie.length) {
							enter = stateCookie;
						}
						
						//분기 적용
						var setState = _setState(enter);

						//분기 분류
						for(var i = 0, enterLength = enter.length; i < enterLength; i++) {
							var enterI = enter[i],
								stateAll = enterI + 'All';
							
							state.push(stateAll);

							//적용시킬 상태가 있을 때
							if($.inArray(enterI, setState) > -1) {
								state.push(enterI);
							}

							resizedState.push(stateAll + 'Resized');
						}

						//이벤트 실행
						_callEvent(state);

						//돌던 setTimeout이 있으면 중단
						if(timer) {
							clearTimeout(timer);
							timer = 0;
						}
						
						//setTimeout 재등록
						timer = setTimeout(function() {
							//화면 정보 갱신
							_setScreenInfo(event);

							//이벤트 실행
							_callEvent(resizedState);

							//트리거 갱신
							if(_settings.triggerType) {
								_settings.triggerType = '';
								$.responsive.settings = _copyObject(_settings);
							}
						}, _interval);
					}).triggerHandler('resize.responsive');

					//요소 반환
					return _$html;
				};
				
				/**
				 * @name 소멸
				 * @since 2017-12-06
				 * @return {boolean}
				 */
				$.responsive.destroy = _destroy;

				/**
				 * @name 분기 적용
				 * @since 2017-12-06
				 * @param {array || string} value
				 * @param {number} day
				 * @return {boolean || string}
				 */
				$.responsive.setState = function(value, day) {
					var result = false;
					
					value = _filter(value, _settings.rangeProperty).truth;

					//적용시킬 상태가 있을 때
					if(value.length) {
						//분기 적용
						var setState = _setState(value);
						
						//적용시킬 상태가 있을 때
						if(setState.length) {
							//이벤트 실행
							_callEvent(setState);
							
							//결과 변경
							result = true;
						}
						
						//숫자일 때
						if(_isNumber(day)) {
							//쿠키 적용
							if(_cookie.set('state', value.join(','), day)) {
								result = true;
							}

							//0 이하일 때
							if(day <= 0) {
								result = 'delete';
							}
						}
					}

					return result;
				};
				
				/**
				 * @name 상태 쿠키 얻기
				 * @since 2017-12-06
				 * @return {array}
				 */
				$.responsive.getStateCookie = _getStateCookie;

				/**
				 * @description 기본 옵션을 사용자에게 제공합니다.
				 */
				$.responsive.settings = _initSettings;
			});
		}else{
			throw '제이쿼리가 없습니다.';
		}
	})(window.jQuery);
}catch(e) {
	console.error(e);
}