# responsive v1.0
반응형 분기처리 플러그인이며 사용자가 분기를 지정하여 스타일, 스크립트 처리를 쉽게 할 수 있습니다.

## 호출
````javascript
$.responsive({
    range : {
	wide : {
	    horizontal : {
		from : 9999,
		to : 1201
	    }
	},
	web : {
	    horizontal : {
		from : 1200,
		to : 801
	    }
	},
	tablet : {
	    horizontal : {
		from : 800,
		to : 641
	    }
	},
	phone : {
	    horizontal : {
		from : 640,
		to : 0
	    }
	}
    },
    lowIE : {
	property : ['web']
    },
    inheritClass : false
});
````

$(window).triggerHandler('resize.responsive');가 기본으로 되어있고 콘솔에 현재상태가 표기됩니다.

### 옵션

#### range
range가 객체가 아니거나 객체안에 프로퍼티가 없을경우 none이 떨어집니다.

````javascript
# : {
    horizontal : {
	from : n,
	to : n
    },
    vertical : {
	from : n,
	to : n
    }
}
````
##### \#
분기의 이름이며 사용자가 작명하여 사용한다.

###### 필터링
* 뒤에 Resized가 붙은문자
* 뒤에 All이 붙은문자
* all
* none
* pc
* mobile
* scrollbar
* ie7
* ie8
* ie9
* ie10
* ie11
* edge
* opera
* chrome
* firefox
* safari
* unknown
* square
* portrait
* landscape

###### horizontal
* 가로에 대한 범위 입니다.
* horizontal이 객체가 아닐경우 제외됩니다.

###### vertical
* 세로에 대한 범위 입니다.
* vertical이 객체가 아닐경우 제외됩니다.

*from*
시작지점 입니다.

*to*
종료지점 입니다.

from과 to가 숫자가 아닐경우 horizontal 또는 vertical은 제외됩니다.

*n*
값은 숫자만 사용가능합니다.

#### lowIE
ie7 또는 ie8에서의 옵션 입니다.

````javascript
lowIE : {
    property : ['#']
}
````

##### property
* range에서 지정한 분기를 몇개든 넣으면 ie7, ie8에서 지정한 분기만 보여주게 됩니다.
* range에 작성한 프로퍼티명에서 필터링된 이름에서 없을경우 ie7 또는 ie8에서 분기제한이 걸리지 않습니다. 
* 중복으로 적은 값은 제거 됩니다.
* 작성우선순위와 관련 있습니다.

#### inheritClass
클래스를 상속여부 입니다.

* 값은 불린만 사용가능합니다.
* true일경우 tablet상태라면 wide, web클래스도 가지고있습니다. false일경우 tablet상태라면 wide, web상태는 없고 tablet클래스만 가지고 있습니다.

### 메소드

이름 | 매개변수 | 반환 | 설명
| :-- | :---- | :-- | :-- |
$.responsive.destroy |  | boolean | 플러그인을 소멸시키는 함수 입니다.

### $.responsive.setting

