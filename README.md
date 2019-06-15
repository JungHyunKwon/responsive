# screen v1.0.0
````javascript
$.screen({
	state : [{
		name : 'wide',
		horizontal : {
			from : 9999,
			to : 1201
		}
	}, {
		name : 'web',
		horizontal : {
			from : 1200,
			to : 1001
		}
	}, {
		name : 'tablet',
		horizontal : {
			from : 1000,
			to : 641
		}
	}, {
		name : 'phone',
		horizontal : {
			from : 640,
			to : 0
		}
	}]
});
````

## 옵션

### state(Array)
상태의 목록입니다.

#### name(String)
상태의 이름입니다.

#### horizontal(Object)
가로에 대한 범위입니다.

#### vertical(Object)
세로에 대한 범위입니다.

##### from(Number)
시작점입니다.

##### to(Number)
끝점입니다.

## $.screen 메서드

이름 | 매개변수 | 반환 | 설명
| :-- | :---- | :-- | :-- |
destroy | | | 플러그인을 소멸시키는 함수입니다.
setState | array \|\| string | boolean | 상태를 적용할 수 있습니다.

## $.screen.settings

이름 | 형태 | 설명
| :-- | :-- | :-- |
hasHorizontalScrollbar | boolean | 가로 스크롤바 여부
hasVerticalScrollbar | boolean | 세로 스크롤바 여부
scrollbarSize | number | 스크롤바 크기
isChangedWidth | boolean | 화면 넓이 변경 여부
isChangedHeight | boolean | 화면 높이 변경 여부
width | number | 화면 넓이
height | number | 화면 높이
state | array | 상태
name | array | 이름
					
## 상태
1. resize : 리사이즈 했을 때
2. resize:# : 리사이즈 했을 때 + 상태
3. \# : 상태
4. resized  : 리사이즈가 끝났을 때
5. resized:# : 리사이즈가 끝났을 때 + 상태

위 우선순위로 출력 됩니다.

## event

이름 | 형태 | 설명
| :-- | :-- | :-- |
state | string | 상태

### 이벤트
````javascript
$(window).on('screen', function(event) {
     console.log(event);
     console.log(event.state);
});
````

### 필터 이벤트
````javascript
$(window).on('screen:#', function(event) {
     console.log(event);
     console.log(event.state);
});
````

\#은 상태 입니다.

### 제이쿼리 버전
1.12.4

### 브라우저 지원
ie7 이상 그 이외 브라우저 모두 지원합니다.