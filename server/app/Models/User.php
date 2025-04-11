<?php

namespace App\Models;

use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'status_id',
        'bank_type_id',
        'message',
        'password_updated',
        'password_reset_token',
        'created_by',
        'updated_by',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $dates = ['created_at', 'updated_at'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'password_updated' => 'boolean',
        ];
    }

    public function setPasswordAttribute($value)
    {
        $pendingStatus = Status::where('name', 'pending')->first();
        if ($this->status_id && $this->status_id !== $pendingStatus->id) {
            $this->attributes['password'] = Hash::make($value);
        } else {
            $this->attributes['password'] = $value;
        }
    }

    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }
    public function status()
    {
        return $this->belongsTo(Status::class, 'status_id');
    }

    public function bankType()
    {
        return $this->belongsTo(BankType::class, 'bank_type_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}

