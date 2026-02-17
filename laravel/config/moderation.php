<?php

return [
    'reason_codes' => [
        'NOT_BICYCLE_RELATED' => 'Not bicycle-related',
        'SUSPECTED_SCAM_OR_FRAUD' => 'Suspected scam or fraud',
        'SUSPECTED_STOLEN' => 'Suspected stolen property',
        'INCORRECT_CITY_OR_LOCATION' => 'Incorrect city or location',
        'COMMERCIAL_SPAM' => 'Commercial spam',
        'DUPLICATE_CONTENT' => 'Duplicate content',
        'SAFETY_OR_VALIDITY' => 'Safety or validity concern',
        'OTHER' => 'Other',
    ],

    'actor_roles' => [
        'moderator' => 'City moderator',
        'global_moderator' => 'Global moderator',
        'admin' => 'Admin',
    ],

    'removed_content_retention_days' => (int) env('MODERATION_REMOVED_RETENTION_DAYS', 60),
];
