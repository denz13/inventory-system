<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset OTP - Golden Country Homes</title>
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
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #2C3E50;
            margin-bottom: 10px;
        }
        .otp-code {
            background: #2C3E50;
            color: white;
            font-size: 32px;
            font-weight: bold;
            text-align: center;
            padding: 20px;
            border-radius: 8px;
            letter-spacing: 5px;
            margin: 30px 0;
        }
        .warning {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #2C3E50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🏠 Golden Country Homes</div>
            <h2>Password Reset Request</h2>
        </div>
        
        <p>Hello {{ $user->name ?? 'User' }},</p>
        
        <p>We received a request to reset your password for your Golden Country Homes account. Please use the following One-Time Password (OTP) to proceed with your password reset:</p>
        
        <div class="otp-code">{{ $otp }}</div>
        
        <div class="warning">
            <strong>⚠️ Important Security Information:</strong>
            <ul>
                <li>This OTP is valid for <strong>10 minutes only</strong></li>
                <li>Do not share this code with anyone</li>
                <li>If you didn't request this password reset, please ignore this email</li>
                <li>For security reasons, this code can only be used once</li>
            </ul>
        </div>
        
        <p>To complete your password reset:</p>
        <ol>
            <li>Return to the password reset page</li>
            <li>Enter the OTP code: <strong>{{ $otp }}</strong></li>
            <li>Follow the instructions to create your new password</li>
        </ol>
        
        <p>If you have any questions or concerns, please contact our support team.</p>
        
        <div class="footer">
            <p>This is an automated email from Golden Country Homes.<br>
            Please do not reply to this email.</p>
            <p><small>© {{ date('Y') }} Golden Country Homes. All rights reserved.</small></p>
        </div>
    </div>
</body>
</html>
