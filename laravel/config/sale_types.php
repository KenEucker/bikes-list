<?php

return [
    // Core condition enum (all types): used as sale.condition
    'conditions' => [
        'new' => 'New',
        'like_new' => 'Like new',
        'good' => 'Good',
        'fair' => 'Fair',
        'poor' => 'Poor',
    ],

    // Full bicycle posting detail options (dropdowns)
    'full_bicycle_options' => [
        'bicycle_type' => [
            'mountain' => 'Mountain',
            'cargo' => 'Cargo',
            'pedicab' => 'Pedicab',
            'cyclocross' => 'Cyclocross',
            'cruiser' => 'Cruiser',
            'folding' => 'Folding',
            'electric' => 'Electric',
            'bmx' => 'BMX',
            'road' => 'Road',
            'gravel' => 'Gravel',
            'hybrid' => 'Hybrid',
            'kids' => 'Kids',
            'recumbent' => 'Recumbent',
            'tandem' => 'Tandem',
            'track' => 'Track',
            'trike' => 'Trike',
            'unicycle' => 'Unicycle',
            'other' => 'Other',
        ],
        'wheel_size' => [
            '12' => '12"',
            '16' => '16"',
            '20' => '20"',
            '24' => '24"',
            '26' => '26"',
            '27.5' => '27.5"',
            '29' => '29"',
            '700c' => '700c',
            'other' => 'Other',
        ],
        'frame_material' => [
            'steel' => 'Steel',
            'aluminum' => 'Aluminum',
            'carbon' => 'Carbon',
            'titanium' => 'Titanium',
            'alloy' => 'Alloy',
            'other' => 'Other',
        ],
        'suspension' => [
            'none' => 'None',
            'suspension_fork' => 'Suspension fork (hardtail)',
            'full_suspension' => 'Frame and fork (full suspension)',
            'other' => 'Other',
        ],
        'handlebar_type' => [
            'drop' => 'Drop',
            'flat' => 'Flat',
            'riser' => 'Riser',
            'bullhorn' => 'Bullhorn',
            'cruiser' => 'Cruiser',
            'other' => 'Other',
        ],
        'electric_assist' => [
            'none' => 'None',
            'pedal_assist' => 'Pedal assist',
            'throttle' => 'Throttle',
            'other' => 'Other',
        ],
    ],

    'full_bicycle' => [
        'label' => 'Bike',
        'attributes' => [
            'frame_size' => ['type' => 'string', 'label' => 'Frame Size', 'options' => ['XS', 'S', 'M', 'L', 'XL']],
            'wheel_size' => ['type' => 'string', 'label' => 'Wheel Size', 'options' => ['26"', '27.5"', '29"', '700c', 'Other']],
            'gears' => ['type' => 'string', 'label' => 'Gears'],
            'brand' => ['type' => 'string', 'label' => 'Brand'],
            'model' => ['type' => 'string', 'label' => 'Model'],
            'year' => ['type' => 'string', 'label' => 'Year'],
            'category' => ['type' => 'string', 'label' => 'Category', 'options' => []],
            'brake_type' => ['type' => 'string', 'label' => 'Brake type'],
            'frame_material' => ['type' => 'string', 'label' => 'Frame material'],
        ],
    ],
    'parts' => [
        'label' => 'Part',
        'attributes' => [
            'part_category' => ['type' => 'string', 'label' => 'Part category'],
            'compatibility_notes' => ['type' => 'string', 'label' => 'Compatibility notes'],
        ],
    ],
    'clothing' => [
        'label' => 'Clothing',
        'attributes' => [
            'clothing_type' => ['type' => 'string', 'label' => 'Clothing type'],
            'size' => ['type' => 'string', 'label' => 'Size', 'options' => ['XS', 'S', 'M', 'L', 'XL', 'XXL']],
            'gender' => ['type' => 'string', 'label' => 'Gender', 'options' => []],
            'season' => ['type' => 'string', 'label' => 'Season', 'options' => []],
        ],
    ],
    'miscellaneous' => [
        'label' => 'Misc',
        'attributes' => [
            'category' => ['type' => 'string', 'label' => 'Category', 'options' => ['Books', 'Films', 'Accessories', 'Other']],
        ],
    ],
];
