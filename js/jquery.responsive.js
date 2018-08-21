/**
 * @author JungHyunKwon
 * @version 1.0.0
 */
try {
	'use strict';

	(function($) {
		//제이쿼리가 함수일때
		if(typeof $ === 'function') {
			var _$window = $(window),
				_connectedState = _getConnectedState(),
				_isLowIE = _connectedState.browser === 'ie7' || _connectedState.browser === 'ie8',
				_setting = {},
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
						
						//문자일때
						if(typeof name === 'string' && typeof value === 'string') {
							//숫자가 아닐때
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
					 * @name 쿠키값 얻기
					 * @since 2017-01-16
					 * @param {string} name
					 * @return {string}
					 */
					get : function(name) {
						var cookie = document.cookie.split(';'),
							result = '';
						
						//문자일때
						if(typeof name === 'string') {
							for(var i = 0, cookieLength = cookie.length; i < cookieLength; i++) {
								var cookieI = cookie[i];
								
								//첫번째 글자가 공백일때
								while(cookieI.charAt(0) === ' ') {
									cookieI = cookieI.substring(1);
									break;
								}
								
								//쿠키값이 있을때
								if(cookieI.indexOf(name) > -1) {
									result = unescape(cookieI.substring(name.length + 1, cookieI.length));
									break;
								}
							}
						}

						return result;
					}
				};

			/**
			 * @name 형태얻기
			 * @since 2017-12-06
			 * @param {*} value
			 * @return {string || undefined}
			 */
			function _getType(value) {
				var result;
				
				//매개변수가 있을때
				if(arguments.length) {
					//null일때
					if(value === null) {
						result = 'null';
					
					//undefined일때
					}else if(value === undefined) {
						result = 'undefined';
					}else{
						result = Object.prototype.toString.call(value).toLowerCase().replace('[object ', '').replace(']', '');
						
						//Invalid Date일때
						if(result === 'date' && isNaN(new Date(value))) {
							result = 'Invalid Date';
						
						//숫자일때
						}else if(result === 'number') {
							//NaN일때
							if(isNaN(value)) {
								result = 'NaN';
							
							//Infinity일때
							}else if(!isFinite(value)) {
								result = value.toString();
							}
						}else if(result === 'console') {
							result = 'object';
						}
					}
				}

				return result;
			}

			/**
			 * @name 요소 또는 제이쿼리 요소 확인
			 * @since 2017-12-06
			 * @param {window || document || element || jQueryElement} element
			 * @return {boolean}
			 */
			function _isElement(element) {
				var result = false;

				/**
				 * @name 요소확인
				 * @since 2017-12-06
				 * @param {window || document || element} element
				 * @return {boolean}
				 */
				function isElement(element) {
					var result = false;
					
					try {
						result = document.documentElement.contains(element);
					}catch(error) {
						//console.error(error);
					}

					//window 또는 document일때
					if(element === window || element === document) {
						result = true;						
					}

					return result;
				}

				/**
				 * @name 제이쿼리 요소확인
				 * @since 2017-12-06
				 * @param {jQueryElement || jQueryObject} element
				 * @return {boolean}
				 */
				function isJQueryElement(element) {
					var result = false;

					//제이쿼리 객체일때
					if(element instanceof $) {
						var elementLength = element.length;
						
						result = [];

						for(var i = 0; i < elementLength; i++) {
							var elementI = element[i];

							if(isElement(elementI)) {
								result.push(elementI);
							}
						}

						var resultLength = result.length;

						//제이쿼리 요소일때
						if(resultLength && elementLength === resultLength) {
							result = true;
						}else{
							result = false;
						}
					}

					return result;
				}
				
				//window 또는 document 또는 요소 또는 제이쿼리 요소일때
				if(isElement(element) || isJQueryElement(element)) {
					result = true;
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
					result = value;

				//객체일때
				if(valueType === 'object') {
					result = $.extend(true, {}, value);
				
				//배열일때
				}else if(valueType === 'array') {
					result = value.slice();
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
				var result = [];
				
				//문자일때
				if(typeof value === 'string') {
					value = [value];
				
				//배열이 아닐때
				}else if(_getType(value) !== 'array') {
					value = [];
				}

				//배열 val에 매개변수 value에 i번째 값이 없으면 집어넣는다.
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
				
				//배열일때
				if(_getType(standard) === 'array') {
					//문자일때
					if(typeof value === 'string') {
						value = [value];
					
					//배열이 아닐때
					}else if(_getType(value) !== 'array') {
						value = [];
					}

					for(var i = 0, valueLength = value.length; i < valueLength; i++) {
						var valueI = value[i];
						
						//등록된 프로퍼티가 있을때
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
			 * @name 상태 쿠키얻기
			 * @since 2017-12-06
			 * @return {array}
			 */
			function _getStateCookie() {
				return _removeDuplicate(_filter(_cookie.get('state').split(','), _setting.rangeProperty).truth);
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
					var $element = $(element),
						result = [];
					
					//요소가 없을때 대체
					if(!_isElement($element)) {
						$element = $('#scrollbar');
						
						//스크롤바 요소가 없을때
						if(!$element.length) {
							$element = $('<div id="scrollbar">&nbsp;</div>').appendTo('body');
						}
					}
					
					for(var i = 0, elementLength = $element.length; i < elementLength; i++) {
						var elementI = $element[i];

						result.push(elementI.offsetWidth - elementI.clientWidth || 0);
					}
					
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
				 * @param {boolean} parentsToo
				 * @return {object || array}
				 */
				function _hasScrollbar(element, parentsToo) {
					var $element = $(element),
						result = [];
					
					//소문자 치환
					if(typeof parentsToo !== 'boolean') {
						parentsToo = false;
					}
					
					//받은요소 갯수만큼 루프
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
					
						//부모까지 조사시키는 타입이 들어왔을때
						if(parentsToo) {
							var $parents = $elementI.add($elementI.parents());

							scrollbar.horizontal = [];
							scrollbar.vertical = [];
							
							//상위부모 반복
							for(var j = 0, parentsLength = $parents.length; j < parentsLength; j++) {
								var hasScrollbar = _hasScrollbar($parents[j]);

								scrollbar.horizontal.push(hasScrollbar.horizontal);
								scrollbar.vertical.push(hasScrollbar.vertical);
							}

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
							if((elementI.scrollWidth > elementI.clientWidth && overflow.x !== 'hidden') || overflow.x === 'scroll') {
								scrollbar.horizontal = true;
							}
							
							//clineHeight보다 scrollHeight가 더 크면서 overflow-y가 hidden이 아니거나 overflow-y가 scroll일때
							if((elementI.scrollHeight > elementI.clientHeight && overflow.y !== 'hidden') || overflow.y === 'scroll') {
								scrollbar.vertical = true;
							}
						}
						
						//결과 기입
						result.push(scrollbar);
					}
					
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
				 * @name 기본옵션 얻기
				 * @since 2017-12-06
				 * @return {object}
				 */
				function _getDefaultObject() {
					var hasScrollbar = _hasScrollbar(_$body[0], true),
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
						isResize : false,
						triggerType : '',
						isScreenChange : false,
						isScreenWidthChange : false,
						isScreenHeightChange : false,
						isScreenWidthAndHeightChange : false
					});
				}

				/**
				 * @name 상태 적용
				 * @since 2017-12-06
				 * @param {array || string} value
				 * @return {array}
				 */
				function _setState(value) {
					//중복제거
					value = _removeDuplicate(value);
					
					var nowState = _copyType(_setting.nowState),
						result = _filter(value, _setting.nowState).untruth;

					//현재상태와 적용시킬 상태가 다를때
					if((_copyType(value).sort() + '') !== (nowState.sort() + '')) {
						//현재상태 클래스 제거
						_$body.removeClass(nowState.join(' '));

						//새로운상태 클래스 추가
						_$body.addClass(value.join(' '));

						//이전상태 추가
						_setting.prevState = nowState;

						//새로운상태 추가
						_setting.nowState = value;

						//console에 상태표기
						console.log('현재상태 : ' + value.join(', '));
					}
					
					return result;
				}

				/**
				 * @name 분기이벤트 실행
				 * @since 2017-12-06
				 * @param {array || string} value
				 * @return {object}
				 */
				function _callEvent(value) {
					var event = {
							setting : _copyType(_setting)
						};

					//전역객체 갱신
					$.responsive.setting = _copyType(event.setting);

					//중복제거
					value = _removeDuplicate(value);

					for(var i = 0, valueLength = value.length; i < valueLength; i++) {
						var valueI = value[i];

						//분기값 적용
						event.state = valueI;

						//모든 이벤트 호출
						_$window.triggerHandler($.Event('responsive', event));

						//필터 이벤트 호출
						_$window.triggerHandler($.Event('responsive:' + valueI, event));
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
					var hasScrollbar = _hasScrollbar(_$body[0], true);

					//객체가 아닐때
					if(_getType(event) !== 'object') {
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
					var rangeCode = 'var enter = [],\n\texit = [];\n\nif(!_setting.lowIE.run && _isLowIE) {\n\tenter = _setting.lowIE.property;\n}else{\n',
						rangeProperty = [],
						screenWidth = 0,
						screenHeight = 0,
						timer = 0,
						interval = 250;

					//소멸
					$.responsive.destroy();

					//기본객체
					_setting = _getDefaultObject();

					//실행등록
					_setting.isRun = true;

					//브라우저, 플랫폼 클래스 추가
					_$body.addClass(_setting.browser + ' ' + _setting.platform);
					
					//객체가 아닐때
					if(_getType(option) !== 'object') {
						option = {};
					}

					//객체가 아닐때
					if(_getType(option.lowIE) !== 'object') {
						option.lowIE = {};
					}

					//객체가 아닐때
					if(_getType(option.range) !== 'object') {
						option.range = {};
					}

					//option.range에 적은 값을 기준으로 자바스크립트 코드 생성
					for(var i in option.range) {
						var rangeI = option.range[i];

						//필터링
						if(_getType(rangeI) === 'object' && i !== 'square' && i !== 'portrait' && i !== 'landscape' && i.substr(-3) !== 'All' && i.substr(-7) !== 'Resized' && i !== 'none' && i.substr(-3) !== 'all' && i !== 'mobile' && i !== 'pc' && i !== 'ie7' && i !== 'ie8' && i !== 'ie9' && i !== 'ie10' && i !== 'ie11' && i !== 'scrollbar' && i !== 'edge' && i !== 'opera' && i !== 'chrome' && i !== 'firefox' && i !== 'safari' && i !== 'unknown') {
							var hasHorizontal = false,
								hasVertical = false;

							//horizontal이 객체이면서 from, to 프로퍼티가 숫자일때
							if(_getType(rangeI.horizontal) === 'object' && typeof rangeI.horizontal.from === 'number' && typeof rangeI.horizontal.to === 'number') {
								hasHorizontal = true;
							}
							
							//vertical이 객체이면서 from, to 프로퍼티가 숫자일때
							if(_getType(rangeI.vertical) === 'object' && typeof rangeI.vertical.from === 'number' && typeof rangeI.vertical.to === 'number') {
								hasVertical = true;
							}
							
							//horizontal이 객체이면서 from, to 프로퍼티가 숫자이거나 vertical이 객체이면서 from, to 프로퍼티가 숫자일때
							if(hasHorizontal || hasVertical) {
								rangeCode += '\tif(';
								
								//horizontal이 객체이면서 from, to 프로퍼티가 숫자일때
								if(hasHorizontal) {
									rangeCode += 'screenWidth <= ' + rangeI.horizontal.from + ' && screenWidth >= ' + rangeI.horizontal.to;
								}
								
								//vertical이 객체이면서 from, to 프로퍼티가 숫자일때
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

								_setting.rangeProperty.push(i);
								_setting.range[i] = rangeI;
							}
						}
					}

					rangeCode = rangeCode.replace(/\n$/, '');
					rangeCode += '}';
					//rangeCode작성 끝

					//배열 또는 문자일때
					if(typeof option.lowIE.property === 'string' || _getType(option.lowIE.property) === 'array') {
						_setting.lowIE.property = _removeDuplicate(option.lowIE.property);
					}
					
					//걸려나온게 없을때
					if(!_setting.lowIE.property.length) {
						_setting.lowIE.run = true;
					}

					_$window.on('resize.responsive', function(event) {
						//화면정보 갱신
						_setScreenInfo(event);

						//리사이즈 중
						_setting.isResize = true;

						//기존의 스크린 넓이와 새로부여받은 스크린 넓이가 같은지 확인
						if(_setting.screenWidth !== screenWidth) {
							screenWidth = _setting.screenWidth;
							_setting.isScreenWidthChange = true;
						}

						//기존의 스크린 높이와 새로부여받은 스크린 높이가 같은지 확인
						if(_setting.screenHeight !== screenHeight) {
							screenHeight = _setting.screenHeight;
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
							//범위실행
							eval(rangeCode);

							var beforeState = ['all'],
								afterState = ['allResized'],
								stateCookie = _getStateCookie();

							//적용시킬 분기가 없을때
							if(!enter.length) {
								enter[0] = 'none';
							}

							//적용시킬 쿠키가 있을때
							if(stateCookie.length) {
								enter = stateCookie;
							}
							
							//분기적용
							var setState = _setState(enter);

							//분기분류
							for(var i = 0, enterLength = enter.length; i < enterLength; i++) {
								var enterI = enter[i],
									stateAll = enterI + 'All';
								
								beforeState.push(stateAll);

								//적용시킬 상태가 있을때
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
								//화면정보 갱신
								_setScreenInfo(event);

								//이벤트 실행
								_callEvent(afterState);

								//트리거 갱신
								if(_setting.triggerType) {
									_setting.triggerType = '';
									$.responsive.setting = _copyType(_setting);
								}
							}, interval);
						}
					}).triggerHandler('resize.responsive');

					//요소 반환
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
						this.setting = _copyType(_initialSetting);
						_setting.isRun = false;
						_cookie.set('state', '', -1);
						result = true;
					}

					return result;
				};

				/**
				 * @name 분기적용
				 * @since 2017-12-06
				 * @param {array || string} value
				 * @param {number} day
				 * @return {boolean || string}
				 */
				$.responsive.setState = function(value, day) {
					var result = false;
					
					//분기이름 필터
					value = _filter(value, _setting.rangeProperty).truth;

					//적용시킬 상태가 있으면
					if(value.length) {
						//분기적용
						var setState = _setState(value);
						
						//적용시킬 상태가 있을때
						if(setState.length) {
							//이벤트 실행
							_callEvent(setState);
							
							//결과 변경
							result = true;
						}
						
						//숫자일때
						if(_getType(day) === 'number') {
							//쿠키적용
							if(_cookie.set('state', value.join(','), day)) {
								result = true;
							}

							//0이하일때
							if(day <= 0) {
								result = 'delete';
							}
						}
					}

					return result;
				};
				
				/**
				 * @name 상태 쿠키얻기
				 * @since 2017-12-06
				 * @return {array}
				 */
				$.responsive.getStateCookie = _getStateCookie;

				/**
				 * @description 기본 객체를 사용자에게 제공합니다.
				 */
				$.responsive.setting = _copyType(_initialSetting);
			});
		}else{
			throw '제이쿼리가 없습니다.';
		}
	})(window.jQuery);
}catch(error) {
	console.error(error);
}