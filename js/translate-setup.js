// 다국어 번역 설정 - 모든 페이지에서 공유하는 스크립트

(function () {
	const SOURCE_LANGUAGE = 'ko';
	const STORAGE_KEY = 'jb-design-language';
	const SCRIPT_ID = 'google-translate-script';
	const SUPPORTED_LANGS = [SOURCE_LANGUAGE, 'en', 'vi', 'ja', 'zh-CN'];
	const TRANSLATE_ELEMENT_ID = 'google_translate_element';
	const MANUAL_TRANSLATIONS = {
		'아이디 입력': {
			en: 'Enter your ID',
			vi: 'Nhập ID của bạn',
			ja: 'IDを入力してください',
			'zh-CN': '请输入您的账号'
		},
		'비밀번호 입력': {
			en: 'Enter your password',
			vi: 'Nhập mật khẩu',
			ja: 'パスワードを入力してください',
			'zh-CN': '请输入您的密码'
		},
		'소문자 3자 이상': {
			en: 'At least 3 lowercase characters',
			vi: 'Ít nhất 3 ký tự chữ thường',
			ja: '小文字3文字以上',
			'zh-CN': '至少 3 个小写字符'
		},
		'6자 이상, 숫자·특수문자 포함': {
			en: 'At least 6 characters, including a number and a special character',
			vi: 'Ít nhất 6 ký tự, gồm số và ký tự đặc biệt',
			ja: '6文字以上、数字と特殊文字を含む',
			'zh-CN': '至少 6 个字符，包含数字和特殊字符'
		},
		'비밀번호 다시 입력': {
			en: 'Re-enter your password',
			vi: 'Nhập lại mật khẩu',
			ja: 'パスワードを再入力してください',
			'zh-CN': '请再次输入密码'
		},
		'실명 입력': {
			en: 'Enter your full name',
			vi: 'Nhập họ tên thật',
			ja: '実名を入力してください',
			'zh-CN': '请输入真实姓名'
		},
		'고객': {
			en: 'Customer',
			vi: 'Khách hàng',
			ja: '顧客',
			'zh-CN': '客户'
		},
		'협력업체': {
			en: 'Partner',
			vi: 'Đối tác',
			ja: '協力会社',
			'zh-CN': '合作伙伴'
		},
		'직원': {
			en: 'Staff',
			vi: 'Nhân viên',
			ja: 'スタッフ',
			'zh-CN': '员工'
		},
		'확인 중...': {
			en: 'Checking...',
			vi: 'Đang kiểm tra...',
			ja: '確認中...',
			'zh-CN': '正在检查...'
		},
		'현재 가입 승인 대기 중입니다. 관리자 승인 후 이용 가능합니다.': {
			en: 'Your signup approval is still pending. You can use the service after the administrator approves it.',
			vi: 'Yêu cầu đăng ký của bạn vẫn đang chờ phê duyệt. Bạn có thể sử dụng dịch vụ sau khi quản trị viên chấp thuận.',
			ja: '現在、加入承認待ちです。管理者の承認後にご利用いただけます。',
			'zh-CN': '您的注册审批仍在等待中。管理员批准后即可使用。'
		},
		'로그인': {
			en: 'Login',
			vi: 'Đăng nhập',
			ja: 'ログイン',
			'zh-CN': '登录'
		},
		'님! 시스템으로 안전하게 이동 중입니다...': {
			en: ', we are safely taking you to the system...',
			vi: ', chúng tôi đang đưa bạn vào hệ thống một cách an toàn...',
			ja: 'さん！システムへ安全に移動しています...',
			'zh-CN': '，正在安全地为您跳转到系统...'
		},
		'서버 통신 오류가 발생했습니다.': {
			en: 'A server communication error occurred.',
			vi: 'Đã xảy ra lỗi giao tiếp với máy chủ.',
			ja: 'サーバー通信エラーが発生しました。',
			'zh-CN': '发生了服务器通信错误。'
		},
		'계정이 반려되었거나 접근이 제한되었습니다.': {
			en: 'The account was rejected or access is restricted.',
			vi: 'Tài khoản đã bị từ chối hoặc quyền truy cập bị hạn chế.',
			ja: 'アカウントが却下されたか、アクセスが制限されています。',
			'zh-CN': '账号已被拒绝或访问受限。'
		},
		'등록된 정보가 없습니다. 회원가입 페이지로 이동합니다.': {
			en: 'No registered information was found. You will be redirected to the signup page.',
			vi: 'Không tìm thấy thông tin đã đăng ký. Bạn sẽ được chuyển đến trang đăng ký.',
			ja: '登録された情報がありません。会員登録ページへ移動します。',
			'zh-CN': '未找到注册信息。即将跳转到注册页面。'
		},
		'아이디는 3자 이상이어야 합니다.': {
			en: 'The ID must be at least 3 characters long.',
			vi: 'ID phải có ít nhất 3 ký tự.',
			ja: 'IDは3文字以上である必要があります。',
			'zh-CN': '账号至少需要 3 个字符。'
		},
		'아이디는 소문자와 숫자만 사용 가능합니다.': {
			en: 'The ID can contain only lowercase letters and numbers.',
			vi: 'ID chỉ được chứa chữ thường và số.',
			ja: 'IDには小文字と数字のみ使用できます。',
			'zh-CN': '账号只能使用小写字母和数字。'
		},
		'사용 가능한 아이디입니다.': {
			en: 'This ID is available.',
			vi: 'ID này có thể sử dụng.',
			ja: 'このIDは使用できます。',
			'zh-CN': '该账号可以使用。'
		},
		'이미 사용 중인 아이디입니다.': {
			en: 'This ID is already in use.',
			vi: 'ID này đã được sử dụng.',
			ja: 'このIDはすでに使用されています。',
			'zh-CN': '该账号已被使用。'
		},
		'안전한 비밀번호입니다.': {
			en: 'This is a secure password.',
			vi: 'Đây là mật khẩu an toàn.',
			ja: '安全なパスワードです。',
			'zh-CN': '这是一个安全的密码。'
		},
		'요구사항을 만족하지 않습니다.': {
			en: 'The requirements are not met.',
			vi: 'Chưa đáp ứng các yêu cầu.',
			ja: '要件を満たしていません。',
			'zh-CN': '未满足要求。'
		},
		'비밀번호가 일치합니다.': {
			en: 'Passwords match.',
			vi: 'Mật khẩu khớp nhau.',
			ja: 'パスワードが一致しています。',
			'zh-CN': '密码一致。'
		},
		'비밀번호가 일치하지 않습니다.': {
			en: 'Passwords do not match.',
			vi: 'Mật khẩu không khớp.',
			ja: 'パスワードが一致しません。',
			'zh-CN': '密码不一致。'
		},
		'가입 처리 중...': {
			en: 'Processing signup...',
			vi: 'Đang xử lý đăng ký...',
			ja: '登録を処理中...',
			'zh-CN': '正在处理注册...'
		},
		'고객 회원가입이 완료되었습니다. 즉시 로그인이 가능합니다.': {
			en: 'Customer signup is complete. You can log in immediately.',
			vi: 'Đăng ký khách hàng đã hoàn tất. Bạn có thể đăng nhập ngay.',
			ja: '顧客会員登録が完了しました。すぐにログインできます。',
			'zh-CN': '客户注册已完成。您可以立即登录。'
		},
		'가입 신청이 완료되었습니다. 관리자 승인 후 로그인이 가능합니다.': {
			en: 'Your signup request is complete. You can log in after administrator approval.',
			vi: 'Yêu cầu đăng ký của bạn đã hoàn tất. Bạn có thể đăng nhập sau khi quản trị viên phê duyệt.',
			ja: '登録申請が完了しました。管理者の承認後にログインできます。',
			'zh-CN': '注册申请已完成。管理员批准后即可登录。'
		},
		'회원가입에 실패했습니다. 다시 시도해주세요.': {
			en: 'Signup failed. Please try again.',
			vi: 'Đăng ký thất bại. Vui lòng thử lại.',
			ja: '会員登録に失敗しました。もう一度お試しください。',
			'zh-CN': '注册失败。请重试。'
		},
		'회원가입': {
			en: 'Sign Up',
			vi: 'Đăng ký',
			ja: '会員登録',
			'zh-CN': '注册'
		}
	};

	let translateReadyPromise = null;
	let translateInitialized = false;
	let currentLanguage = SOURCE_LANGUAGE;

	// Google callback 은 전역 함수여야 합니다.
	window.googleTranslateElementInit = function () {
		ensureTranslateElement();

		if (!translateInitialized) {
			new google.translate.TranslateElement(
				{
					pageLanguage: SOURCE_LANGUAGE,
					includedLanguages: SUPPORTED_LANGS.join(','),
					autoDisplay: false
				},
				TRANSLATE_ELEMENT_ID
			);
			translateInitialized = true;
		}

		// 내부 resolve 훅이 있으면 실행
		if (typeof window.__jbTranslateReadyResolve === 'function') {
			window.__jbTranslateReadyResolve();
			window.__jbTranslateReadyResolve = null;
		}
	};

	function getSavedLanguage() {
		const saved = localStorage.getItem(STORAGE_KEY);
		return SUPPORTED_LANGS.includes(saved) ? saved : SOURCE_LANGUAGE;
	}

	function setSavedLanguage(lang) {
		if (SUPPORTED_LANGS.includes(lang)) {
			localStorage.setItem(STORAGE_KEY, lang);
		}
	}

	function translateText(text, lang = currentLanguage || SOURCE_LANGUAGE) {
		if (!text || lang === SOURCE_LANGUAGE) return text;
		const entry = MANUAL_TRANSLATIONS[text];
		return (entry && entry[lang]) || text;
	}

	function styleTranslateElement(element) {
		element.style.position = 'absolute';
		element.style.left = '-9999px';
		element.style.top = '0';
		element.style.width = '1px';
		element.style.height = '1px';
		element.style.overflow = 'hidden';
		element.style.opacity = '0';
		element.style.pointerEvents = 'none';
	}

	function ensureTranslateElement() {
		let element = document.getElementById(TRANSLATE_ELEMENT_ID);
		if (!element) {
			element = document.createElement('div');
			element.id = TRANSLATE_ELEMENT_ID;
			element.setAttribute('aria-hidden', 'true');
			document.body.appendChild(element);
		}

		styleTranslateElement(element);
		return element;
	}

	function setActiveButton(lang) {
		document.querySelectorAll('.language-btn').forEach((btn) => {
			const isActive = btn.getAttribute('data-lang') === lang;
			btn.classList.toggle('active', isActive);
			btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
		});
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

	function applyManualTranslations(lang) {
		document.querySelectorAll('[data-jb-placeholder]').forEach((element) => {
			const source = element.getAttribute('data-jb-placeholder') || '';
			element.setAttribute('placeholder', translateText(source, lang));
		});

		document.querySelectorAll('[data-jb-option-label]').forEach((element) => {
			const source = element.getAttribute('data-jb-option-label') || '';
			element.textContent = translateText(source, lang);
		});

		document.querySelectorAll('[data-jb-static-text]').forEach((element) => {
			const source = element.getAttribute('data-jb-static-text') || '';
			element.textContent = translateText(source, lang);
		});
	}

	function clearCookie(name, path, domain) {
		let cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; SameSite=Lax`;
		if (window.location.protocol === 'https:') {
			cookie += '; Secure';
		}
		if (domain) {
			cookie += `; domain=${domain}`;
		}
		document.cookie = cookie;
	}

	function clearGoogleTranslateState() {
		const hostname = window.location.hostname;
		const domains = hostname
			? [undefined, hostname, `.${hostname}`]
			: [undefined];
		const paths = ['/', window.location.pathname];

		domains.forEach((domain) => {
			paths.forEach((path) => {
				clearCookie('googtrans', path, domain);
			});
		});
	}

	function notifyLanguageChange(lang) {
		currentLanguage = lang;
		document.documentElement.lang = lang;
		applyManualTranslations(lang);
		setActiveButton(lang);
		window.dispatchEvent(
			new CustomEvent('jb-languagechange', {
				detail: { lang }
			})
		);
	}

	function hasActiveTranslationState() {
		const combo = document.querySelector('.goog-te-combo');
		return (
			location.search.includes('googtrans=') ||
			location.hash.includes('googtrans=') ||
			document.cookie.includes('googtrans=') ||
			(combo && combo.value && combo.value !== SOURCE_LANGUAGE)
		);
	}

	async function applyLanguage(lang) {
		if (lang === SOURCE_LANGUAGE) {
			const shouldReload = hasActiveTranslationState();
			clearGoogleTranslateState();
			if (shouldReload) {
				const cleanUrl = `${location.pathname}${location.search}${location.hash}`;
				location.replace(cleanUrl);
			}
			return;
		}

		document.cookie = `googtrans=/${SOURCE_LANGUAGE}/${lang}; path=/; SameSite=Lax${
			window.location.protocol === 'https:' ? '; Secure' : ''
		}`;
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
				const lang = button.getAttribute('data-lang') || SOURCE_LANGUAGE;
				setSavedLanguage(lang);
				notifyLanguageChange(lang);

				try {
					await applyLanguage(lang);
				} catch (err) {
					console.error('[i18n] language apply failed:', err);
				}
			});
		});
	}

	async function init() {
		ensureTranslateElement();
		bindLanguageButtons();

		const savedLang = getSavedLanguage();
		notifyLanguageChange(savedLang);

		if (savedLang !== SOURCE_LANGUAGE) {
			try {
				await applyLanguage(savedLang);
			} catch (err) {
				console.error('[i18n] initial language apply failed:', err);
			}
		} else {
			clearGoogleTranslateState();
		}
	}

	window.JBTranslateSetup = {
		STORAGE_KEY,
		SUPPORTED_LANGS: SUPPORTED_LANGS.slice(),
		getCurrentLanguage() {
			return currentLanguage;
		},
		translateText(text) {
			return translateText(text, currentLanguage);
		},
		applyManualTranslations
	};

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
