<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>{{ config('app.name', 'Lurus Store') }} Password Reset</title></head>
<body style="margin:0;background:#f5f3ef;color:#1b1b1b;font-family:Arial,sans-serif">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 16px">
<tr><td align="center">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:#fff;border:1px solid #ded8d0;padding:32px">
<tr><td>
<p style="margin:0 0 24px">
<img src="{{ url('/logo.svg') }}" alt="{{ config('app.name', 'Lurus Store') }}" width="140" style="display:block;height:auto;border:0">
</p>
<h1 style="margin:0 0 12px;font-size:24px">Reset your password</h1>
<p style="margin:0 0 24px;line-height:1.6">Hi {{ $user->name }}, click the button below to choose a new password.</p>
<p style="margin:0 0 24px">
<a href="{{ $url }}" style="display:inline-block;padding:14px 28px;background:#1b1b1b;color:#fff;text-decoration:none;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;font-weight:700">Reset Password</a>
</p>
<p style="margin:0 0 16px;color:#666;line-height:1.6;font-size:13px;word-break:break-all">Or copy this link:<br>{{ $url }}</p>
<p style="margin:0;color:#666;line-height:1.6">This link expires in {{ $expiresInMinutes }} minutes. Ignore this email if you did not request a reset.</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>
