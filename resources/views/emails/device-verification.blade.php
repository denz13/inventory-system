<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Device Verification Required</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #1C3FAA;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #1C3FAA;
            margin: 0;
            font-size: 28px;
        }
        .alert-box {
            background-color: #FFF3CD;
            border-left: 4px solid #FFC107;
            padding: 15px;
            margin-bottom: 25px;
            border-radius: 5px;
        }
        .alert-box p {
            margin: 0;
            color: #856404;
        }
        .otp-box {
            background-color: #E3F2FD;
            border: 2px dashed #1C3FAA;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
            border-radius: 10px;
        }
        .otp-code {
            font-size: 48px;
            font-weight: bold;
            color: #1C3FAA;
            letter-spacing: 10px;
            font-family: 'Courier New', monospace;
        }
        .device-info {
            background-color: #F8F9FA;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .device-info h3 {
            margin-top: 0;
            color: #1C3FAA;
            font-size: 18px;
        }
        .device-info table {
            width: 100%;
            border-collapse: collapse;
        }
        .device-info td {
            padding: 8px 0;
            border-bottom: 1px solid #dee2e6;
        }
        .device-info td:first-child {
            font-weight: bold;
            width: 40%;
            color: #666;
        }
        .device-info tr:last-child td {
            border-bottom: none;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 14px;
        }
        .warning {
            background-color: #FFEBEE;
            border-left: 4px solid #DC2626;
            padding: 15px;
            margin-top: 20px;
            border-radius: 5px;
        }
        .warning p {
            margin: 0;
            color: #B71C1C;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Device Verification Required</h1>
        </div>

        <p>Hello <strong>{{ $user->name }}</strong>,</p>

        <div class="alert-box">
            <p><strong>⚠️ New Device Detected!</strong> We noticed a login attempt from a device we don't recognize.</p>
        </div>

        <p>To complete your login, please enter the verification code below:</p>

        <div class="otp-box">
            <p style="margin: 0 0 10px 0; font-size: 16px; color: #666;">Your Verification Code</p>
            <div class="otp-code">{{ $otp_code }}</div>
            <p style="margin: 10px 0 0 0; font-size: 14px; color: #999;">This code will expire in {{ $expire_minutes }} minutes</p>
        </div>

        <div class="device-info">
            <h3>📱 Device Information</h3>
            <table>
                <tr>
                    <td>IP Address:</td>
                    <td>{{ $device_info['ip_address'] }}</td>
                </tr>
                <tr>
                    <td>Location:</td>
                    <td>{{ $device_info['location'] }}</td>
                </tr>
                <tr>
                    <td>Device ID:</td>
                    <td><code>{{ $device_info['mac_address'] }}</code></td>
                </tr>
                <tr>
                    <td>Date & Time:</td>
                    <td>{{ $device_info['date_time'] }}</td>
                </tr>
            </table>
        </div>

        <div class="warning">
            <p><strong>⚠️ If this wasn't you:</strong> Please ignore this email and change your password immediately. Someone may be trying to access your account.</p>
        </div>

        <div class="footer">
            <p><strong>Golden Country Homes</strong></p>
            <p>This is an automated security message. Please do not reply to this email.</p>
            <p style="margin-top: 10px; font-size: 12px; color: #999;">
                © {{ date('Y') }} Golden Country Homes. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>

