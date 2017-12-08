# responsive v1.0
반응형 분기처리 플러그인이며 사용자가 분기를 지정하여 스크립트 처리를 쉽게 할 수 있습니다.

## 호출
윈도우 로드 이후 시점부터 쓸 수 있습니다. 이벤트는 호출이전에 적어놔야 합니다.
````
$.responsive({
    range : {
        wide : {
            from: 9999,
            to: 1201
        },
        web : {
            from: 1200,
            to: 801
        },
        tablet : {
            from: 800,
            to: 641
        },
        phone : {
            from: 640,
            to: 0
        }
    },
    lowIERun : false,
    lowIERange : ["web"],
    interval : 250
});

or

$.responsive();
````
$(window).triggerHandler("resize.responsive");가 기본으로 되어있고 콘솔에 현재상태가 표기됩니다.

### 옵션
#### range
range객체가 없을경우 기본으로 wide(9999 ~ 1201), web(1200 ~ 801), tablet(800 ~ 641), phone(640 ~ 0)이 넣어져 있습니다.
````
# : {
    from : n,
    to : n
}
````
##### \#
* 분기의 이름이며 사용자가 작명하여 사용한다.
* 반드시 소문자로만 작명해야 됩니다.
  * 대문자 + 소문자 섞어서 작성시 모두 소문자로 치환됩니다.
* 필터링 문자
  * 뒤에 resized가 붙은문자 또는 resized
  * 뒤에 none이 붙은문자 또는 none
  * 뒤에 all이 붙은문자 또는 all
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

###### from
시작지점 입니다.

###### to
끝지점 입니다.

*n*
값은 숫자만 사용가능하며 from에 숫자가 아니면 9999가 지정되고 to가 숫자가 아니면 0이 지정됩니다.

#### lowIERun
* ie7, ie8에서 분기 실행여부 입니다.
* 값은 boolean만 올 수 있습니다.
* lowIERun에 값이 없거나 프로퍼티가 없거나 boolean이 아닐경우 기본값은 false입니다.

#### lowIERange
* lowIERun을 true로 지정했을때 나타나는 분기입니다.
* range에서 지정한 분기를 몇개든 넣으면 ie7, ie8에서 지정한 분기만 보여주게 됩니다.
* lowIERange의 값이 없거나 프로퍼티가 없을경우 기본값은 web입니다.
* 중복으로 적은 값은 제거 됩니다.
* 작성우선순위와 관련 있습니다.

#### interval
* 리사이즈 발생 후 몇초후에 함수를 실행할지 지정하는 변수입니다.
* interval의 값이 없거나 프로퍼티가 없거나 숫자가 아닐경우 기본값은 250입니다.
* 밀리세컨드 단위이며 숫자만 올 수 있습니다.

### 메소드

이름 | 매개변수 | 반환 | 설명
| :--: | :---- | :-- | :-- |
$.responsive.destroy |  | boolean | 플러그인을 소멸시키는 함수 입니다.

### $.responsive.setting

이름 | 값 | 설명
| :-- | :- | :-- |
hasHorizontalScrollbar | boolean | 지정한 객체에 가로스크롤바가 있는지 확인하는 변수입니다.
hasVerticalScrollbar | boolean | 지정한 객체에 세로스크롤바가 있는지 확인하는 변수입니다.
isRun | boolean | 플러그인이 실행됬는지 확인하는 변수입니다.
isLowIE | boolean | 브라우저가 ie7 또는 ie8인지 확인하는 변수입니다.
isResize | boolean | 리사이즈 중인지 확인하는 변수입니다.
isScreenChage | boolean | 넓이 또는 높이가 변경되었는지 확인하는 변수입니다.
isScreenHeightChange | boolean | 높이가 변경되었는지 확인하는 변수입니다.
isScreenWidthChange | boolean | 넓이가 변경되었는지 확인하는 변수입니다.
isScreenWidthAndHeightChange | boolean | 넓이와 높이가 변경되었는지 확인하는 변수입니다.
lowIERun | boolean | 플러그인 옵션중 lowIERun의 값입니다.
enter | array | 지정한 분기범위에 들어온 이름입니다.
exit | array | 지정한 분기범위에 나간 이름입니다.
lowIERange | array | 플러그인 옵션중 lowIERange의 값입니다.
nowState | array | 현재상태에 대한 값입니다.
prevState | array | 이전상태에 대한 값입니다.
loadedHeight | number | 최초의 창의 높이입니다.
loadedWidth | number | 최초의 창의 넓이입니다.
windowHeight | number | 창의 높이값 입니다.
windowWidth | number | 창의 넓이값 입니다.
scrollbarWidth | number | 브라우저의 스크롤바 넓이에 대한 값이며 모바일에서 브라우저의 스크롤바의 넓이는 0이며 컴퓨터에서 접속한 브라우저의 스크롤바의 넓이는 브라우저마다 다릅니다.
browser | string | 현재 접속한 브라우저가 무엇인지 확인하고 값은 ie7, ie8, ie9, ie10, ie11, edge, opera, chrome, firefox, safari, unknown값이 나옵니다. 브라우저를 찾지 못하면 unknown이라는 값이 나오게 됩니다.
platform | string | 현재 접속한 기기가 무엇인지 확인하고 컴퓨터에서 접속하면 pc가 나오게되며 모바일 기기에서 접속하면 mobile이라는 값이 나오게 됩니다.

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
이벤트는 $(window)객체에 걸어야 합니다.

이름 | 값 | 설명
| :-- | :- | :-- |
responsive | object | $.responsive.setting설명과 같습니다.
state | string or array | 범위에 걸린 분기이름입니다.

#### 기본
````
$(window).on("responsive", function(event) {
    console.log(event);
    console.log(event.responsive);
    console.log(event.state);
});
````

#### 필터
````
$(window).on("responsive:#", function(event) {
    console.log(event);
    console.log(event.responsive);
    console.log(event.state);
});
````
* 콜론(:)을 이어붙여 다중필터도 가능합니다.
* #은 지정한 분기이름 입니다.
* range객체에 적은 우선순위 대로 작성해주시면 됩니다.

### 클래스
* 브라우저 : ie7, ie8, ie9, ie10, ie11, edge, opera, chrome, firefox, safari, unknown 중에서 해당되는 브라우저로 클래스가 부여됩니다.
  * 브라우저를 찾지 못하면 unknown이라는 클래스가 나오게 됩니다.
* 플랫폼 : pc, mobile중에서 접속한 플랫폼으로 클래스가 부여됩니다.
* 스크롤바 : 스크롤바 넓이가 있으면 scrollbar라는 클래스가 부여됩니다.
* 분기 : 플러그인 옵션중 range에 적은 프로퍼티 이름이 클래스로 부여됩니다.

### 제이쿼리 개발버전
1.12.4

### 브라우저 지원
모든 브라우저를 지원합니다.