<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Orchid\Screen\AsSource;

class City extends Model
{
    use AsSource;

    protected $fillable = ['name', 'slug', 'description'];
}
