<?php

namespace App\Http\Controllers\Api;

use App\Models\BankType;
use App\Models\Role;
use App\Models\User;
use App\Models\Status;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Traits\ModelFetcher;
use Illuminate\Http\Request;
use App\Traits\HandlesApiActions;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Services\NotificationService;
use App\Http\Requests\StoreJoinUsRequest;
use App\Http\Resources\MembershipRequestResource;
use App\Http\Resources\MembershipRequestCollection;

class MembershipRequestController extends ApiController
{
    use HandlesApiActions, ModelFetcher;

    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function index()
    {
        return $this->withExceptionHandling(function () {
            $adminRole = $this->findModelBySlug(Role::class, 'admin', 'admin_role');
            $users = User::where('role_id', '!=', $adminRole->id)
                ->with(['role', 'status', 'bankType'])
                ->get();
            Log::info('Users fetched for membership requests:', ['users' => $users->toArray()]);
            return $this->successResponse('Membership requests retrieved successfully', ['members' => new MembershipRequestCollection($users)], 200);
        });
    }


    public function store(StoreJoinUsRequest $request)
    {
        return $this->withExceptionHandling(function () use ($request) {
            if (User::where('email', $request->email)->exists()) {
                return $this->errorResponse('Email already registered. Please contact support.', 422);
            }
            $role = Role::where('slug', $request->role)->first();
            if (!$role) {
                return $this->errorResponse('Please select appropriate role.', 404);
            }
            $bankTypeId = $request->input('bank_type_id');
            $bankTypeName = null;
            if ($request->role === 'bank' && $bankTypeId) {
                $bankType = BankType::where('id', $bankTypeId)->first();
                if (!$bankType) {
                    return $this->errorResponse('Selected bank type does not exist.', 404);
                }
                $bankTypeName = $bankType->name;
            }
            $status = Status::where('slug', 'pending')->first();
            if (!$status) {
                return $this->errorResponse('Pending status not found.', 500);
            }
            $tempPassword = Str::random(12);
            $userData = [
                'email' => $request->email,
                'name' => $request->name,
                'role_id' => $role->id,
                'status_id' => $status->id,
                'bank_type_id' => $request->role === 'bank' ? $bankTypeId : null,
                'message' => $request->message,
                'password' => Hash::make($tempPassword),
                'created_by' => null,
                'updated_by' => null,
            ];

            $user = User::create($userData);
            Log::info('User created:', $user->toArray());
            $submittedData = $request->only(['email', 'name', 'role', 'bank_type_id', 'message']);
            if ($bankTypeName) {
                $submittedData['bank_type_name'] = $bankTypeName; // Add name for notification
            }
            $this->notificationService->sendRequestReceivedNotification($user, $submittedData);

            return $this->successResponse(
                'Registration request submitted successfully. You will receive your password once approved.',
                null,
                201
            );
        });
    }



    public function updateStatus(Request $request, $userId)
    {
        return $this->withExceptionHandling(function () use ($request, $userId) {
            $request->validate([
                'status_id' => 'required|exists:statuses,id',
                'message' => 'required|string|max:1000',
            ]);
            $user = User::find($userId);
            if (!$user) {
                return $this->errorResponse('User not found.', 404);
            }

            $newStatus = Status::find($request->status_id);
            if (!$newStatus) {
                return $this->errorResponse('Selected status not found.', 404);
            }

            // Check if status changed
            if ($user->status_id === $newStatus->id) {
                return $this->successResponse('No status change detected.', [], 200);
            }

            // Update user status
            $user->status_id = $newStatus->id;
            $user->updated_by = auth()->user()->id;

            if ($newStatus->slug === 'approved') {
                $tempPassword = Str::random(12);
                $user->password = Hash::make($tempPassword);
                $user->password_reset_token = Str::random(60);
                $user->password_updated = false;
            }

            $user->save();
            Log::info('User status updated:', $user->toArray());

            if ($newStatus->slug === 'approved') {
                $this->notificationService->sendApprovalNotification($user, $tempPassword);
            } else {
                $this->notificationService->sendStatusUpdate($user, $newStatus, auth()->user()->id);
            }

            return $this->successResponse(
                "User status updated to {$newStatus->name}.",
                ['member' => new MembershipRequestResource($user)],
                200
            );
        });
    }
}
