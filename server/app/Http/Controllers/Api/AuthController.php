<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Status;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Api\ApiController;

class AuthController extends ApiController
{
    public function login(LoginRequest $request)
    {
        try {
            $credentials = $request->only('email', 'password');
            if (Auth::attempt($credentials)) {
                $user = Auth::user();

                Log::info('Trying login', [
                    'User' => [
                        $user->status->slug,
                        $user->password_update,
                        $user->role->slug
                    ]
                ]);

                if (!$user->status || $user->status->slug !== 'approved') {
                    Auth::logout();
                    return $this->errorResponse('Account not approved');
                }
                if (!$user->password_updated) {
                    Auth::logout();
                    return $this->errorResponse('Password must be updated before login');
                }
                $token = $user->createToken($request->email)->plainTextToken;
                $user->load(['status', 'role', 'bankType']);
                return $this->successResponse(
                    'Login successful',
                    ['token' => $token, 'user' => new UserResource($user)]
                );
            }
            return $this->errorResponse('Invalid credentials');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return $this->successResponse('Logged out successfully');
    }

    public function resetPassword(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email|exists:users,email',
                'temporary_password' => 'required|string',
                'token' => 'required|string',
                'new_password' => 'required|string|min:8|confirmed',
            ]);

            $user = User::where('email', $request->email)->firstOrFail();

            if (!(Hash::check($request->temporary_password, $user->password)) || $user->password_reset_token !== $request->token) {
                $pendingStatus = Status::where('slug', 'pending')->firstOrFail();
                $newTempPassword = Str::random(12);
                $user->status_id = $pendingStatus->id;
                $user->password = bcrypt($newTempPassword);
                $user->password_reset_token = null;
                $user->password_updated = false;
                $user->save();
                return $this->errorResponse('Invalid temporary password or token...', 403);
            }

            $user->password = bcrypt($request->new_password);
            $user->password_reset_token = null;
            $user->password_updated = true;
            $user->save();
            return $this->successResponse('Password updated successfully...', null);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }
}
