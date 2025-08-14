document.addEventListener('DOMContentLoaded', function () {
    var submitBtn = document.getElementById('login-submit');
    if (!submitBtn) return;

    var emailInput = document.getElementById('login-email');
    var passwordInput = document.getElementById('login-password');
    var csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
    var csrfToken = csrfTokenMeta ? csrfTokenMeta.getAttribute('content') : '';

    function disableButton(disabled) {
        submitBtn.disabled = !!disabled;
    }

    async function login() {
        var email = emailInput ? emailInput.value.trim() : '';
        var password = passwordInput ? passwordInput.value : '';
        if (!email || !password) {
            if (typeof window.showNotification_login_toast_warning === 'function') {
                window.showNotification_login_toast_warning();
            }
            return;
        }
        disableButton(true);
        try {
            var response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json'
                },
                credentials: 'same-origin',
                body: JSON.stringify({ email: email, password: password })
            });

            if (!response.ok) {
                var failMsg = 'Login failed';
                try {
                    var errJson = await response.json();
                    if (errJson && errJson.message) failMsg = errJson.message;
                } catch (_) {
                    var errText = await response.text();
                    if (errText) failMsg = errText;
                }
                var errorSlot = document.getElementById('login-error-message-slot');
                if (errorSlot) errorSlot.textContent = failMsg;
                if (typeof window.showNotification_login_toast_error === 'function') {
                    window.showNotification_login_toast_error();
                }
                return;
            }
            var data = await response.json();
            if (data && data.success) {
                if (typeof window.showNotification_login_toast_success === 'function') {
                    window.showNotification_login_toast_success();
                }
                window.location.href = '/dashboard';
            } else {
                var msg = (data && data.message) ? data.message : 'Login failed';
                var slot = document.getElementById('login-error-message-slot');
                if (slot) slot.textContent = msg;
                if (typeof window.showNotification_login_toast_error === 'function') {
                    window.showNotification_login_toast_error();
                }
            }
        } catch (e) {
            var catchMsg = e && e.message ? e.message : 'Login failed';
            var catchSlot = document.getElementById('login-error-message-slot');
            if (catchSlot) catchSlot.textContent = catchMsg;
            if (typeof window.showNotification_login_toast_error === 'function') {
                window.showNotification_login_toast_error();
            }
        } finally {
            disableButton(false);
        }
    }

    submitBtn.addEventListener('click', function (e) {
        e.preventDefault();
        login();
    });

    [emailInput, passwordInput].forEach(function (el) {
        if (!el) return;
        el.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                login();
            }
        });
    });
});
