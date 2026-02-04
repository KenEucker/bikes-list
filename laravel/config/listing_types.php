<?php

return [
    'full_bicycle' => [
        'label' => 'Full Bicycle',
        'attributes' => [
            'frame_size' => ['type' => 'string', 'label' => 'Frame Size', 'options' => ['XS', 'S', 'M', 'L', 'XL']],
            'wheel_size' => ['type' => 'string', 'label' => 'Wheel Size', 'options' => ['26"', '27.5"', '29"', '700c', 'Other']],
            'brand' => ['type' => 'string', 'label' => 'Brand'],
            'condition' => ['type' => 'string', 'label' => 'Condition', 'options' => ['Like new', 'Good', 'Fair', 'Needs work']],
        ],
    ],
    'parts' => [
        'label' => 'Bicycle Parts',
        'attributes' => [
            'part_type' => ['type' => 'string', 'label' => 'Part Type', 'options' => ['Wheels', 'Drivetrain', 'Brakes', 'Frame', 'Handlebars', 'Saddle', 'Other']],
            'compatibility' => ['type' => 'string', 'label' => 'Compatibility'],
        ],
    ],
    'clothing' => [
        'label' => 'Clothing',
        'attributes' => [
            'size' => ['type' => 'string', 'label' => 'Size', 'options' => ['XS', 'S', 'M', 'L', 'XL', 'XXL']],
            'condition' => ['type' => 'string', 'label' => 'Condition', 'options' => ['Like new', 'Good', 'Fair']],
        ],
    ],
    'miscellaneous' => [
        'label' => 'Miscellaneous',
        'attributes' => [
            'category' => ['type' => 'string', 'label' => 'Category', 'options' => ['Books', 'Films', 'Accessories', 'Other']],
        ],
    ],
];
