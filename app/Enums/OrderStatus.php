<?php

namespace App\Enums;

enum OrderStatus: string
{
    case Pending = 'pending';
    case StockConfirmation = 'stock_confirmation';
    case ReadyToShip = 'ready_to_ship';
    case Shipped = 'shipped';
    case Delivered = 'delivered';
    case Cancelled = 'cancelled';
}
