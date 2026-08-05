<?php

namespace App\Enums;

enum PaymentStatus: string
{
    case Unpaid = 'unpaid';
    case PendingVerification = 'pending_verification';
    case Paid = 'paid';
    case Failed = 'failed';
    case Expired = 'expired';
    case Refunded = 'refunded';
}
