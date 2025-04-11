@component('mail::message')
# Status Update Notification

Your registration status has been updated to **{{ $status->name }}**.

{{ $message }}

@if ($resetUrl)
  @component('mail::button', ['url' => $resetUrl])
  Update Password
  @endcomponent
@endif

Thanks,
{{ config('app.name') }}
@endcomponent