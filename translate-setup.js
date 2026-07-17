/**
 * 공유 번역 설정 스크립트
 * 모든 페이지에서 일관된 다국어 지원을 제공합니다
 */

// Google Translate 초기화
function googleTranslateElementInit() {
	new google.translate.TranslateElement({
		pageLanguage: 'ko',
		includedLanguages: 'ko,en,vi,ja,zh-CN'
	}, 'google_translate_element');
}

// localStorage에서 저장된 언어 불러오기
function loadSavedLanguage() {
	const savedLang = localStorage.getItem('selectedLanguage');
	if (savedLang && savedLang !== 'ko') {
		// Google Translate 로드 완료 대기
		setTimeout(() => {
			applyLanguage(savedLang);
		}, 2000);
	}
}

// 언어 적용 함수
function applyLanguage(lang) {
	const selectElement = document.querySelector('.goog-te-combo');
	if (selectElement) {
		selectElement.value = lang;
		selectElement.dispatchEvent(new Event('change'));
		updateLanguageButtons(lang);
	} else {
		// 요소가 없으면 재시도
		setTimeout(() => {
			applyLanguage(lang);
		}, 500);
	}
}

// 언어 버튼 상태 업데이트
function updateLanguageButtons(lang) {
	document.querySelectorAll('.language-btn').forEach(btn => {
		btn.classList.remove('active');
		if (btn.getAttribute('data-lang') === lang) {
			btn.classList.add('active');
		}
	});
}

// 언어 버튼 클릭 이벤트 설정
function setupLanguageButtons() {
	document.querySelectorAll('.language-btn').forEach(btn => {
		btn.addEventListener('click', function() {
			const lang = this.getAttribute('data-lang');
			
			// 활성 버튼 업데이트
			document.querySelectorAll('.language-btn').forEach(b => {
				b.classList.remove('active');
			});
			this.classList.add('active');

			// 언어 변경
			if (lang === 'ko') {
				// 한글로 돌아가기 - 페이지 새로고침
				localStorage.removeItem('selectedLanguage');
				location.reload();
			} else {
				// 선택한 언어 저장
				localStorage.setItem('selectedLanguage', lang);
				
				// Google Translate 사용
				const selectElement = document.querySelector('.goog-te-combo');
				if (selectElement) {
					selectElement.value = lang;
					selectElement.dispatchEvent(new Event('change'));
				} else {
					// Fallback: 잠시 후 재시도
					setTimeout(() => {
						const selectElement = document.querySelector('.goog-te-combo');
						if (selectElement) {
							selectElement.value = lang;
							selectElement.dispatchEvent(new Event('change'));
						}
					}, 1000);
				}
			}
		});
	});
}

// 언어 변경 감지 및 저장
function monitorLanguageChange() {
	const observer = new MutationObserver(function() {
		const selectElement = document.querySelector('.goog-te-combo');
		if (selectElement) {
			selectElement.addEventListener('change', function() {
				const selectedLang = this.value;
				if (selectedLang && selectedLang !== 'ko') {
					localStorage.setItem('selectedLanguage', selectedLang);
					updateLanguageButtons(selectedLang);
				}
			}, { once: false });
		}
	});

	observer.observe(document.body, { childList: true, subtree: true });
}

// 페이지 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', function() {
	// 언어 버튼이 있으면 클릭 이벤트 설정
	if (document.querySelector('.language-btn')) {
		setupLanguageButtons();
	}
	
	// 저장된 언어 불러오기
	loadSavedLanguage();
	
	// 언어 변경 감지
	monitorLanguageChange();
});

// Google Translate API 로드
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', function() {
		const script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
		document.head.appendChild(script);
	});
} else {
	const script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
	document.head.appendChild(script);
}
