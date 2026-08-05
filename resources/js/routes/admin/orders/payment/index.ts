import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminOrderController::approve
 * @see app/Http/Controllers/Admin/AdminOrderController.php:179
 * @route '/admin/orders/{order}/payment/approve'
 */
export const approve = (args: { order: string | number | { order_number: string | number } } | [order: string | number | { order_number: string | number } ] | string | number | { order_number: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: approve.url(args, options),
    method: 'patch',
})

approve.definition = {
    methods: ["patch"],
    url: '/admin/orders/{order}/payment/approve',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\AdminOrderController::approve
 * @see app/Http/Controllers/Admin/AdminOrderController.php:179
 * @route '/admin/orders/{order}/payment/approve'
 */
approve.url = (args: { order: string | number | { order_number: string | number } } | [order: string | number | { order_number: string | number } ] | string | number | { order_number: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'order_number' in args) {
            args = { order: args.order_number }
        }
    
    if (Array.isArray(args)) {
        args = {
                    order: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        order: typeof args.order === 'object'
                ? args.order.order_number
                : args.order,
                }

    return approve.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminOrderController::approve
 * @see app/Http/Controllers/Admin/AdminOrderController.php:179
 * @route '/admin/orders/{order}/payment/approve'
 */
approve.patch = (args: { order: string | number | { order_number: string | number } } | [order: string | number | { order_number: string | number } ] | string | number | { order_number: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: approve.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\AdminOrderController::approve
 * @see app/Http/Controllers/Admin/AdminOrderController.php:179
 * @route '/admin/orders/{order}/payment/approve'
 */
    const approveForm = (args: { order: string | number | { order_number: string | number } } | [order: string | number | { order_number: string | number } ] | string | number | { order_number: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approve.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminOrderController::approve
 * @see app/Http/Controllers/Admin/AdminOrderController.php:179
 * @route '/admin/orders/{order}/payment/approve'
 */
        approveForm.patch = (args: { order: string | number | { order_number: string | number } } | [order: string | number | { order_number: string | number } ] | string | number | { order_number: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approve.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    approve.form = approveForm
/**
* @see \App\Http\Controllers\Admin\AdminOrderController::reject
 * @see app/Http/Controllers/Admin/AdminOrderController.php:197
 * @route '/admin/orders/{order}/payment/reject'
 */
export const reject = (args: { order: string | number | { order_number: string | number } } | [order: string | number | { order_number: string | number } ] | string | number | { order_number: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: reject.url(args, options),
    method: 'patch',
})

reject.definition = {
    methods: ["patch"],
    url: '/admin/orders/{order}/payment/reject',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\AdminOrderController::reject
 * @see app/Http/Controllers/Admin/AdminOrderController.php:197
 * @route '/admin/orders/{order}/payment/reject'
 */
reject.url = (args: { order: string | number | { order_number: string | number } } | [order: string | number | { order_number: string | number } ] | string | number | { order_number: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'order_number' in args) {
            args = { order: args.order_number }
        }
    
    if (Array.isArray(args)) {
        args = {
                    order: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        order: typeof args.order === 'object'
                ? args.order.order_number
                : args.order,
                }

    return reject.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminOrderController::reject
 * @see app/Http/Controllers/Admin/AdminOrderController.php:197
 * @route '/admin/orders/{order}/payment/reject'
 */
reject.patch = (args: { order: string | number | { order_number: string | number } } | [order: string | number | { order_number: string | number } ] | string | number | { order_number: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: reject.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\AdminOrderController::reject
 * @see app/Http/Controllers/Admin/AdminOrderController.php:197
 * @route '/admin/orders/{order}/payment/reject'
 */
    const rejectForm = (args: { order: string | number | { order_number: string | number } } | [order: string | number | { order_number: string | number } ] | string | number | { order_number: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reject.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminOrderController::reject
 * @see app/Http/Controllers/Admin/AdminOrderController.php:197
 * @route '/admin/orders/{order}/payment/reject'
 */
        rejectForm.patch = (args: { order: string | number | { order_number: string | number } } | [order: string | number | { order_number: string | number } ] | string | number | { order_number: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reject.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    reject.form = rejectForm
const payment = {
    approve: Object.assign(approve, approve),
reject: Object.assign(reject, reject),
}

export default payment