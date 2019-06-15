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
				_html = document.documentElement,
				_htmlCss = _getCss(_html),
				_Event = $.Event,
				_extend = $.extend,
				_inArray = $.inArray,
				_isNumeric = $.isNumeric,
				_isArray = $.isArray,
				_element = document.getElementById('screen'),
				_settings = {};

			//요소가 없을 때
			if(!_element) {
				//요소 기입
				_element = document.createElement('div');

				//요소 아이디 기입
				_element.id = 'screen';
			}

			/**
			 * @name css 얻기
			 * @since 2019-01-18
			 * @param {element} element
			 * @return {object}
			 */
			function _getCss(element) {
				var result = {};

				try {
					result = element.currentStyle || getComputedStyle(element);
				}catch(e) {
					//throw e;
				}

				return result;
			}

			/**
			 * @name 배열 중복 제거
			 * @since 2017-12-06
			 * @param {array} value
			 * @return {array}
			 */
			function _deduplicateArray(value) {
				var result = [];

				for(var i = 0, valueLength = value.length; i < valueLength; i++) {
					var element = value[i];

					//값이 없을 때
					if(_inArray(element, result) === -1) {
						result.push(element);
					}
				}

				return result;
			}

			/**
			 * @name 배열 거르기
			 * @since 2017-12-06
			 * @param {array} value
			 * @param {array} array
			 * @return {object}
			 */
			function _filterArray(value, array) {
				var truth = [],
					untruth = [],
					result = {
						truth : truth,
						untruth : untruth
					};

				for(var i = 0, valueLength = value.length; i < valueLength; i++) {
					var element = value[i];

					//값이 있을 때
					if(_inArray(element, array) > -1) {
						truth.push(element);
					}else{
						untruth.push(element);
					}
				}

				return result;
			}

			/**
			 * @name 배열 정렬
			 * @since 2017-12-06
			 * @param {array} value
			 * @param {array} array
			 * @return {array}
			 */
			function _sortArray(value, array) {
				var result = [];

				for(var i = 0, valueLength = value.length; i < valueLength; i++) {
					var element = value[i],
						index = _inArray(element, array);

					//값이 있을 때
					if(index > -1) {
						result[index] = element;
					}
				}

				for(var i = 0; i < result.length; i++) {
					//속성이 없을 때
					if(!result.hasOwnProperty(i)) {
						result.splice(i, 1);
						i--;
					}
				}

				return result;
			}

			/**
			 * @name 스크롤바 크기 구하기
			 * @since 2017-12-06
			 * @return {number}
			 */
			function _getScrollbarSize() {
				return _element.offsetWidth - _element.clientWidth;
			}

			/**
			 * @name 스크롤바 여부
			 * @since 2017-12-06
			 * @return {object}
			 */
			function _hasScrollbar() {
				var overflowX = _htmlCss.overflowX,
					overflowY = _htmlCss.overflowY;

				return {
					horizontal : _html.scrollWidth > _html.clientWidth && overflowX !== 'hidden' || overflowX === 'scroll',
					vertical : _html.scrollHeight > _html.clientHeight && overflowY !== 'hidden' || overflowY === 'scroll'
				};
			}

			/**
			 * @name 상태 거르기
			 * @since 2017-12-06
			 * @param {array || string} value
			 * @return {array}
			 */
			function _filterState(value) {
				var result = [];

				//문자일 때
				if(typeof value === 'string') {
					value = [value];
				}

				//배열일 때
				if(_isArray(value)) {
					var name = _settings.name;

					//중복 제거 후 이름 값인 것만 걸러서 이름 순으로 정렬
					result = _sortArray(_filterArray(_deduplicateArray(value), name).truth, name);
				}

				return result;
			}

			/**
			 * @name 화면 설정
			 * @since 2017-12-06
			 */
			function _setScreen() {
				var hasScrollbar = _hasScrollbar(),
					hasHorizontalScrollbar = hasScrollbar.horizontal,
					hasVerticalScrollbar = hasScrollbar.vertical,
					scrollbarSize = _getScrollbarSize(),
					screenWidth = _$window.width(),
					screenHeight = _$window.height();

				//세로 스크롤바가 있을 때
				if(hasVerticalScrollbar) {
					screenWidth += scrollbarSize;
				}

				//가로 스크롤바가 있을 때
				if(hasHorizontalScrollbar) {
					screenHeight += scrollbarSize;
				}

				_settings.hasHorizontalScrollbar = hasHorizontalScrollbar;

				_settings.hasVerticalScrollbar = hasVerticalScrollbar;

				_settings.scrollbarSize = scrollbarSize;

				_settings.width = screenWidth;

				_settings.height = screenHeight;
			}

			/**
			 * @name 상태 지정
			 * @since 2017-12-06
			 * @param {array} value
			 * @return {object}
			 */
			function _setState(value) {
				var state = _settings.state,
					filterState = _filterArray(value, state),
					activeState = filterState.untruth,
					deactiveState = _filterArray(state, filterState.truth).untruth;

				//활성화 상태가 있거나 비활성화 상태가 있을 때
				if(activeState.length || deactiveState.length) {
					//상태 기입
					_settings.state = value;

					//상태 표기
					console.log('상태 : ' + value.join(', '));
				}

				return {
					activeState : activeState,
					deactiveState : deactiveState
				};
			}

			/**
			 * @name 이벤트
			 * @since 2017-12-06
			 * @param {array} value
			 */
			function _event(value) {
				var event = new _Event;

				//설정 지정
				_$screen.settings = _extend(_$screen.settings, _settings);

				for(var i = 0, valueLength = value.length; i < valueLength; i++) {
					var state = value[i];

					//이벤트 유형 기입
					event.type = 'screen';

					//상태 기입
					event.state = state;

					//이벤트 호출
					_$window.triggerHandler(event);

					//필터 이벤트 유형 기입
					event.type += ':' + state;

					//필터 이벤트 호출
					_$window.triggerHandler(event);
				}
			}

			/**
			 * @name 소멸
			 * @since 2017-12-06
			 */
			function _destroy() {
				//이벤트 제거
				_$window.off('resize.screen');

				//상태 초기화
				_settings.state = [];

				//설정 초기화
				_$screen.settings = undefined;

				//요소 제거
				$(_element).remove();
			}

			/**
			 * @name screen
			 * @since 2017-12-06
			 * @param {object} options {
			 *	   state : [{
			 *	       name : string,
			 *		   horizontal : {
			 *			   from : number,
			 *			   to : number
			 *		   },
			 *		   vertical : {
			 *			   from : number,
			 *			   to : number
			 *		   }
			 *	   }]
			 *  }
			 * @return {jQuery}
			 */
			var _$screen = $.screen = function(options) {
				//객체일 때
				if(options) {
					var state = options.state,
						name = [],
						width = 0,
						height = 0,
						timer = 0,
						code = 'var inState = [],\n    outState = [];\n\n';

					//소멸
					_destroy();

					//요소 추가
					_html.appendChild(_element);

					//배열일 때
					if(_isArray(state)) {
						for(var i = 0, stateLength = state.length; i < stateLength; i++) {
							var value = state[i];

							//객체일 때
							if(value) {
								var stateName = value.name;

								//문자일 때
								if(typeof stateName === 'string') {
									var horizontal = value.horizontal,
										hasHorizontal = false,
										vertical = value.vertical,
										hasVertical = false;

									//객체일 때
									if(horizontal) {
										var horizontalFrom = horizontal.from,
											horizontalTo = horizontal.to;

										//숫자가 아닐 때
										if(!_isNumeric(horizontalFrom)) {
											horizontalFrom = -1;
										}

										//숫자가 아닐 때
										if(!_isNumeric(horizontalTo)) {
											horizontalTo = -1;
										}

										//0 이상이면서 from이 to 이상으로 클 때
										if(horizontalFrom >= 0 && horizontalTo >= 0 && horizontalFrom >= horizontalTo) {
											hasHorizontal = true;
										}
									}

									if(vertical) {
										var verticalFrom = vertical.from,
											verticalTo = vertical.to;

										//숫자가 아닐 때
										if(!_isNumeric(verticalFrom)) {
											verticalFrom = -1;
										}

										//숫자가 아닐 때
										if(!_isNumeric(verticalTo)) {
											verticalTo = -1;
										}

										if(verticalFrom >= 0 && verticalTo >= 0 && verticalFrom >= verticalTo) {
											hasVertical = true;
										}
									}

									if(hasHorizontal || hasVertical) {
										code += 'if(';

										if(hasHorizontal) {
											code += 'width <= ' + horizontalFrom + ' && width >= ' + horizontalTo;
										}

										if(hasVertical) {
											if(hasHorizontal) {
												code += ' && ';
											}

											code += 'height <= ' + verticalFrom + ' && height >= ' + verticalTo;
										}

										code += ') {\n';
										code += '    inState.push(\'' + stateName + '\');\n';
										code += '}else{\n';
										code += '    outState.push(\'' + stateName + '\');\n';
										code += '}\n\n';

										name.push(stateName);
									}
								}
							}
						}
					}

					//이름 기입
					_settings.name = name;

					_$window.on('resize.screen', function(event) {
						//화면 설정
						_setScreen();

						var screenWidth = _settings.width,
							screenHeight = _settings.height,
							resizeState = [],
							resizedState = [],
							isChangedWidth = false,
							isChangedHeight = false,
							isTrigger = (event instanceof _Event) ? event.isTrigger : false;

						//현재 화면 넓이와 새로운 넓이가 다를 때
						if(screenWidth !== width) {
							width = screenWidth;

							isChangedWidth = true;
						}

						//현재 화면 높이와 새로운 높이가 다를 때
						if(screenHeight !== height) {
							height = screenHeight;

							isChangedHeight = true;
						}

						//트리거일 때
						if(isTrigger) {
							isChangedWidth = false;
							isChangedHeight = false;
						}

						//화면 변화 기입
						_settings.isChangedWidth = isChangedWidth;
						_settings.isChangedHeight = isChangedHeight;

						//코드 실행
						eval(code);

						//적용시킬 상태가 없을 때
						if(!inState.length) {
							inState[0] = 'none';
						}

						var setState = _setState(inState),
							activeState = setState.activeState;

						//트리거가 아닐 때
						if(!isTrigger) {
							resizeState[0] = 'resize';
							resizedState[0] = 'resized';
						}

						for(var i = 0, inStateLength = inState.length; i < inStateLength; i++) {
							var value = inState[i];

							//트리거가 아닐 때
							if(!isTrigger) {
								//리사이즈 상태 기입
								resizeState.push('resize:' + value);

								//리사이즈 종료 상태 기입
								resizedState.push('resized:' + value);
							}

							//적용시킨 상태가 있을 때
							if(_inArray(value, activeState) > -1) {
								//활성화 상태 기입
								resizeState.push(value);
							}
						}

						//이벤트 호출
						_event(resizeState);

						//타이머가 있을 때
						if(timer) {
							clearTimeout(timer);

							timer = 0;
						}

						timer = setTimeout(function() {
							//화면 설정
							_setScreen();

							//화면 변화 초기화
							_settings.isChangedWidth = false;
							_settings.isChangedHeight = false;

							//이벤트 호출
							_event(resizedState);
						}, 250);
					}).triggerHandler('resize.screen');
				}

				//요소 반환
				return _$window;
			};

			/**
			 * @name 소멸
			 * @since 2017-12-06
			 * @return {boolean}
			 */
			_$screen.destroy = _destroy;

			/**
			 * @name 상태 지정
			 * @since 2017-12-06
			 * @param {array || string} value
			 * @return {boolean}
			 */
			_$screen.setState = function(value) {
				var state = _filterState(value),
					result = false;

				//적용시킬 상태가 있을 때
				if(state.length) {
					var setState = _setState(state),
						activeState = setState.activeState;

					//활성화 상태가 있거나 비활성화 상태가 있을 때
					if(activeState.length || setState.deactiveState.length) {
						//활성화 이벤트 호출
						_event(activeState);

						//결과 기입
						result = true;
					}
				}

				return result;
			};
		}else{
			throw '제이쿼리가 없습니다.';
		}
	})(window.jQuery);
}catch(e) {
	console.error(e);
}