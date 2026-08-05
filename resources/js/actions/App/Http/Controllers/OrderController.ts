import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\OrderController::show
 * @see app/Http/Controllers/OrderController.php:25
 * @route '/orders/{order}'
 */
export const show = (args: { order: string | number | { order_number: string | number } } | [order: string | number | { order_number: string | number } ] | string | number | { order_number: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/orders/{order}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderController::show
 * @see app/Http/Controllers/OrderController.php:25
 * @route '/orders/{order}'
 */
show.url = (args: { order: string | number | { order_number: string | number } } | [order: string | number | { order_number: string | number } ] | string | number | { order_number: string | number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderController::show
 * @see app/Http/Controllers/OrderController.php:25
 * @route '/orders/{order}'
 */
show.get = (args: { order: string | number | { order_number: string | number } } | [order: string | number | { order_number: string | number } ] | string | number | { order_number: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OrderController::show
 * @see app/Http/Controllers/OrderController.php:25
 * @route '/orders/{order}'
 */
show.head = (args: { order: string | number | { order_number: string | number } } | [order: string | number | { order_number: string | number } ] | string | number | { order_number: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OrderController::show
 * @see app/Http/Controllers/OrderController.php:25
 * @route '/orders/{order}'
 */
    const showForm = (args: { order: string | number | { order_number: string | number } } | [order: string | number | { order_number: string | number } ] | string | number | { order_number: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OrderController::show
 * @see app/Http/Controllers/OrderController.php:25
 * @route '/orders/{order}'
 */
        showForm.get = (args: { order: string | number | { order_number: string | number } } | [order: string | number | { order_number: string | number } ] | string | number | { order_number: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OrderController::show
 * @see app/Http/Controllers/OrderController.php:25
 * @route '/orders/{order}'
 */
        showForm.head = (args: { order: string | number | { order_number: string | number } } | [order: string | number | { order_number: string | number } ] | string | number | { order_number: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\OrderController::success
 * @see app/Http/Controllers/OrderController.php:42
 * @route '/orders/{order}/success'
 */
export const success = (args: { order: string | number | { order_number: string | number } } | [order: string | number | { order_number: string | number } ] | string | number | { order_number: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: success.url(args, options),
    method: 'get',
})

success.definition = {
    methods: ["get","head"],
    url: '/orders/{order}/success',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderController::success
 * @see app/Http/Controllers/OrderController.php:42
 * @route '/orders/{order}/success'
 */
success.url = (args: { order: string | number | { order_number: string | number } } | [order: string | number | { order_number: string | number } ] | string | number | { order_number: string | number }, options?: RouteQueryOptions) => {
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

    return success.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderController::success
 * @see app/Http/Controllers/OrderController.php:42
 * @route '/orders/{order}/success'
 */
success.get = (args: { order: string | number | { order_number: string | number } } | [order: string | number | { order_number: string | number } ] | string | number | { order_number: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: success.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OrderController::success
 * @see app/Http/Controllers/OrderController.php:42
 * @route '/orders/{order}/success'
 */
success.head = (args: { order: string | number | { order_number: string | number } } | [order: string | number | { order_number: string | number } ] | string | number | { order_number: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: success.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OrderController::success
 * @see app/Http/Controllers/OrderController.php:42
 * @route '/orders/{order}/success'
 */
    const successForm = (args: { order: string | number | { order_number: string | number } } | [order: string | number | { order_number: string | number } ] | string | number | { order_number: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: success.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OrderController::success
 * @see app/Http/Controllers/OrderController.php:42
 * @route '/orders/{order}/success'
 */
        successForm.get = (args: { order: string | number | { order_number: string | number } } | [order: string | number | { order_number: string | number } ] | string | number | { order_number: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: success.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OrderController::success
 * @see app/Http/Controllers/OrderController.php:42
 * @route '/orders/{order}/success'
 */
        successForm.head = (args: { order: string | number | { order_number: string | number } } | [order: string | number | { order_number: string | number } ] | string | number | { order_number: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: success.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    success.form = successForm
/**
* @see \App\Http\Controllers\OrderController::index
 * @see app/Http/Controllers/OrderController.php:14
 * @route '/orders'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/orders',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderController::index
 * @see app/Http/Controllers/OrderController.php:14
 * @route '/orders'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderController::index
 * @see app/Http/Controllers/OrderController.php:14
 * @route '/orders'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OrderController::index
 * @see app/Http/Controllers/OrderController.php:14
 * @route '/orders'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OrderController::index
 * @see app/Http/Controllers/OrderController.php:14
 * @route '/orders'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OrderController::index
 * @see app/Http/Controllers/OrderController.php:14
 * @route '/orders'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OrderController::index
 * @see app/Http/Controllers/OrderController.php:14
 * @route '/orders'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
const OrderController = { show, success, index }

export default OrderController