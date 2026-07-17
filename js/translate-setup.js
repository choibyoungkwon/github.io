// 다국어 번역 설정 - 모든 페이지에서 공유하는 스크립트

// 1. localStorage에서 저장된 언어 가져오기
function getSavedLanguage() {
	return localStorage.getItem('jb-design-language') || 'ko';
}

// 2. 언어 버튼 이벤트 리스너
function initLanguageButtons() {
	const buttons = document.querySelectorAll('.language-btn');
	const savedLang = getSavedLanguage();
	
	buttons.forEach(button => {
		const lang = button.getAttribute('data-lang');
		
		// 저장된 언어에 맞게 active 클래스 설정
		if (lang === savedLang) {
			button.classList.add('active');
		}
		
		// 클릭 이벤트
		button.addEventListener('click', function(e) {
			e.preventDefault();
			
			// 모든 버튼에서 active 클래스 제거
			buttons.forEach(btn => btn.classList.remove('active'));
			
			// 클릭한 버튼에 active 클래스 추가
			this.classList.add('active');
			
			// localStorage에 언어 저장
			localStorage.setItem('jb-design-language', lang);
			
			// Google Translate 언어 변경
			translatePage(lang);
		});
	});
}

// 3. Google Translate API를 사용한 번역 함수
function translatePage(lang) {
	if (lang === 'ko') {
		// 한글로 되돌리기 - 페이지 새로고침
		location.reload();
	} else {
		// Google Translate 로드 및 실행
		loadGoogleTranslate(lang);
	}
}

// 4. Google Translate 스크립트 로드 및 실행
function loadGoogleTranslate(lang) {
	// Google Translate가 이미 로드된 경우
	if (typeof google !== 'undefined' && typeof google.translate !== 'undefined') {
		executeTranslate(lang);
	} else {
		// Google Translate 스크립트 동적 로드
		const script = document.createElement('script');
		script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
		document.head.appendChild(script);
		
		// 콜백 함수 설정
		window.googleTranslateElementInit = function() {
			new google.translate.TranslateElement({
				pageLanguage: 'ko',
				includedLanguages: 'ko,en,vi,ja,zh-CN',
				layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
				autoDisplay: false
			}, 'google_translate_element');
			
			executeTranslate(lang);
		};
	}
}

// 5. 실제 번역 실행
function executeTranslate(lang) {
	const langMap = {
		'en': 'en',
		'vi': 'vi',
		'ja': 'ja',
		'zh-CN': 'zh-CN'
	};
	
	const targetLang = langMap[lang] || 'en';
	
	// Google Translate 요소 찾기
	const googleTranslateElement = document.querySelector('.goog-te-combo');
	
	if (googleTranslateElement) {
		// 언어 선택
		googleTranslateElement.value = targetLang;
		
		// 변경 이벤트 트리거
		googleTranslateElement.dispatchEvent(new Event('change'));
	} else {
		// 재시도 (짧은 지연 후)
		setTimeout(() => executeTranslate(lang), 500);
	}
}

// 6. 페이지 로드 시 저장된 언어로 번역
document.addEventListener('DOMContentLoaded', function() {
	// 언어 버튼 초기화
	initLanguageButtons();
	
	// 저장된 언어가 한글이 아닌 경우 자동 번역
	const savedLang = getSavedLanguage();
	if (savedLang !== 'ko') {
		// 약간의 딜레이 후 번역 실행
		setTimeout(() => {
			translatePage(savedLang);
		}, 500);
	}
});

// 7. Google Translate 스타일 숨김 (필요시)
document.addEventListener('DOMContentLoaded', function() {
	const style = document.createElement('style');
	style.textContent = `
		.goog-te-banner-frame { display: none; }
		.goog-te-combo { display: none; }
		.skiptranslate { display: none; }
		body { top: 0 !important; }
	`;
	document.head.appendChild(style);
});