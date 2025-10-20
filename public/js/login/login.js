document.addEventListener('DOMContentLoaded', function () {
    var submitBtn = document.getElementById('login-submit');
    if (!submitBtn) return;

    var emailInput = document.getElementById('login-email');
    var passwordInput = document.getElementById('login-password');
    var csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
    var csrfToken = csrfTokenMeta ? csrfTokenMeta.getAttribute('content') : '';

    // Store current device info and user data for OTP verification
    var currentDeviceInfo = null;
    var currentUserData = null;

    function disableButton(disabled) {
        submitBtn.disabled = !!disabled;
    }

    // Function to get device information
    async function getDeviceInfo() {
        var deviceInfo = {
            mac_address: 'N/A',
            screen_resolution: window.screen.width + 'x' + window.screen.height,
            platform: navigator.platform || 'Unknown',
            user_agent: navigator.userAgent || 'Unknown',
            language: navigator.language || 'Unknown',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown',
            public_ip: null
        };
        
        // Try to get public IP address from external API
        try {
            var ipResponse = await fetch('https://api.ipify.org?format=json', {
                method: 'GET',
                timeout: 2000
            });
            if (ipResponse.ok) {
                var ipData = await ipResponse.json();
                deviceInfo.public_ip = ipData.ip;
                console.log('Public IP detected:', ipData.ip);
            }
        } catch (e) {
            console.log('Could not retrieve public IP:', e.message);
            // Try alternative API
            try {
                var altIpResponse = await fetch('https://api.my-ip.io/ip', {
                    method: 'GET',
                    timeout: 2000
                });
                if (altIpResponse.ok) {
                    var altIpText = await altIpResponse.text();
                    deviceInfo.public_ip = altIpText.trim();
                    console.log('Public IP detected (alt):', altIpText.trim());
                }
            } catch (e2) {
                console.log('Could not retrieve public IP from alternative API:', e2.message);
            }
        }
        
        // Try to get MAC address using WebRTC (may not work in all browsers/networks)
        try {
            // This is a workaround that sometimes works with WebRTC
            var pc = new RTCPeerConnection({iceServers: []});
            pc.createDataChannel('');
            
            await new Promise((resolve) => {
                pc.createOffer().then(offer => pc.setLocalDescription(offer));
                pc.onicecandidate = function(ice) {
                    if (!ice || !ice.candidate || !ice.candidate.candidate) {
                        resolve();
                        return;
                    }
                    var candidateStr = ice.candidate.candidate;
                    // Try to extract MAC-like identifier from ICE candidate
                    var macMatch = candidateStr.match(/([0-9a-f]{2}[:-]){5}[0-9a-f]{2}/i);
                    if (macMatch) {
                        deviceInfo.mac_address = macMatch[0];
                    }
                    // Also try to get host IP
                    var ipMatch = candidateStr.match(/(\d+\.\d+\.\d+\.\d+)/);
                    if (ipMatch) {
                        deviceInfo.local_ip = ipMatch[1];
                    }
                    resolve();
                };
                // Timeout after 500ms
                setTimeout(() => resolve(), 500);
            });
            
            pc.close();
        } catch (e) {
            console.log('Could not retrieve MAC address via WebRTC:', e.message);
        }
        
        // If MAC is still N/A, try to create a fingerprint based on device characteristics
        if (deviceInfo.mac_address === 'N/A') {
            try {
                var fingerprint = '';
                fingerprint += navigator.hardwareConcurrency || '0';
                fingerprint += '-' + navigator.deviceMemory || '0';
                fingerprint += '-' + screen.colorDepth || '0';
                fingerprint += '-' + screen.pixelDepth || '0';
                fingerprint += '-' + navigator.maxTouchPoints || '0';
                
                // Create a hash-like identifier
                var hash = 0;
                for (var i = 0; i < fingerprint.length; i++) {
                    var char = fingerprint.charCodeAt(i);
                    hash = ((hash << 5) - hash) + char;
                    hash = hash & hash;
                }
                
                // Format as MAC-like address
                var hashStr = Math.abs(hash).toString(16).padStart(12, '0').substring(0, 12);
                deviceInfo.mac_address = hashStr.match(/.{1,2}/g).join(':').toUpperCase();
                deviceInfo.mac_address = 'DEVICE-' + deviceInfo.mac_address;
            } catch (e) {
                console.log('Could not create device fingerprint:', e.message);
            }
        }
        
        return deviceInfo;
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
        
        // Get device information
        var deviceInfo = await getDeviceInfo();
        console.log('Device Info:', deviceInfo);
        
        try {
            var response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json'
                },
                credentials: 'same-origin',
                body: JSON.stringify({ 
                    email: email, 
                    password: password,
                    mac_address: deviceInfo.mac_address,
                    screen_resolution: deviceInfo.screen_resolution,
                    platform: deviceInfo.platform,
                    language: deviceInfo.language,
                    timezone: deviceInfo.timezone,
                    local_ip: deviceInfo.local_ip || 'N/A',
                    public_ip: deviceInfo.public_ip || null
                })
            });

            if (!response.ok) {
                var failMsg = 'Login failed';
                try {
                    var errJson = await response.json();
                    if (errJson && errJson.message) failMsg = errJson.message;
                    
                    // Check if device verification is required
                    if (errJson && errJson.requires_verification) {
                        console.log('Device verification required');
                        currentDeviceInfo = deviceInfo;
                        currentUserData = errJson;
                        showOTPModal(errJson.email, errJson.message);
                        return;
                    }
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
            
            // Check if device verification is required (even on 200 OK)
            if (data && data.requires_verification) {
                console.log('Device verification required (200 OK)');
                currentDeviceInfo = deviceInfo;
                currentUserData = data;
                showOTPModal(data.email, data.message);
                return;
            }
            
            if (data && data.success) {
                console.log('Login successful, showing notification...');
                console.log('User data:', data.user);
                console.log('showNotification_login_toast_success function exists:', typeof window.showNotification_login_toast_success === 'function');
                
                // Update notification message with user's name if available
                if (data.user && data.user.name) {
                    const successMessage = document.querySelector('#login_toast_success-content .text-slate-500');
                    if (successMessage) {
                        successMessage.textContent = `Welcome back, ${data.user.name}! Login successful.`;
                    }
                }
                
                if (typeof window.showNotification_login_toast_success === 'function') {
                    console.log('Calling showNotification_login_toast_success...');
                    window.showNotification_login_toast_success();
                } else {
                    console.error('showNotification_login_toast_success function not found!');
                }
                
                // Wait for notification to be visible before redirecting
                setTimeout(() => {
                    console.log('Redirecting to dashboard...');
                    window.location.href = '/dashboard';
                }, 2000); // Wait 2 seconds before redirecting
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

    // OTP Modal Functions
    function showOTPModal(email, message) {
        console.log('Showing OTP modal for:', email);
        
        // Remove any existing OTP modal first
        var existingModal = document.getElementById('otpVerificationModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create a completely new modal with no CSS inheritance (same as appointment.js)
        var newModal = document.createElement('div');
        newModal.id = 'otpVerificationModal';
        
        // Set all styles directly with !important
        newModal.style.cssText = `
            display: block !important;
            position: fixed !important;
            z-index: 999999 !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background-color: rgba(0, 0, 0, 0.8) !important;
            visibility: visible !important;
            opacity: 1 !important;
            font-family: Arial, sans-serif !important;
            color: black !important;
        `;
        
        // Create modal content with inline styles
        newModal.innerHTML = `
            <div style="
                position: absolute !important;
                top: 50% !important;
                left: 50% !important;
                transform: translate(-50%, -50%) !important;
                background-color: white !important;
                padding: 30px !important;
                border-radius: 10px !important;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
                min-width: 500px !important;
                max-width: 90vw !important;
                text-align: center !important;
                border: 2px solid #1C3FAA !important;
            ">
                <h2 style="color: #1C3FAA !important; margin-bottom: 20px !important; font-size: 24px !important;">🔐 Device Verification Required</h2>
                
                <div style="
                    text-align: left !important;
                    background-color: #FFF3CD !important;
                    padding: 15px !important;
                    border-radius: 8px !important;
                    margin-bottom: 20px !important;
                    border-left: 4px solid #FFC107 !important;
                ">
                    <p style="margin-bottom: 0.5rem !important; color: #856404 !important; font-weight: bold !important;">⚠️ New Device Detected!</p>
                    <p style="margin: 0 !important; font-size: 14px !important; color: #856404 !important;">${message}</p>
                </div>
                
                <p style="color: #6b7280 !important; margin-bottom: 1rem !important; font-size: 14px !important;">
                    Please check your email <strong style="color: #1C3FAA !important;">${email}</strong> and enter the 6-digit code below:
                </p>
                
                <div style="margin-bottom: 1.5rem !important;">
                    <input type="text" 
                           id="otpCodeInput" 
                           maxlength="6" 
                           placeholder="000000" 
                           autocomplete="off"
                           style="width: 100% !important; padding: 1rem !important; text-align: center !important; font-size: 2.5rem !important; letter-spacing: 0.8rem !important; font-weight: bold !important; border: 2px solid #1C3FAA !important; border-radius: 0.5rem !important; background-color: #E3F2FD !important; color: #1C3FAA !important; font-family: monospace !important;">
                    <p style="font-size: 0.75rem !important; color: #9CA3AF !important; margin-top: 0.5rem !important;">Code expires in 10 minutes</p>
                </div>
                
                <div style="display: flex !important; gap: 0.5rem !important; justify-content: center !important;">
                    <button type="button" id="verifyOtpBtn" 
                            style="background-color: #1C3FAA !important; color: white !important; padding: 0.75rem 2rem !important; border-radius: 0.5rem !important; font-weight: 600 !important; border: none !important; cursor: pointer !important; font-size: 16px !important;"
                            onmouseover="this.style.backgroundColor='#1e40af' !important" 
                            onmouseout="this.style.backgroundColor='#1C3FAA' !important">
                        Verify & Login
                    </button>
                    <button type="button" id="cancelOtpBtn" 
                            style="background-color: transparent !important; color: #6b7280 !important; padding: 0.75rem 2rem !important; border-radius: 0.5rem !important; font-weight: 600 !important; border: 2px solid #6b7280 !important; cursor: pointer !important; font-size: 16px !important;"
                            onmouseover="this.style.backgroundColor='#f3f4f6' !important" 
                            onmouseout="this.style.backgroundColor='transparent' !important">
                        Cancel
                    </button>
                </div>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(newModal);
        
        console.log('OTP modal created successfully');
        console.log('Modal element:', newModal);
        console.log('Modal display:', newModal.style.display);
        
        // Force a repaint
        newModal.offsetHeight;
        
        // Focus on OTP input after modal is shown
        setTimeout(function() {
            var otpInput = document.getElementById('otpCodeInput');
            if (otpInput) {
                otpInput.focus();
                console.log('OTP input focused');
            }
        }, 100);
        
        // Re-attach event listeners for the new modal buttons
        attachOTPModalListeners();
    }

    function hideOTPModal() {
        var modal = document.getElementById('otpVerificationModal');
        if (modal) {
            modal.remove();
        }
    }

    // Attach event listeners for OTP modal buttons
    function attachOTPModalListeners() {
        console.log('Attaching OTP modal listeners');
        
        // Verify OTP Button
        var verifyOtpBtn = document.getElementById('verifyOtpBtn');
        if (verifyOtpBtn) {
            verifyOtpBtn.addEventListener('click', async function() {
            var otpInput = document.getElementById('otpCodeInput');
            var otpCode = otpInput ? otpInput.value.trim() : '';
            
            if (!otpCode || otpCode.length !== 6) {
                alert('Please enter a valid 6-digit verification code.');
                if (otpInput) otpInput.focus();
                return;
            }
            
            if (!currentUserData || !currentUserData.user_id) {
                alert('Session expired. Please login again.');
                hideOTPModal();
                return;
            }
            
            console.log('Verifying OTP:', otpCode);
            verifyOtpBtn.disabled = true;
            verifyOtpBtn.textContent = 'Verifying...';
            
            try {
                var response = await fetch('/verify-otp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                        'Accept': 'application/json'
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify({
                        user_id: currentUserData.user_id,
                        otp_code: otpCode,
                        mac_address: currentDeviceInfo.mac_address,
                        public_ip: currentDeviceInfo.public_ip,
                        screen_resolution: currentDeviceInfo.screen_resolution,
                        platform: currentDeviceInfo.platform,
                        language: currentDeviceInfo.language,
                        timezone: currentDeviceInfo.timezone,
                        local_ip: currentDeviceInfo.local_ip || 'N/A'
                    })
                });
                
                var data = await response.json();
                
                if (data && data.success) {
                    console.log('OTP verified successfully!');
                    hideOTPModal();
                    
                    // Show success notification
                    if (typeof window.showNotification_login_toast_success === 'function') {
                        window.showNotification_login_toast_success();
                    }
                    
                    // Redirect to dashboard
                    setTimeout(function() {
                        window.location.href = '/dashboard';
                    }, 2000);
                } else {
                    var errorMsg = (data && data.message) ? data.message : 'Invalid verification code';
                    alert(errorMsg);
                    if (otpInput) {
                        otpInput.value = '';
                        otpInput.focus();
                    }
                }
            } catch (error) {
                console.error('OTP verification error:', error);
                alert('Error verifying code. Please try again.');
            } finally {
                    verifyOtpBtn.disabled = false;
                    verifyOtpBtn.textContent = 'Verify & Login';
                }
            });
        }

        // Cancel OTP Button
        var cancelOtpBtn = document.getElementById('cancelOtpBtn');
        if (cancelOtpBtn) {
            cancelOtpBtn.addEventListener('click', function() {
                hideOTPModal();
                currentDeviceInfo = null;
                currentUserData = null;
            });
        }

        // OTP Input - Only allow numbers
        var otpInput = document.getElementById('otpCodeInput');
        if (otpInput) {
            otpInput.addEventListener('input', function(e) {
                this.value = this.value.replace(/[^0-9]/g, '');
            });
            
            // Submit on Enter key
            otpInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && this.value.length === 6) {
                    e.preventDefault();
                    var verifyBtn = document.getElementById('verifyOtpBtn');
                    if (verifyBtn) verifyBtn.click();
                }
            });
        }
    }
});
