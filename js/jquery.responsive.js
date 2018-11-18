/**
 * @author JungHyunKwon
 * @version 1.0.0
 */
try {
	'use strict';

	(function($, isNaN, isFinite, toString, getComputedStyle) {
		//제이쿼리가 함수일 때
		if(typeof $ === 'function') {
			$(function() {
				var _$window = $(window),
					_html = document.documentElement,
					_htmlCSS = _html.currentStyle || getComputedStyle(_html),
					_$html = $(_html),
					_scrollbar = document.getElementById('scrollbar'),
					_navigator = window.navigator,
					_userAgent = _navigator.userAgent.toLowerCase(),
					_platform = _navigator.platform.toLowerCase(),
					_browser = 'unknown',
					_$event = $.Event,
					_$extend = $.extend,
					_$inArray = $.inArray,
					_settings = {},
					_initSettings = {},
					_loadedScreenWidth = 0,
					_loadedScreenHeight = 0,
					_interval = 250,
					_cookie = {
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
								//정수가 아닐 때
								if(!_isInt(day)) {
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
								var valueIndex = name.length + 1;

								for(var i = 0, cookieLength = cookie.length; i < cookieLength; i++) {
									var cookieI = cookie[i];
									
									//첫번째 글자가 공백일 때
									while(cookieI.charAt(0) === ' ') {
										cookieI = cookieI.substring(1);
										break;
									}
									
									//쿠키값이 있을 때
									if(cookieI.indexOf(name) > -1) {
										result = unescape(cookieI.substring(valueIndex, cookieI.length));
										break;
									}
								}
							}

							return result;
						}
					};

				//ie7일 때
				if(_userAgent.indexOf('msie 7.0') > -1) {
					_browser = 'ie7';
				
				//ie8일 때
				}else if(_userAgent.indexOf('msie 8.0') > -1) {
					_browser = 'ie8';
				
				//ie9일 때
				}else if(_userAgent.indexOf('msie 9.0') > -1) {
					_browser = 'ie9';
				
				//ie10일 때
				}else if(_userAgent.indexOf('msie 10.0') > -1) {
					_browser = 'ie10';
				
				//ie11일 때
				}else if(_userAgent.indexOf('trident/7.0') > -1) {
					_browser = 'ie11';
				
				//edge일 때
				}else if(_userAgent.indexOf('edge') > -1) {
					_browser = 'edge';
				
				//opera일 때
				}else if(_userAgent.indexOf('opr') > -1) {
					_browser = 'opera';
				
				//chrome일 때
				}else if(_userAgent.indexOf('chrome') > -1) {
					_browser = 'chrome';
				
				//firefox일 때
				}else if(_userAgent.indexOf('firefox') > -1) {
					_browser = 'firefox'; 
				
				//safari일 때
				}else if(_userAgent.indexOf('safari') > -1) {
					_browser = 'safari';
				}
				
				var _isLowIE = _browser === 'ie7' || _browser === 'ie8';

				//접속 플랫폼이 win16 또는 win32 또는 win64 또는 macintel 또는 mac일 때
				if('win16|win32|win64|macintel|mac'.indexOf(_platform) > -1) {
					_platform = 'pc';
				}else{
					_platform = 'mobile';
				}

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
				 * @name 정수 확인
				 * @since 2017-12-06
				 * @param {*} value
				 * @return {boolean}
				 */
				function _isInt(value) {
					return typeof value === 'number' && !isNaN(value) && isFinite(value);
				}

				/**
				 * @name 배열 확인
				 * @since 2017-12-06
				 * @param {*} value
				 * @return {boolean}
				 */
				function _isArray(value) {
					return toString.call(value) === '[object Array]';
				}

				/**
				 * @name 중복 제거
				 * @since 2017-12-06
				 * @param {array || string} value
				 * @return {array}
				 */
				function _deduplication(value) {
					var result = [];
					
					//문자일 때
					if(typeof value === 'string') {
						value = [value];
					}
					
					//배열일 때
					if(_isArray(value)) {
						for(var i = 0, valueLength = value.length; i < valueLength; i++) {
							var valueI = value[i];
							
							//배열에 매개변수 i 번째 값이 없을 때
							if(_$inArray(valueI, result) === -1) {
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
							var truth = result.truth,
								untruth = result.untruth;
							
							for(var i = 0, valueLength = value.length; i < valueLength; i++) {
								var valueI = value[i];
								
								//결과가 있을 때
								if(_$inArray(valueI, array) > -1) {
									truth.push(valueI);
								}else{
									untruth.push(valueI);
								}
							}
						}
					}

					return result;
				}
				
				/**
				 * @name 정렬
				 * @since 2017-12-06
				 * @param {array || string} value
				 * @param {array} array
				 * @return {array}
				 */
				function _sort(value, array) {
					var result = [];
					
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
									index = _$inArray(valueI, array);
								
								//결과가 있을 때
								if(index > -1) {
									result[index] = valueI;
								}
							}

							for(var i = 0; i < result.length; i++) {
								//프로퍼티가 없을 때
								if(!result.hasOwnProperty(i)) {
									result.splice(i, 1);
									i--;
								}
							}
						}
					}

					return result;
				}

				/**
				 * @name 상태 가공
				 * @since 2017-12-06
				 * @param {array || string} value
				 * @return {array}
				 */
				function _processState(value) {
					var result = [];
					
					//문자일 때
					if(typeof value === 'string') {
						value = [value];
					}
					
					//배열일 때
					if(_isArray(value)) {
						var rangeProperty = _settings.rangeProperty;

						//중복 제거 후 분기 값인 것만 걸러서 분기 값 순으로 정렬
						result = _sort(_filter(_deduplication(value), rangeProperty).truth, rangeProperty);
					}

					return result;
				}

				/**
				 * @name 상태 쿠키 얻기
				 * @since 2017-12-06
				 * @return {array}
				 */
				function _getStateCookie() {
					return _processState(_cookie.get('state').split(','));
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
						hasVerticalScrollbar = hasScrollbar.vertical,
						hasHorizontalScrollbar = hasScrollbar.horizontal,
						scrollbarWidth = _getScrollbarWidth(),
						windowWidth = _$window.width(),
						windowHeight = _$window.height(),
						screenWidth = (hasVerticalScrollbar) ? windowWidth + scrollbarWidth : windowWidth, //세로 스크롤바가 있을 때
						screenHeight = (hasHorizontalScrollbar) ? windowHeight + scrollbarWidth : windowHeight; //가로 스크롤바가 있을 때

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
						orientation : (screenWidth === screenHeight) ? 'square' : (screenWidth > screenHeight) ? 'landscape' : 'portrait', //화면 넓이와 화면 넓이가 같을 때 아니면 화면 넓이가 화면 높이보다 클 때
						screenWidth : screenWidth,
						screenHeight : screenHeight,
						loadedScreenWidth : _loadedScreenWidth,
						loadedScreenHeight : _loadedScreenHeight,
						browser : _browser,
						platform : _platform,
						hasVerticalScrollbar : hasVerticalScrollbar,
						hasHorizontalScrollbar : hasHorizontalScrollbar,
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
				 * @param {array} value
				 * @return {array}
				 */
				function _setState(value) {
					var nowState = _settings.nowState,
						result = _filter(value, nowState).untruth;
					
					//현재상태와 적용시킬 상태가 다를 때
					if(result.length) {
						//현재 상태 클래스 제거
						_$html.removeClass(nowState.join(' '));

						//새로운 상태 클래스 추가
						_$html.addClass(value.join(' '));

						//이전 상태 추가
						_settings.prevState = nowState;

						//새로운 상태 추가
						_settings.nowState = value;

						//console에 상태표기
						console.log('현재 상태 : ' + value.join(', '));
					}
					
					return result;
				}

				/**
				 * @name 분기 이벤트 실행
				 * @since 2017-12-06
				 * @param {array} value
				 */
				function _callEvent(value) {
					var event = {
						settings : _$extend({}, _settings)
					};

					//전역 객체 갱신
					_$responsive.settings = event.settings;

					for(var i = 0, valueLength = value.length; i < valueLength; i++) {
						var valueI = value[i];

						//분기 값 적용
						event.state = valueI;

						//모든 이벤트 호출
						_$window.triggerHandler(_$event('responsive', event));

						//필터 이벤트 호출
						_$window.triggerHandler(_$event('responsive:' + valueI, event));
					}
				}

				/**
				 * @name 화면 정보 입력
				 * @since 2017-12-06
				 * @param {object} event
				 */
				function _setScreenInfo(event) {
					var hasScrollbar = _hasScrollbar(),
						hasVerticalScrollbar = hasScrollbar.vertical,
						hasHorizontalScrollbar = hasScrollbar.horizontal,
						triggerType = '',
						scrollbarWidth = _getScrollbarWidth(),
						screenWidth = _$window.width(),
						screenHeight = _$window.height(),
						orientation = 'portrait',
						_orientation = _settings.orientation;

					//이벤트가 있을 때
					if(event instanceof _$event) {
						var isTrigger = event.isTrigger;
						
						//triggerHandler일 때
						if(isTrigger === 2) {
							triggerType = 'triggerHandler';
						
						//trigger일 때
						}else if(isTrigger === 3) {
							triggerType = 'trigger';
						}
					}
					
					//트리거 기입
					_settings.triggerType = triggerType;

					//가로, 세로 스크롤바 여부 기입
					_settings.hasVerticalScrollbar = hasVerticalScrollbar;
					_settings.hasHorizontalScrollbar = hasHorizontalScrollbar;

					//화면 상태 초기화
					_settings.isScreenWidthChange = false;
					_settings.isScreenHeightChange = false;
					_settings.isScreenWidthAndHeightChange = false;
					_settings.isScreenChange = false;
					
					//기존 스크롤바 넓이와 현재 스크롤바 넓이가 다를 때
					if(_settings.scrollbarWidth !== scrollbarWidth) {
						//현재 스크롤바 넓이가 있을 때
						if(scrollbarWidth) {
							_$html.addClass('scrollbar');
						}else{
							_$html.removeClass('scrollbar');
						}
					}
				
					//스크롤바 넓이 기입
					_settings.scrollbarWidth = scrollbarWidth;

					//세로 스크롤바가 있을 때
					if(hasVerticalScrollbar) {
						screenWidth += scrollbarWidth;
					}

					//가로 스크롤바가 있을 때
					if(hasHorizontalScrollbar) {
						screenHeight += scrollbarWidth;
					}

					//화면 넓이, 높이 기입
					_settings.screenWidth = screenWidth;
					_settings.screenHeight = screenHeight;
					
					//화면이 가로세로가 같을 때
					if(screenWidth === screenHeight) {
						orientation = 'square';
					
					//화면이 세로보다 가로가 클 때
					}else if(screenWidth > screenHeight) {
						orientation = 'landscape';
					}
					
					//기존 화면 방향과 현재 화면 방향이 다를 때
					if(_orientation !== orientation) {
						//기존 화면 방향 클래스 제거
						_$html.removeClass(_orientation);

						//현재 화면 방향 추가
						_settings.orientation = orientation;

						//화면 방향 클래스 추가
						_$html.addClass(orientation);
					}
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
						_$html.removeClass('scrollbar ' + _browser + ' ' + _platform + ' ' + _settings.nowState.join(' ') + ' ' + _settings.orientation);
						
						//스크롤바 요소 제거
						$(_scrollbar).remove();
						
						//셋팅 초기화
						_$responsive.settings = _getDefaultOptions();

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
				var _$responsive = $.responsive = function(options) {
					//객체일 때
					if(options) {
						var range = options.range,
							lowIE = options.lowIE,
							rangeCode = 'var enter = [],\n    exit = [];\n\nif(lowIERun) {\n    enter = lowIEProperty;\n}else{\n',
							lowIERun = false,
							screenWidth = 0,
							screenHeight = 0,
							timer = 0;

						//소멸
						_destroy();

						//기본 객체
						_settings = _getDefaultOptions();
						
						//실행 등록
						_settings.isRun = true;

						//초기화
						_settings.orientation = undefined;
						_settings.scrollbarWidth = undefined;

						//브라우저, 플랫폼 클래스 추가
						_$html.addClass(_browser + ' ' + _platform);
						
						//객체일 때
						if(range) {
							var rangeProperty = [],
								filteredRange = {};
							
							//자바스크립트 코드 생성
							for(var i in range) {
								var rangeI = range[i];

								//필터링
								if(rangeI && i.indexOf(',') === -1 && i.substr(-3) !== 'all' && i.substr(-3) !== 'All' && i.substr(-7) !== 'Resized' && i !== 'square' && i !== 'portrait' && i !== 'landscape' && i !== 'none' && i !== 'scrollbar' && i !== _platform && i !== _browser) {
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
										if(_isInt(_horizontalFrom)) {
											horizontalFrom = _horizontalFrom;
										}
										
										//숫자일 때
										if(_isInt(_horizontalTo)) {
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
										if(_isInt(_verticalFrom)) {
											verticalFrom = _verticalFrom;
										}
										
										//숫자일 때
										if(_isInt(_verticalTo)) {
											verticalTo = _verticalTo;
										}
										
										//from이 0 이상이면서 to가 0 이상이면서 from보다 to가 이상일 때
										if(verticalFrom >= 0 && verticalTo >= 0 && verticalFrom >= verticalTo) {
											hasVertical = true;
										}
									}

									if(hasHorizontal || hasVertical) {
										rangeCode += '    if(';
										
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
										rangeCode += '        enter.push(\'' + i + '\');\n';
										rangeCode += '    }else{\n';
										rangeCode += '        exit.push(\'' + i + '\');\n';
										rangeCode += '    }\n\n';

										rangeProperty.push(i);
										filteredRange[i] = rangeI;
									}
								}
							}
							
							//마지막 개행 제거
							rangeCode = rangeCode.replace(/\n$/, '');

							//분기 기입
							_settings.rangeProperty = rangeProperty;
							_settings.range = filteredRange;
						}
						
						rangeCode += '}';
						
						//객체일 때
						if(lowIE) {
							var lowIEProperty = lowIE.property;
							
							//프로퍼티가 있을 때
							if(lowIEProperty) {
								var _lowIE = _settings.lowIE;

								//문자 또는 배열일 때
								if(typeof lowIEProperty === 'string' || _isArray(lowIEProperty)) {
									_lowIE.property = lowIEProperty = _processState(lowIEProperty);
								}

								//ie7, 8이면서 사용할 속성이 있을 때
								if(_isLowIE && lowIEProperty.length) {
									_lowIE.run = lowIERun = true;
								}
							}
						}

						_$window.on('resize.responsive', function(event) {
							//화면 정보 갱신
							_setScreenInfo(event);

							var _screenWidth = _settings.screenWidth,
								_screenHeigt = _settings.screenHeight,
								_triggerType = _settings.triggerType,
								state = ['all'],
								resizedState = ['allResized'],
								stateCookie = _getStateCookie(),
								isScreenChange = true,
								isScreenWidthChange = false,
								isScreenHeightChange = false,
								isScreenWidthAndHeightChange = false;

							//기존의 스크린 넓이와 새로부여받은 스크린 넓이가 다를 때
							if(_screenWidth !== screenWidth) {
								screenWidth = _screenWidth;
								isScreenWidthChange = true;
							}

							//기존의 스크린 높이와 새로부여받은 스크린 높이가 다를 때
							if(_screenHeigt !== screenHeight) {
								screenHeight = _screenHeigt;
								isScreenHeightChange = true;
							}

							//기존 스크린 넓이와 높이가 둘다 변경되었을 때
							if(isScreenWidthChange && isScreenHeightChange) {
								isScreenWidthAndHeightChange = true;
							}

							//trigger로 호출하였을 때
							if(_triggerType) {
								isScreenWidthChange = false;
								isScreenHeightChange = false;
								isScreenWidthAndHeightChange = false;
								isScreenChange = false;
							}

							//화면 상태 기입
							_settings.isScreenChange = isScreenChange;
							_settings.isScreenWidthChange = isScreenWidthChange;
							_settings.isScreenHeightChange = isScreenHeightChange;
							_settings.isScreenWidthAndHeightChange = isScreenWidthAndHeightChange;

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
								if(_$inArray(enterI, setState) > -1) {
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

								//trigger로 호출하였을 때
								if(_triggerType) {
									_settings.triggerType = _$responsive.settings.triggerType = '';
								}
							}, _interval);
						}).triggerHandler('resize.responsive');
					}

					//요소 반환
					return _$html;
				};

				/**
				 * @name 소멸
				 * @since 2017-12-06
				 * @return {boolean}
				 */
				_$responsive.destroy = _destroy;

				/**
				 * @name 분기 적용
				 * @since 2017-12-06
				 * @param {array || string} value
				 * @param {number} day
				 * @return {boolean || string}
				 */
				_$responsive.setState = function(value, day) {
					var state = _processState(value),
						result = false;

					//적용시킬 상태가 있을 때
					if(state.length) {
						//분기 적용
						var setState = _setState(state);
						
						//적용시킬 상태가 있을 때
						if(setState.length) {
							//이벤트 실행
							_callEvent(setState);
							
							//결과 변경
							result = true;
						}
						
						//숫자일 때
						if(_isInt(day)) {
							//쿠키 적용
							if(_cookie.set('state', state.join(','), day)) {
								result = true;
							}

							//0 이하일 때
							if(day < 1) {
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
				_$responsive.getStateCookie = _getStateCookie;

				/**
				 * @description 기본 옵션을 사용자에게 제공합니다.
				 */
				_$responsive.settings = _initSettings;
			});
		}else{
			throw '제이쿼리가 없습니다.';
		}
	})(window.jQuery, window.isNaN, window.isFinite, Object.prototype.toString, window.getComputedStyle);
}catch(e) {
	console.error(e);
}