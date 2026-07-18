// 다국어 번역 설정 - 모든 페이지에서 공유하는 스크립트

(function () {
	const STORAGE_KEY = 'jb-design-language';
	const SCRIPT_ID = 'google-translate-script';
	const SUPPORTED_LANGS = ['ko', 'en', 'vi', 'ja', 'zh-CN'];

	let translateReadyPromise = null;

	// Google callback 은 전역 함수여야 합니다.
	window.googleTranslateElementInit = function () {
		new google.translate.TranslateElement(
			{
				pageLanguage: 'ko',
				includedLanguages: SUPPORTED_LANGS.join(','),
				autoDisplay: false
			},
			'google_translate_element'
		);

		// 내부 resolve 훅이 있으면 실행
		if (typeof window.__jbTranslateReadyResolve === 'function') {
			window.__jbTranslateReadyResolve();
			window.__jbTranslateReadyResolve = null;
		}
	};

	function getSavedLanguage() {
		const saved = localStorage.getItem(STORAGE_KEY);
		return SUPPORTED_LANGS.includes(saved) ? saved : 'ko';
	}

	function setSavedLanguage(lang) {
		if (SUPPORTED_LANGS.includes(lang)) {
			localStorage.setItem(STORAGE_KEY, lang);
		}
	}

	function setActiveButton(lang) {
		document.querySelectorAll('.language-btn').forEach((btn) => {
			const isActive = btn.getAttribute('data-lang') === lang;
			btn.classList.toggle('active', isActive);
			btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
		});
	}

	function ensureTranslateContainer() {
		let container = document.getElementById('google_translate_element');
		if (!container) {
			container = document.createElement('div');
			container.id = 'google_translate_element';
			container.setAttribute('aria-hidden', 'true');
			document.body.appendChild(container);
		}

		container.style.position = 'absolute';
		container.style.left = '-9999px';
		container.style.width = '1px';
		container.style.height = '1px';
		container.style.overflow = 'hidden';
		container.style.clipPath = 'inset(50%)';
		container.style.whiteSpace = 'nowrap';
		container.setAttribute('aria-hidden', 'true');
	}

	function getCookieValue(name) {
		const prefix = `${name}=`;
		const target = document.cookie
			.split(';')
			.map((part) => part.trim())
			.find((part) => part.startsWith(prefix));

		return target ? target.substring(prefix.length) : '';
	}

	function hasGoogleTranslateCookie() {
		return getCookieValue('googtrans') !== '';
	}

	function restoreKoreanState() {
		const host = location.hostname;
		const expire = 'Thu, 01 Jan 1970 00:00:00 GMT';
		const domains = [''];
		// FQDN 형태의 호스트에서만 domain 속성을 포함해 쿠키를 함께 제거합니다.
		if (/^(?:[a-z0-9-]+\.)+[a-z0-9-]+$/i.test(host)) {
			domains.push(`;domain=${host}`, `;domain=.${host}`);
		}

		domains.forEach((domainAttr) => {
			document.cookie = `googtrans=;expires=${expire};path=/${domainAttr}`;
		});

		location.replace(location.pathname);
	}

	function ensureGoogleTranslateLoaded() {
		if (translateReadyPromise) return translateReadyPromise;

		translateReadyPromise = new Promise((resolve, reject) => {
			// 이미 로드된 경우
			if (typeof google !== 'undefined' && google.translate && google.translate.TranslateElement) {
				window.googleTranslateElementInit();
				resolve();
				return;
			}

			window.__jbTranslateReadyResolve = resolve;

			let script = document.getElementById(SCRIPT_ID);
			if (!script) {
				script = document.createElement('script');
				script.id = SCRIPT_ID;
				script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
				script.async = true;
				script.onerror = () => reject(new Error('Google Translate script load failed'));
				document.head.appendChild(script);
			}
		});

		return translateReadyPromise;
	}

	function waitForCombo(timeoutMs = 8000) {
		const started = Date.now();
		return new Promise((resolve, reject) => {
			(function poll() {
				const combo = document.querySelector('.goog-te-combo');
				if (combo) {
					resolve(combo);
					return;
				}
				if (Date.now() - started > timeoutMs) {
					reject(new Error('Translate combo not found'));
					return;
				}
				setTimeout(poll, 200);
			})();
		});
	}

	async function applyLanguage(lang) {
		if (lang === 'ko') {
			// 한글 기본 페이지로 복귀
			if (location.search.includes('googtrans') || hasGoogleTranslateCookie()) {
				restoreKoreanState();
			}
			return;
		}

		await ensureGoogleTranslateLoaded();
		const combo = await waitForCombo();
		combo.value = lang;
		combo.dispatchEvent(new Event('change'));
	}

	function bindLanguageButtons() {
		const buttons = document.querySelectorAll('.language-btn');
		if (!buttons.length) return;

		buttons.forEach((button) => {
			button.addEventListener('click', async (e) => {
				e.preventDefault();
				const lang = button.getAttribute('data-lang') || 'ko';
				setSavedLanguage(lang);
				setActiveButton(lang);

				try {
					await applyLanguage(lang);
				} catch (err) {
					console.error('[i18n] language apply failed:', err);
				}
			});
		});
	}

	async function init() {
		ensureTranslateContainer();
		bindLanguageButtons();

		const savedLang = getSavedLanguage();
		setActiveButton(savedLang);

		if (savedLang !== 'ko') {
			try {
				await applyLanguage(savedLang);
			} catch (err) {
				console.error('[i18n] initial language apply failed:', err);
			}
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
