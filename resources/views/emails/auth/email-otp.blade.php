<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>{{ config('app.name', 'Lurus Store') }} Verification Code</title></head>
<body style="margin:0;background:#f5f3ef;color:#1b1b1b;font-family:Arial,sans-serif">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 16px">
<tr><td align="center">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:#fff;border:1px solid #ded8d0;padding:32px">
<tr><td>
<p style="margin:0 0 24px">
<img src="{{ url('/logo.svg') }}" alt="{{ config('app.name', 'Lurus Store') }}" width="140" style="display:block;height:auto;border:0">
</p>
<h1 style="margin:0 0 12px;font-size:24px">Verify your email</h1>
<p style="margin:0 0 24px;line-height:1.6">Hi {{ $user->name }}, use the code below to verify your account.</p>
<p style="margin:0 0 24px;padding:18px;background:#f5f3ef;text-align:center;font-size:32px;font-weight:700;letter-spacing:10px">{{ $code }}</p>
<p style="margin:0;color:#666;line-height:1.6">This code expires in {{ $expiresInMinutes }} minutes. Ignore this email if you did not create an account.</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>
