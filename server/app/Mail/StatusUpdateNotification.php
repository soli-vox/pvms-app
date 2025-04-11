<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class StatusUpdateNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $status;
    public $message;
    public $resetUrl;

    public function __construct($user, $status, $message, $resetUrl = null)
    {
        $this->user = $user;
        $this->status = $status;
        $this->message = $message;
        $this->resetUrl = $resetUrl;
    }

    public function build()
    {
        return $this->subject("PVMS Registration Status Update: {$this->status->name}")
            ->markdown('emails.status-update');
    }
}

