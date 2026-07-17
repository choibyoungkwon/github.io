// 다국어 번역 설정을 관리하는 공유 스크립트
(function() {
	const LANGUAGE_KEY = 'jbdesign_language';
	const DEFAULT_LANGUAGE = 'ko';

	// Google Translate 초기화
	function initGoogleTranslate() {
		window.googleTranslateElementInit = function() {
			try {
				new google.translate.TranslateElement(
					{
						pageLanguage: DEFAULT_LANGUAGE,
						includedLanguages: 'ko,en,vi,ja,zh-CN',
						layout: google.translate.TranslateElement.InlineLayout.SIMPLE
					},
					'google_translate_element'
				);
			} catch (e) {
				console.log('Google Translate initialization pending...');
			}
		};

		// Google Translate 스크립트 로드
		if (!document.getElementById('google-translate-script')) {
			const script = document.createElement('script');
			script.id = 'google-translate-script';
			script.type = 'text/javascript';
			script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
			document.head.appendChild(script);
		}
	}

	// 저장된 언어 설정 가져오기
	function getSavedLanguage() {
		return localStorage.getItem(LANGUAGE_KEY) || DEFAULT_LANGUAGE;
	}

	// 언어 설정 저장
	function saveLanguage(lang) {
		localStorage.setItem(LANGUAGE_KEY, lang);
	}

	// Google Translate 콤보박스에서 언어 변경
	function changeLanguage(lang) {
		if (lang === DEFAULT_LANGUAGE) {
			// 한글로 돌아가기
			location.reload();
			return;
		}

		// Google Translate 드롭다운에서 언어 선택
		const selectElement = document.querySelector('.goog-te-combo');
		if (selectElement) {
			selectElement.value = lang;
			selectElement.dispatchEvent(new Event('change'));
			saveLanguage(lang);
		} else {
			// 드롭다운이 아직 로드되지 않았으면 재시도
			setTimeout(() => {
				const select = document.querySelector('.goog-te-combo');
				if (select) {
					select.value = lang;
					select.dispatchEvent(new Event('change'));
					saveLanguage(lang);
				}
			}, 1000);
		}
	}

	// 언어 버튼 활성화 상태 업데이트
	function updateLanguageButtons(currentLang) {
		const buttons = document.querySelectorAll('.language-btn');
		buttons.forEach(btn => {
			const btnLang = btn.getAttribute('data-lang');
			if (btnLang === currentLang) {
				btn.classList.add('active');
			} else {
				btn.classList.remove('active');
			}
		});
	}

	// 언어 버튼 이벤트 리스너 설정
	function setupLanguageButtons() {
		const buttons = document.querySelectorAll('.language-btn');
		buttons.forEach(btn => {
			btn.addEventListener('click', function(e) {
				e.preventDefault();
				const lang = this.getAttribute('data-lang');
				updateLanguageButtons(lang);
				changeLanguage(lang);
			});
		});
	}

	// 페이지 로드 시 실행
	function init() {
		// Google Translate 초기화
		initGoogleTranslate();

		// 저장된 언어 설정 복원
		const savedLang = getSavedLanguage();
		updateLanguageButtons(savedLang);

		// 도큐먼트 레디 상태 확인
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', function() {
				setupLanguageButtons();
				
				// Google Translate 로드 대기 후 언어 적용
				setTimeout(() => {
					if (savedLang !== DEFAULT_LANGUAGE) {
						changeLanguage(savedLang);
					}
				}, 2000);

				// Google Translate 콤보박스 변경 감지
				observeGoogleTranslate();
			});
		} else {
			setupLanguageButtons();
			
			// Google Translate 로드 대기 후 언어 적용
			setTimeout(() => {
				if (savedLang !== DEFAULT_LANGUAGE) {
					changeLanguage(savedLang);
				}
			}, 2000);

			// Google Translate 콤보박스 변경 감지
			observeGoogleTranslate();
		}
	}

	// Google Translate 콤보박스 변경 감지
	function observeGoogleTranslate() {
		const observer = new MutationObserver(function() {
			const selectElement = document.querySelector('.goog-te-combo');
			if (selectElement) {
				// 한 번만 리스너 추가하기 위해 데이터 속성 확인
				if (!selectElement.dataset.listenerAdded) {
					selectElement.addEventListener('change', function() {
						const selectedLang = this.value;
						saveLanguage(selectedLang);
						updateLanguageButtons(selectedLang);
					});
					selectElement.dataset.listenerAdded = 'true';
				}
			}
		});

		observer.observe(document.body, { childList: true, subtree: true });
	}

	// DOM이 완전히 로드되면 실행
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}

	// 모듈 export
	window.JBTranslate = {
		getSavedLanguage: getSavedLanguage,
		changeLanguage: changeLanguage,
		updateLanguageButtons: updateLanguageButtons
	};
})();
