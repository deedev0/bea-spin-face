<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Grandprize extends Model
{
    public $timestamps = false;
    protected $fillable = ['key', 'is_grandprize'];
}
