<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()) {
            return redirect('/login');
        }

        if (! $request->user()->isAdmin()) {
            abort(Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
