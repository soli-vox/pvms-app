<?
namespace App\Services;

use App\Models\User;
use App\Models\Status;
use App\Models\UserNotificationMessage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\StatusUpdateNotification;

class NotificationService
{
  private const FRONTEND_URL = env(self::FRONTEND_URL, 'http://localhost:5173');

  /**
   * Send a status update notification to a user.
   */
  public function sendStatusUpdate(User $user, Status $status, ?int $updatedBy = null): void
  {
    $message = $this->getStatusMessage($status);
    $resetUrl = $this->getResetUrl($user, $status);

    if ($status->slug === 'approved') {
      $message .= "\n\nTemporary Password: {$user->password}";
    }

    $this->processNotification($user, $status, $message, $resetUrl, $updatedBy ?? auth()->user()?->id, 'sent');
  }

  /**
   * Send a notification when a membership request is received.
   */
  public function sendRequestReceivedNotification(User $user, array $submittedData): void
  {
    $message = $this->buildRequestReceivedMessage($submittedData);
    $this->processNotification($user, $user->status, $message, null, null, 'pending');
  }

  /**
   * Send an approval notification with a temporary password.
   */
  public function sendApprovalNotification(User $user, string $tempPassword): void
  {
    $message = $this->buildApprovalMessage($user, $tempPassword);
    $this->processNotification($user, $user->status, $message, null, auth()->user()->id, 'approved');
  }

  /**
   * Build the message for a received membership request.
   */
  private function buildRequestReceivedMessage(array $submittedData): string
  {
    $message = "Your membership request has been received. Here’s what we’ve recorded:\n";
    $message .= "- Email: {$submittedData['email']}\n";
    $message .= "- Name: {$submittedData['name']}\n";
    $message .= "- Role: {$submittedData['role']}\n";
    if (isset($submittedData['bank_type_id'])) {
      $message .= "- Bank Type ID: {$submittedData['bank_type_id']}\n";
    }
    $message .= "- Message: {$submittedData['message']}\n\n";
    $message .= "We’ll review your request and get back to you soon.";

    return $message;
  }

  /**
   * Build the approval message with temporary password.
   */
  private function buildApprovalMessage(User $user, string $tempPassword): string
  {
    $resetUrl = $this->getResetUrl($user);
    return "Your membership request has been approved! Use this temporary password to set your own: {$tempPassword}\nReset here: {$resetUrl}";
  }

  /**
   * Get the status update message based on status slug.
   */
  private function getStatusMessage(Status $status): string
  {
    return match ($status->slug) {
      'approved' => "Your registration has been approved! Please update your password to proceed.",
      'rejected' => "Your registration request has been rejected.",
      'suspended' => "Your registration has been suspended.",
      'pending' => "Your registration status is now pending review.",
      default => "Your registration status has been updated to {$status->name}."
    };
  }

  /**
   * Get the password reset URL if applicable.
   */
  private function getResetUrl(User $user, ?Status $status = null): ?string
  {
    $frontendUrl = env(self::FRONTEND_URL, 'http://localhost:5173');
    return $status && $status->slug === 'approved'
      ? "{$frontendUrl}/reset-password?email=" . urlencode($user->email) . "&token=" . $user->password_reset_token
      : null;
  }

  /**
   * Process and send the notification, handling creation and email delivery.
   */
  private function processNotification(
    User $user,
    Status $status,
    string $message,
    ?string $resetUrl,
    ?int $createdBy,
    string $initialStatus
  ): void {
    $notification = UserNotificationMessage::create([
      'user_id' => $user->id,
      'status_id' => $status->id,
      'message' => $message,
      'delivery_status' => $initialStatus,
      'created_by' => $createdBy,
    ]);

    $emailSent = $this->sendEmail($user, $status, $message, $resetUrl, $notification);

    $notification->update([
      'delivery_status' => $emailSent ? 'sent' : 'failed',
      'sent_at' => $emailSent ? now() : null,
    ]);

    if (!$emailSent) {
      $this->handleDeliveryFailure($user, $status);
    }
  }

  /**
   * Send the email notification.
   */
  private function sendEmail(User $user, Status $status, string $message, ?string $resetUrl, UserNotificationMessage $notification): bool
  {
    try {
      Mail::to($user->email)->send(new StatusUpdateNotification($user, $status, $message, $resetUrl));
      Log::info('Email sent successfully', ['user_id' => $user->id, 'email' => $user->email]);
      return true;
    } catch (\Exception $e) {
      Log::error('Failed to send notification email', [
        'user_id' => $user->id,
        'status' => $status->slug,
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString(),
      ]);
      return false;
    }
  }

  /**
   * Handle failed email delivery.
   */
  private function handleDeliveryFailure(User $user, Status $status): void
  {
    Log::warning("Email delivery failed for user {$user->id}", ['email' => $user->email]);
    if ($status->slug !== 'pending') { // Only throw for critical statuses
      throw new \Exception("Email delivery failed for user {$user->id}");
    }
  }
}