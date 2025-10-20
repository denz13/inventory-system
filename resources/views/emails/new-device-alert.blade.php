<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Security Alert - New Device Login</title>
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
            border-bottom: 3px solid #10B981;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #10B981;
            margin: 0;
            font-size: 28px;
        }
        .success-box {
            background-color: #D1FAE5;
            border-left: 4px solid #10B981;
            padding: 15px;
            margin-bottom: 25px;
            border-radius: 5px;
        }
        .success-box p {
            margin: 0;
            color: #065F46;
        }
        .device-info {
            background-color: #F8F9FA;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .device-info h3 {
            margin-top: 0;
            color: #10B981;
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
        .security-tips {
            background-color: #FEF3C7;
            border-left: 4px solid #F59E0B;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .security-tips h4 {
            margin: 0 0 10px 0;
            color: #92400E;
        }
        .security-tips ul {
            margin: 0;
            padding-left: 20px;
            color: #92400E;
        }
        .security-tips li {
            margin: 5px 0;
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
            <h1>✅ Successful Login from New Device</h1>
        </div>

        <p>Hello <strong>{{ $user->name }}</strong>,</p>

        <div class="success-box">
            <p><strong>✓ Login Successful!</strong> You have successfully logged in to your account from a new device.</p>
        </div>

        <p>Your account was accessed from a device we haven't seen before. Here are the details:</p>

        <div class="device-info">
            <h3>📱 New Device Information</h3>
            <table>
                <tr>
                    <td>Browser:</td>
                    <td>{{ $device_info['browser'] }}</td>
                </tr>
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

        <div class="security-tips">
            <h4>🔒 Security Tips</h4>
            <ul>
                <li>This device will now be recognized for future logins</li>
                <li>You won't need to verify again unless you clear your browser data</li>
                <li>Always logout when using shared computers</li>
                <li>Regularly review your login activity</li>
            </ul>
        </div>

        <div class="warning">
            <p><strong>⚠️ If this wasn't you:</strong> Please secure your account immediately by changing your password and contacting our support team.</p>
        </div>

        <div class="footer">
            <p><strong>Golden Country Homes</strong></p>
            <p>This is an automated security notification. Please do not reply to this email.</p>
            <p style="margin-top: 10px; font-size: 12px; color: #999;">
                © {{ date('Y') }} Golden Country Homes. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>