이름 | 형태 | 설명
| :-- | :- | :-- |
hasHorizontalScrollbar | boolean | 가로스크롤바가 있는지 확인하는 변수입니다.
hasVerticalScrollbar | boolean | 세로스크롤바가 있는지 확인하는 변수입니다.
isRun | boolean | 플러그인이 실행됬는지 확인하는 변수입니다.
isResize | boolean | 리사이즈 중인지 확인하는 변수입니다.
isScreenChage | boolean | 넓이 또는 높이가 변경되었는지 확인하는 변수입니다.
isScreenHeightChange | boolean | 높이가 변경되었는지 확인하는 변수입니다.
isScreenWidthChange | boolean | 넓이가 변경되었는지 확인하는 변수입니다.
isScreenWidthAndHeightChange | boolean | 넓이와 높이가 변경되었는지 확인하는 변수입니다.
lowIE | object | <ul><li>is(boolean) : 브라우저가 ie7 또는 ie8인지 확인하는 변수입니다.</li><li>property(array) : lowIE에 property에 작성한 값을 토대로 반영된 값 입니다.</li><li>run(boolean) :  property가 있으면 false가 나오고 없으면 true로 나옵니다.</li></ul>
range | object | property(array) : 플러그인 옵션에서 range에 작성한 값을 토대로 반영된 값 입니다.
rangeProperty | array | 플러그인 옵션에서 range에 작성한 값을 토대로 반영된 프로퍼티명 입니다.
exit | array | 분기범위에서 나간 이름입니다.
nowState | array | 현재상태에 대한 값입니다.
prevState | array | 이전상태에 대한 값입니다.
orientation | string | 가로, 세로가 같을때 square가 나오고 세로보다 가로가 더 클때 landscape가 나오고 가로보다 세로가 더 클때 portrait라는 값이 나옵니다.
loadedScreenWidth | number | 로드되었을때 창의 넓이입니다.
loadedScreenHeight | number | 로드되었을때 창의 높이입니다.
screenWidth | number | 창의 넓이입니다.
screenHeight | number | 창의 높이입니다.
scrollbarWidth | number | 브라우저 스크롤바 넓이에 대한 값입니다.
browser | string | 현재 접속한 브라우저가 무엇인지 확인하고 값은 ie7, ie8, ie9, ie10, ie11, edge, opera, chrome, firefox, safari, unknown값이 나옵니다. 브라우저를 찾지 못하면 unknown이라는 값이 나오게 됩니다.
platform | string | 현재 접속한 기기가 무엇인지 확인하고 컴퓨터에서 접속하면 pc가 나오게되며 그 이외로는 mobile이라는 값이 나오게 됩니다.
inheritClass | object | <ul><li>is(boolean) : 플러그인 옵션에서 inheritClass에 작성한 값입니다.</li><li>property(array) : 상속된 프로퍼티명 입니다.</li></ul>
triggerType | string | resize 또는 resize.responsive 이벤트를 trigger 또는 triggerHandler로 호출했을때 어떤 메소드로 호출했는지 알수있는 변수입니다. trigger 또는 triggerHandler에의한 호출이 아니거나 모든 이벤트의 호출이 끝나면 공백이 나옵니다.

### 상태, 우선순위
1. all
2. #All
3. \#
4. noneAll
5. none
6. allResized
7. #AllResized
8. noneAllResized

### 이벤트
이벤트는 $(window)에 걸어야 합니다.

이름 | 형태 | 설명
| :-- | :- | :-- |
state | string | 범위에 걸린 분기이름입니다.
setting | object | $.responsive.setting과 같습니다.

걸린시점의 값이 떨어집니다.

#### 기본
````javascript
$(window).on('responsive', function(event) {
     console.log(event);
     console.log(event.state);
     console.log(event.setting);
});
````

#### 필터
````javascript
$(window).on('responsive:#', function(event) {
     console.log(event);
     console.log(event.state);
     console.log(event.setting);
});
````
* #은 range에 적은 프로퍼티가 분기이름 입니다.

### 클래스
* 브라우저 : ie7, ie8, ie9, ie10, ie11, edge, opera, chrome, firefox, safari, unknown 중에서 해당되는 브라우저로 클래스가 부여됩니다.
  * 브라우저를 찾지 못하면 unknown이라는 클래스가 나오게 됩니다.
* 플랫폼 : pc, mobile중에서 접속한 플랫폼으로 클래스가 부여됩니다.
* 스크롤바 : 스크롤바 넓이가 있으면 scrollbar라는 클래스가 부여됩니다.
* 분기 : 플러그인 옵션중 range에 적은 프로퍼티명이 클래스로 부여됩니다.
* 방향 : 가로, 세로가 같을때 square가 나오고 세로보다 가로가 더 클때 landscape가 나오고 가로보다 세로가 더 클때 portrait라는 값이 나옵니다.

### 제이쿼리 개발버전
1.12.4

### 브라우저 지원
ie7이상 그 이외 브라우저 모두 지원합니다.