import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PaymentController::midtrans
 * @see app/Http/Controllers/PaymentController.php:16
 * @route '/orders/{order}/midtrans'
 */
export const midtrans = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: midtrans.url(args, options),
    method: 'post',
})

midtrans.definition = {
    methods: ["post"],
    url: '/orders/{order}/midtrans',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PaymentController::midtrans
 * @see app/Http/Controllers/PaymentController.php:16
 * @route '/orders/{order}/midtrans'
 */
midtrans.url = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions) => {
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

    return midtrans.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PaymentController::midtrans
 * @see app/Http/Controllers/PaymentController.php:16
 * @route '/orders/{order}/midtrans'
 */
midtrans.post = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: midtrans.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PaymentController::midtrans
 * @see app/Http/Controllers/PaymentController.php:16
 * @route '/orders/{order}/midtrans'
 */
    const midtransForm = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: midtrans.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PaymentController::midtrans
 * @see app/Http/Controllers/PaymentController.php:16
 * @route '/orders/{order}/midtrans'
 */
        midtransForm.post = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: midtrans.url(args, options),
            method: 'post',
        })
    
    midtrans.form = midtransForm
/**
* @see \App\Http\Controllers\PaymentController::proof
 * @see app/Http/Controllers/PaymentController.php:49
 * @route '/orders/{order}/payment-proof'
 */
export const proof = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: proof.url(args, options),
    method: 'post',
})

proof.definition = {
    methods: ["post"],
    url: '/orders/{order}/payment-proof',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PaymentController::proof
 * @see app/Http/Controllers/PaymentController.php:49
 * @route '/orders/{order}/payment-proof'
 */
proof.url = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions) => {
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

    return proof.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PaymentController::proof
 * @see app/Http/Controllers/PaymentController.php:49
 * @route '/orders/{order}/payment-proof'
 */
proof.post = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: proof.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PaymentController::proof
 * @see app/Http/Controllers/PaymentController.php:49
 * @route '/orders/{order}/payment-proof'
 */
    const proofForm = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: proof.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PaymentController::proof
 * @see app/Http/Controllers/PaymentController.php:49
 * @route '/orders/{order}/payment-proof'
 */
        proofForm.post = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: proof.url(args, options),
            method: 'post',
        })
    
    proof.form = proofForm
/**
* @see \App\Http\Controllers\PaymentController::notification
 * @see app/Http/Controllers/PaymentController.php:42
 * @route '/payments/midtrans/notification'
 */
export const notification = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: notification.url(options),
    method: 'post',
})

notification.definition = {
    methods: ["post"],
    url: '/payments/midtrans/notification',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PaymentController::notification
 * @see app/Http/Controllers/PaymentController.php:42
 * @route '/payments/midtrans/notification'
 */
notification.url = (options?: RouteQueryOptions) => {
    return notification.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PaymentController::notification
 * @see app/Http/Controllers/PaymentController.php:42
 * @route '/payments/midtrans/notification'
 */
notification.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: notification.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PaymentController::notification
 * @see app/Http/Controllers/PaymentController.php:42
 * @route '/payments/midtrans/notification'
 */
    const notificationForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: notification.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PaymentController::notification
 * @see app/Http/Controllers/PaymentController.php:42
 * @route '/payments/midtrans/notification'
 */
        notificationForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: notification.url(options),
            method: 'post',
        })
    
    notification.form = notificationForm
const PaymentController = { midtrans, proof, notification }

export default PaymentController