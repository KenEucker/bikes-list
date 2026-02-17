<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>BikesList – Content moderation</title>
</head>
<body>
    <h1>BikesList moderation notice</h1>
    <p>Your {{ $contentTypeLabel }} was <strong>{{ $actionLabel }}</strong>.</p>
    <p>Reason: {{ $reasonCodeLabel }}</p>
    @if($relayMessage)
    <p>Message from moderator:</p>
    <p>{{ $relayMessage }}</p>
    @endif
    <p>If you have questions, reply to this email. Replies are handled via BikesList and moderators do not see your email address.</p>
</body>
</html>
