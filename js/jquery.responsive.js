/**
 * @author JungHyunKwon
 * @version 1.0.0
 */
try {
	'use strict';

	(function($) {
		//제이쿼리가 함수일 때
		if(typeof $ === 'function') {
			var _$window = $(window),
				_$html = $('html'),
				_connectedState = _getConnectedState(),
				_isLowIE = _connectedState.browser === 'ie6' || _connectedState.browser === 'ie7' || _connectedState.browser === 'ie8',
				_settings = {},
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
						
						//문자일 때
						if(typeof name === 'string' && typeof value === 'string') {
							//숫자가 아닐 때
							if(_getType(day) !== 'number') {
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
								var cookie = cookie[i];
								
								//첫번째 글자가 공백일 때
								while(cookie.charAt(0) === ' ') {
									cookie = cookie.substring(1);
									break;
								}
								
								//쿠키값이 있을 때
								if(cookie.indexOf(name) > -1) {
									result = unescape(cookie.substring(name.length + 1, cookie.length));
									break;
								}
							}
						}

						return result;
					}
				};

			/**
			 * @name 형태 얻기
			 * @since 2017-12-06
			 * @param {*} value
			 * @return {string || undefined}
			 */
			function _getType(value) {
				var result;
				
				//매개변수가 있을 때
				if(arguments.length) {
					//null일 때
					if(value === null) {
						result = 'null';
					
					//undefined일 때
					}else if(value === undefined) {
						result = 'undefined';
					}else{
						result = Object.prototype.toString.call(value).toLowerCase().replace('[object ', '').replace(']', '');
						
						//Invalid Date일 때
						if(result === 'date' && isNaN(new Date(value))) {
							result = 'Invalid Date';
						
						//숫자일 때
						}else if(result === 'number') {
							//NaN일 때
							if(isNaN(value)) {
								result = 'NaN';
							
							//Infinity일 때
							}else if(!isFinite(value)) {
								result = value.toString();
							}
						
						//콘솔일 때
						}else if(result === 'console') {
							result = 'object';
						
						//요소일 때
						}else if(result.indexOf('element') > -1) {
							result = 'element';
						
						//문서일 때
						}else if(result.indexOf('document') > -1) {
							result = 'document';
						}
					}
				}

				return result;
			}

			/**
			 * @name 요소 확인
			 * @since 2017-12-06
			 * @param {object} options element || jQueryElement || {element : element || window || document || jQueryElement || array, isInPage : boolean, isIncludeWindow : boolean, isIncludeDocument : boolean, isMatch : boolean}
			 * @return {boolean}
			 */
			function _isElement(options) {
				var optionsType = _getType(options),
					hasJQuery = typeof $ === 'function',
					isElementOrArrayType = optionsType === 'element' || optionsType === 'array',
					result = false;
				
				//요소이거나 배열이거나 제이쿼리 요소일 때
				if(isElementOrArrayType || (hasJQuery && options)) {
					options = {
						element : options
					};
					
					//요소이거나 배열일 때
					if(isElementOrArrayType) {
						optionsType = 'object';
					}
				}

				//객체 또는 요소일 때
				if(optionsType === 'object') {
					var element = options.element,
						elementType = _getType(element);
					
					//window 또는 document 또는 요소일 때
					if(elementType === 'window' || elementType === 'document' || elementType === 'element') {
						element = [element];
						elementType = 'array';
					}

					//배열이거나 제이쿼리 요소일 때
					if(elementType === 'array' || (hasJQuery && element instanceof $)) {
						var checkedElement = [],
							elementLength = element.length,
							isIncludeWindow = options.isIncludeWindow === true,
							isIncludeDocument = options.isIncludeDocument === true,
							isInPage = options.isInPage === true,
							html = document.documentElement;

						for(var i = 0; i < elementLength; i++) {
							var elementI = element[i],
								elementIType = _getType(elementI),
								isElementType = elementIType === 'element',
								isElement = false;

							//요소이거나 window이면서 window를 포함시키는 옵션을 허용했거나 document이면서 document를 포함시키는 옵션을 허용했을 때
							if(isElementType || (elementIType === 'window' && isIncludeWindow) || (elementIType === 'document' && isIncludeDocument)) {
								//요소이면서 페이지안에 존재 여부를 허용했을 때
								if(isElementType && isInPage) {
									isElement = html.contains(elementI);
								}else{
									isElement = true;
								}
							}

							//요소일 때
							if(isElement) {
								checkedElement.push(elementI);
							}
						}

						var checkedElementLength = checkedElement.length;
						
						//결과가 있을 때
						if(checkedElementLength) {
							//일치를 허용했을 때
							if(options.isMatch === true) {
								//요소갯수와 결과갯수가 같을 때
								if(elementLength === checkedElementLength) {
									result = true;
								}
							}else{
								result = true;
							}
						}
					}
				}

				return result;
			}

			/**
			 * @name 자료형 복사
			 * @since 2017-12-06
			 * @param {*} value
			 * @return {*}
			 */
			function _copyType(value) {
				var valueType = _getType(value),
					result = {};

				//객체일 때
				if(valueType === 'object') {
					//제이쿼리가 함수일 때
					if(typeof $ === 'function') {
						result = $.extend(true, {}, value);
					}else{
						for(var i in value) {
							if(value.hasOwnProperty(i)) {
								result[i] = _copyType(value[i]);
							}
						}
					}

				//배열일 때
				}else if(valueType === 'array') {
					result = value.slice();
				}else{
					result = value;
				}

				return result;
			}

			/**
			 * @name 접속 상태 가져오기
			 * @since 2017-12-06
			 * @return {object}
			 */
			function _getConnectedState() {
				var userAgent = navigator.userAgent.toLowerCase(),
					platform = navigator.platform.toLowerCase(),
					platformCase = ['win16', 'win32', 'win64', 'mac', 'linux'],
					result = {};

				if(userAgent.indexOf('msie 6.0') > -1) {
					result.browser = 'ie6';
				}else if(userAgent.indexOf('msie 7.0') > -1) {
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
				
				//platformCase에 platform이 있을 때
				if($.inArray(platform, platformCase) > -1) {
					result.platform = 'pc';
				}else{
					result.platform = 'mobile';
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
				
				//배열이 아닐 때
				}else if(_getType(value) !== 'array') {
					value = [];
				}

				//배열 val에 매개변수 value에 i 번째 값이 없으면 집어넣는다.
				for(var i = 0, valueLength = value.length; i < valueLength; i++) {
					var valueI = value[i];

					if($.inArray(valueI, result) === -1) {
						result.push(valueI);
					}
				}

				return result;
			}

			/**
			 * @name 거르기
			 * @since 2017-12-06
			 * @param {array || string} value
			 * @param {array} standard
			 * @return {object}
			 */
			function _filter(value, standard) {
				var result = {
					truth : [],
					untruth : []
				};
				
				//배열일 때
				if(_getType(standard) === 'array') {
					//문자일 때
					if(typeof value === 'string') {
						value = [value];
					
					//배열이 아닐 때
					}else if(_getType(value) !== 'array') {
						value = [];
					}

					for(var i = 0, valueLength = value.length; i < valueLength; i++) {
						var valueI = value[i];
						
						//등록된 프로퍼티가 있을 때
						if($.inArray(valueI, standard) > -1) {
							result.truth.push(valueI);
						}else{
							result.untruth.push(valueI);
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

			$(function() {
				var _initialSetting = _getDefaultObject();
				
				/**
				 * @name 스크롤바 넓이 구하기
				 * @since 2017-12-06
				 * @param {element || jQueryElement} element
				 * @return {array || number}
				 */
				function _getScrollbarWidth(element) {
					var $element = $(element),
						result = [];

					//요소가 없을 때 대체
					if(!_isElement($element)) {
						$element = $('#scrollbar');
						
						//스크롤바 객체가 없을 때
						if(!$element.length) {
							$element = $('<div id="scrollbar">&nbsp;</div>').appendTo('body');
						}
					}
					
					for(var i = 0, elementLength = $element.length; i < elementLength; i++) {
						var elementI = $element[i];

						result.push(elementI.offsetWidth - elementI.clientWidth || 0);
					}
					
					//결과가 1개일 때
					if(result.length === 1) {
						result = result[0];
					
					//결과가 없을 때
					}else if(!result.length) {
						result = 0;
					}

					return result;
				}

				/**
				 * @name 스크롤바 존재여부
				 * @since 2017-12-06
				 * @param {element || jQueryElement} element
				 * @param {boolean} isIncludeParents
				 * @return {object || array}
				 */
				function _hasScrollbar(element, isIncludeParents) {
					var $element = $(element),
						result = [];
					
					//받은요소 갯수만큼 반복
					for(var i = 0, elementLength = $element.length; i < elementLength; i++) {
						var $elementI = $element.eq(i),
							elementI = $elementI[0],
							overflow = {
								x : $elementI.css('overflow-x'),
								y : $elementI.css('overflow-y')
							},
							scrollbar = {
								horizontal : false,
								vertical : false
							};
					
						//부모까지 조사를 허용했을 때
						if(isIncludeParents === true) {
							var $parents = $elementI.add($elementI.parents());

							scrollbar.horizontal = [];
							scrollbar.vertical = [];
							
							//상위부모 반복
							for(var j = 0, parentsLength = $parents.length; j < parentsLength; j++) {
								var hasScrollbar = _hasScrollbar($parents[j]);

								scrollbar.horizontal.push(hasScrollbar.horizontal);
								scrollbar.vertical.push(hasScrollbar.vertical);
							}

							//가로 스크롤바가 하나라도 있을 때
							if($.inArray(true, scrollbar.horizontal) > -1) {
								scrollbar.horizontal = true;
							}else{
								scrollbar.horizontal = false;
							}
							
							//세로 스크롤바가 하나라도 있을 때
							if($.inArray(true, scrollbar.vertical) > -1) {
								scrollbar.vertical = true;
							}else{
								scrollbar.vertical = false;
							}
						}else{
							//clineWidth보다 scrollWidth가 더 크면서 overflow-x가 hidden이 아니거나 overflow-x가 scroll 일 때
							if((elementI.scrollWidth > elementI.clientWidth && overflow.x !== 'hidden') || overflow.x === 'scroll') {
								scrollbar.horizontal = true;
							}
							
							//clineHeight보다 scrollHeight가 더 크면서 overflow-y가 hidden이 아니거나 overflow-y가 scroll 일 때
							if((elementI.scrollHeight > elementI.clientHeight && overflow.y !== 'hidden') || overflow.y === 'scroll') {
								scrollbar.vertical = true;
							}
						}
						
						//결과 기입
						result.push(scrollbar);
					}
					
					//결과가 1개일 때
					if(result.length === 1) {
						result = result[0];
					
					//결과가 없을 때
					}else if(!result.length) {
						result = 0;
					}

					return result;
				}

				/**
				 * @name 기본 옵션 얻기
				 * @since 2017-12-06
				 * @return {object}
				 */
				function _getDefaultObject() {
					var hasScrollbar = _hasScrollbar(_$html[0]),
						scrollbarWidth = _getScrollbarWidth(),
						screenWidth = (hasScrollbar.vertical) ? _$window.width() + scrollbarWidth : _$window.width(),
						screenHeight = (hasScrollbar.horizontal) ? _$window.height() + scrollbarWidth : _$window.height();

					return _copyType({
						isRun : false,
						range : {},
						rangeProperty : [],
						lowIE : {
							is : _isLowIE,
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
						triggerType : '',
						isScreenWidthChange : false,
						isScreenHeightChange : false,
						isScreenWidthAndHeightChange : false,
						isScreenChange : false
					});
				}

				/**
				 * @name 상태 적용
				 * @since 2017-12-06
				 * @param {array || string} value
				 * @return {array}
				 */
				function _setState(value) {
					//중복 제거
					value = _removeDuplicate(value);
					
					var nowState = _copyType(_settings.nowState),
						result = _filter(value, _settings.nowState).untruth;

					//현재상태와 적용시킬 상태가 다를 때
					if((_copyType(value).sort() + '') !== (nowState.sort() + '')) {
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
				 * @param {array || string} value
				 * @return {object}
				 */
				function _callEvent(value) {
					var event = {
							settings : _copyType(_settings)
						};

					//전역 객체 갱신
					$.responsive.settings = _copyType(event.settings);

					//중복 제거
					value = _removeDuplicate(value);

					for(var i = 0, valueLength = value.length; i < valueLength; i++) {
						var valueI = value[i];

						//분기 값 적용
						event.state = valueI;

						//모든 이벤트 호출
						_$window.triggerHandler($.Event('responsive', event));

						//필터 이벤트 호출
						_$window.triggerHandler($.Event('responsive:' + valueI, event));
					}

					return event;
				}

				/**
				 * @name 화면 정보 입력
				 * @since 2017-12-06
				 * @param {object} event
				 * @return {object}
				 */
				function _setScreenInfo(event) {
					var hasScrollbar = _hasScrollbar(_$html[0]);

					//객체가 아닐 때
					if(_getType(event) !== 'object') {
						event = {};
					}

					//트리거
					if(event.isTrigger === 2) {
						_settings.triggerType = 'triggerHandler';
					}else if(event.isTrigger === 3) {
						_settings.triggerType = 'trigger';
					}else{
						_settings.triggerType = '';
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

					return _settings;
				}

				/**
				 * @name responsive
				 * @since 2017-12-06
				 * @param {object} options {range : {string || number : {from : number, to : number}}, lowIE : {property : array[string] || string}}
				 * @return {jqueryElement}
				 */
				$.responsive = function(options) {
					var rangeCode = 'var enter = [],\n\texit = [];\n\nif(!_settings.lowIE.run && _isLowIE) {\n\tenter = _settings.lowIE.property;\n}else{\n',
						rangeProperty = [],
						screenWidth = 0,
						screenHeight = 0,
						timer = 0,
						interval = 250;

					//소멸
					$.responsive.destroy();

					//기본 객체
					_settings = _getDefaultObject();

					//실행 등록
					_settings.isRun = true;

					//브라우저, 플랫폼 클래스 추가
					_$html.addClass(_settings.browser + ' ' + _settings.platform);

					//객체가 아닐 때
					if(_getType(options) !== 'object') {
						options = {};
					}

					//객체가 아닐 때
					if(_getType(options.lowIE) !== 'object') {
						options.lowIE = {};
					}

					//객체가 아닐 때
					if(_getType(options.range) !== 'object') {
						options.range = {};
					}

					//options.range에 적은 값을 기준으로 자바스크립트 코드 생성
					for(var i in options.range) {
						var rangeI = options.range[i];

						//필터링
						if(_getType(rangeI) === 'object' && i !== 'square' && i !== 'portrait' && i !== 'landscape' && i.substr(-3) !== 'All' && i.substr(-7) !== 'Resized' && i !== 'none' && i.substr(-3) !== 'all' && i !== 'mobile' && i !== 'pc' && i !== 'ie6' && i !== 'ie7' && i !== 'ie8' && i !== 'ie9' && i !== 'ie10' && i !== 'ie11' && i !== 'scrollbar' && i !== 'edge' && i !== 'opera' && i !== 'chrome' && i !== 'firefox' && i !== 'safari' && i !== 'unknown') {
							var hasHorizontal = _getType(rangeI.horizontal) === 'object' && _getType(rangeI.horizontal.from) === 'number' && _getType(rangeI.horizontal.to) === 'number', //horizontal이 객체이면서 from, to 프로퍼티가 숫자일 때
								hasVertical = _getType(rangeI.vertical) === 'object' && _getType(rangeI.vertical.from) === 'number' && _getType(rangeI.vertical.to) === 'number'; //vertical이 객체이면서 from, to 프로퍼티가 숫자일 때
							
							//horizontal이 객체이면서 from, to 속성이 숫자이거나 vertical이 객체이면서 from, to 속성이 숫자일 때
							if(hasHorizontal || hasVertical) {
								rangeCode += '\tif(';
								
								//horizontal이 객체이면서 from, to 속성이 숫자일 때
								if(hasHorizontal) {
									rangeCode += 'screenWidth <= ' + rangeI.horizontal.from + ' && screenWidth >= ' + rangeI.horizontal.to;
								}
								
								//vertical이 객체이면서 from, to 속성이 숫자일 때
								if(hasVertical) {
									//가로가 있을경우
									if(hasHorizontal) {
										rangeCode += ' && ';
									}

									rangeCode += 'screenHeight <= ' + rangeI.vertical.from + ' && screenHeight >= ' + rangeI.vertical.to;
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

					//배열 또는 문자일 때
					if(typeof options.lowIE.property === 'string' || _getType(options.lowIE.property) === 'array') {
						_settings.lowIE.property = _removeDuplicate(options.lowIE.property);
					}
					
					//걸려 나온 게 없을 때
					if(!_settings.lowIE.property.length) {
						_settings.lowIE.run = true;
					}

					_$window.on('resize.responsive', function(event) {
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

						var beforeState = ['all'],
							afterState = ['allResized'],
							stateCookie = _getStateCookie();

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
							
							beforeState.push(stateAll);

							//적용시킬 상태가 있을 때
							if($.inArray(enterI, setState) > -1) {
								beforeState.push(enterI);
							}

							afterState.push(stateAll + 'Resized');
						}

						//이벤트 실행
						_callEvent(beforeState);

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
							_callEvent(afterState);

							//트리거 갱신
							if(_settings.triggerType) {
								_settings.triggerType = '';
								$.responsive.settings = _copyType(_settings);
							}
						}, interval);
					}).triggerHandler('resize.responsive');

					//요소 반환
					return _$html;
				};

				/**
				 * @name 소멸
				 * @since 2017-12-06
				 * @return {boolean}
				 */
				$.responsive.destroy = function() {
					var result = false;
					
					//플러그인을 실행 중일 때
					if(_settings.isRun) {
						_$window.off('resize.responsive');
						_$html.removeClass('scrollbar ' + _settings.browser + ' ' + _settings.platform + ' ' + _settings.nowState.join(' ') + ' ' + _settings.orientation);
						$('#responsive').remove();
						this.settings = _copyType(_initialSetting);
						_settings.isRun = false;
						_cookie.set('state', '', -1);
						result = true;
					}

					return result;
				};

				/**
				 * @name 분기 적용
				 * @since 2017-12-06
				 * @param {array || string} value
				 * @param {number} day
				 * @return {boolean || string}
				 */
				$.responsive.setState = function(value, day) {
					var result = false;
					
					//분기 이름 필터
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
						if(_getType(day) === 'number') {
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
				 * @description 기본 객체를 사용자에게 제공합니다.
				 */
				$.responsive.settings = _copyType(_initialSetting);
			});
		}else{
			throw '제이쿼리가 없습니다.';
		}
	})(window.jQuery);
}catch(error) {
	console.error(error);
}