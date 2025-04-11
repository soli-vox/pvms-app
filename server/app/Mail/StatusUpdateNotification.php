<?php

namespace App\Mail;

use App\Models\User;
use App\Models\Status;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class StatusUpdateNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $status;
    public $message;
    public $resetUrl;

    public function __construct(User $user, Status $status, string $message, ?string $resetUrl)
    {
        $this->user = $user;
        $this->status = $status;
        $this->message = $message;
        $this->resetUrl = $resetUrl;
    }

    public function build()
    {
        $data = json_decode($this->message, true) ?? ['intro' => $this->message];
        return $this->subject($data['title'] ?? 'Membership Status Update')
            ->view('emails.status_update', [
                'title' => $data['title'] ?? 'Membership Status Update',
                'intro' => $data['intro'] ?? 'Your membership status has been updated.',
                'details' => $data['details'] ?? null,
                'tempPassword' => $data['tempPassword'] ?? null,
                'resetUrl' => $this->resetUrl,
            ]);
    }
}