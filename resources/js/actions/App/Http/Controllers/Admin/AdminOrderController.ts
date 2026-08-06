import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminOrderController::index
 * @see app/Http/Controllers/Admin/AdminOrderController.php:18
 * @route '/admin/orders'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/orders',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminOrderController::index
 * @see app/Http/Controllers/Admin/AdminOrderController.php:18
 * @route '/admin/orders'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminOrderController::index
 * @see app/Http/Controllers/Admin/AdminOrderController.php:18
 * @route '/admin/orders'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminOrderController::index
 * @see app/Http/Controllers/Admin/AdminOrderController.php:18
 * @route '/admin/orders'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminOrderController::index
 * @see app/Http/Controllers/Admin/AdminOrderController.php:18
 * @route '/admin/orders'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminOrderController::index
 * @see app/Http/Controllers/Admin/AdminOrderController.php:18
 * @route '/admin/orders'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminOrderController::index
 * @see app/Http/Controllers/Admin/AdminOrderController.php:18
 * @route '/admin/orders'
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
/**
* @see \App\Http\Controllers\Admin\AdminOrderController::show
 * @see app/Http/Controllers/Admin/AdminOrderController.php:53
 * @route '/admin/orders/{order}'
 */
export const show = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/orders/{order}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminOrderController::show
 * @see app/Http/Controllers/Admin/AdminOrderController.php:53
 * @route '/admin/orders/{order}'
 */
show.url = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions) => {
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
* @see \App\Http\Controllers\Admin\AdminOrderController::show
 * @see app/Http/Controllers/Admin/AdminOrderController.php:53
 * @route '/admin/orders/{order}'
 */
show.get = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminOrderController::show
 * @see app/Http/Controllers/Admin/AdminOrderController.php:53
 * @route '/admin/orders/{order}'
 */
show.head = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminOrderController::show
 * @see app/Http/Controllers/Admin/AdminOrderController.php:53
 * @route '/admin/orders/{order}'
 */
    const showForm = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminOrderController::show
 * @see app/Http/Controllers/Admin/AdminOrderController.php:53
 * @route '/admin/orders/{order}'
 */
        showForm.get = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminOrderController::show
 * @see app/Http/Controllers/Admin/AdminOrderController.php:53
 * @route '/admin/orders/{order}'
 */
        showForm.head = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\AdminOrderController::updateStatus
 * @see app/Http/Controllers/Admin/AdminOrderController.php:115
 * @route '/admin/orders/{order}/status'
 */
export const updateStatus = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateStatus.url(args, options),
    method: 'patch',
})

updateStatus.definition = {
    methods: ["patch"],
    url: '/admin/orders/{order}/status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\AdminOrderController::updateStatus
 * @see app/Http/Controllers/Admin/AdminOrderController.php:115
 * @route '/admin/orders/{order}/status'
 */
updateStatus.url = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions) => {
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

    return updateStatus.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminOrderController::updateStatus
 * @see app/Http/Controllers/Admin/AdminOrderController.php:115
 * @route '/admin/orders/{order}/status'
 */
updateStatus.patch = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateStatus.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\AdminOrderController::updateStatus
 * @see app/Http/Controllers/Admin/AdminOrderController.php:115
 * @route '/admin/orders/{order}/status'
 */
    const updateStatusForm = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateStatus.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminOrderController::updateStatus
 * @see app/Http/Controllers/Admin/AdminOrderController.php:115
 * @route '/admin/orders/{order}/status'
 */
        updateStatusForm.patch = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateStatus.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateStatus.form = updateStatusForm
/**
* @see \App\Http\Controllers\Admin\AdminOrderController::proof
 * @see app/Http/Controllers/Admin/AdminOrderController.php:172
 * @route '/admin/orders/{order}/payment-proof'
 */
export const proof = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: proof.url(args, options),
    method: 'get',
})

proof.definition = {
    methods: ["get","head"],
    url: '/admin/orders/{order}/payment-proof',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminOrderController::proof
 * @see app/Http/Controllers/Admin/AdminOrderController.php:172
 * @route '/admin/orders/{order}/payment-proof'
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
* @see \App\Http\Controllers\Admin\AdminOrderController::proof
 * @see app/Http/Controllers/Admin/AdminOrderController.php:172
 * @route '/admin/orders/{order}/payment-proof'
 */
proof.get = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: proof.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminOrderController::proof
 * @see app/Http/Controllers/Admin/AdminOrderController.php:172
 * @route '/admin/orders/{order}/payment-proof'
 */
proof.head = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: proof.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminOrderController::proof
 * @see app/Http/Controllers/Admin/AdminOrderController.php:172
 * @route '/admin/orders/{order}/payment-proof'
 */
    const proofForm = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: proof.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminOrderController::proof
 * @see app/Http/Controllers/Admin/AdminOrderController.php:172
 * @route '/admin/orders/{order}/payment-proof'
 */
        proofForm.get = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: proof.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminOrderController::proof
 * @see app/Http/Controllers/Admin/AdminOrderController.php:172
 * @route '/admin/orders/{order}/payment-proof'
 */
        proofForm.head = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: proof.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    proof.form = proofForm
/**
* @see \App\Http\Controllers\Admin\AdminOrderController::approvePayment
 * @see app/Http/Controllers/Admin/AdminOrderController.php:179
 * @route '/admin/orders/{order}/payment/approve'
 */
export const approvePayment = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: approvePayment.url(args, options),
    method: 'patch',
})

approvePayment.definition = {
    methods: ["patch"],
    url: '/admin/orders/{order}/payment/approve',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\AdminOrderController::approvePayment
 * @see app/Http/Controllers/Admin/AdminOrderController.php:179
 * @route '/admin/orders/{order}/payment/approve'
 */
approvePayment.url = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions) => {
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

    return approvePayment.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminOrderController::approvePayment
 * @see app/Http/Controllers/Admin/AdminOrderController.php:179
 * @route '/admin/orders/{order}/payment/approve'
 */
approvePayment.patch = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: approvePayment.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\AdminOrderController::approvePayment
 * @see app/Http/Controllers/Admin/AdminOrderController.php:179
 * @route '/admin/orders/{order}/payment/approve'
 */
    const approvePaymentForm = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approvePayment.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminOrderController::approvePayment
 * @see app/Http/Controllers/Admin/AdminOrderController.php:179
 * @route '/admin/orders/{order}/payment/approve'
 */
        approvePaymentForm.patch = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approvePayment.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    approvePayment.form = approvePaymentForm
/**
* @see \App\Http\Controllers\Admin\AdminOrderController::rejectPayment
 * @see app/Http/Controllers/Admin/AdminOrderController.php:197
 * @route '/admin/orders/{order}/payment/reject'
 */
export const rejectPayment = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: rejectPayment.url(args, options),
    method: 'patch',
})

rejectPayment.definition = {
    methods: ["patch"],
    url: '/admin/orders/{order}/payment/reject',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\AdminOrderController::rejectPayment
 * @see app/Http/Controllers/Admin/AdminOrderController.php:197
 * @route '/admin/orders/{order}/payment/reject'
 */
rejectPayment.url = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions) => {
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

    return rejectPayment.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminOrderController::rejectPayment
 * @see app/Http/Controllers/Admin/AdminOrderController.php:197
 * @route '/admin/orders/{order}/payment/reject'
 */
rejectPayment.patch = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: rejectPayment.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\AdminOrderController::rejectPayment
 * @see app/Http/Controllers/Admin/AdminOrderController.php:197
 * @route '/admin/orders/{order}/payment/reject'
 */
    const rejectPaymentForm = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: rejectPayment.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminOrderController::rejectPayment
 * @see app/Http/Controllers/Admin/AdminOrderController.php:197
 * @route '/admin/orders/{order}/payment/reject'
 */
        rejectPaymentForm.patch = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: rejectPayment.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    rejectPayment.form = rejectPaymentForm
/**
* @see \App\Http\Controllers\Admin\AdminOrderController::createBiteshipShipment
 * @see app/Http/Controllers/Admin/AdminOrderController.php:219
 * @route '/admin/orders/{order}/biteship-shipment'
 */
export const createBiteshipShipment = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createBiteshipShipment.url(args, options),
    method: 'post',
})

createBiteshipShipment.definition = {
    methods: ["post"],
    url: '/admin/orders/{order}/biteship-shipment',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminOrderController::createBiteshipShipment
 * @see app/Http/Controllers/Admin/AdminOrderController.php:219
 * @route '/admin/orders/{order}/biteship-shipment'
 */
createBiteshipShipment.url = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions) => {
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

    return createBiteshipShipment.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminOrderController::createBiteshipShipment
 * @see app/Http/Controllers/Admin/AdminOrderController.php:219
 * @route '/admin/orders/{order}/biteship-shipment'
 */
createBiteshipShipment.post = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createBiteshipShipment.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AdminOrderController::createBiteshipShipment
 * @see app/Http/Controllers/Admin/AdminOrderController.php:219
 * @route '/admin/orders/{order}/biteship-shipment'
 */
    const createBiteshipShipmentForm = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: createBiteshipShipment.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminOrderController::createBiteshipShipment
 * @see app/Http/Controllers/Admin/AdminOrderController.php:219
 * @route '/admin/orders/{order}/biteship-shipment'
 */
        createBiteshipShipmentForm.post = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: createBiteshipShipment.url(args, options),
            method: 'post',
        })
    
    createBiteshipShipment.form = createBiteshipShipmentForm
/**
* @see \App\Http\Controllers\Admin\AdminOrderController::updateWaybill
 * @see app/Http/Controllers/Admin/AdminOrderController.php:232
 * @route '/admin/orders/{order}/waybill'
 */
export const updateWaybill = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateWaybill.url(args, options),
    method: 'patch',
})

updateWaybill.definition = {
    methods: ["patch"],
    url: '/admin/orders/{order}/waybill',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\AdminOrderController::updateWaybill
 * @see app/Http/Controllers/Admin/AdminOrderController.php:232
 * @route '/admin/orders/{order}/waybill'
 */
updateWaybill.url = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions) => {
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

    return updateWaybill.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminOrderController::updateWaybill
 * @see app/Http/Controllers/Admin/AdminOrderController.php:232
 * @route '/admin/orders/{order}/waybill'
 */
updateWaybill.patch = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateWaybill.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\AdminOrderController::updateWaybill
 * @see app/Http/Controllers/Admin/AdminOrderController.php:232
 * @route '/admin/orders/{order}/waybill'
 */
    const updateWaybillForm = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateWaybill.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminOrderController::updateWaybill
 * @see app/Http/Controllers/Admin/AdminOrderController.php:232
 * @route '/admin/orders/{order}/waybill'
 */
        updateWaybillForm.patch = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateWaybill.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateWaybill.form = updateWaybillForm
/**
* @see \App\Http\Controllers\Admin\AdminOrderController::shippingLabel
 * @see app/Http/Controllers/Admin/AdminOrderController.php:243
 * @route '/admin/orders/{order}/shipping-label'
 */
export const shippingLabel = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: shippingLabel.url(args, options),
    method: 'get',
})

shippingLabel.definition = {
    methods: ["get","head"],
    url: '/admin/orders/{order}/shipping-label',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminOrderController::shippingLabel
 * @see app/Http/Controllers/Admin/AdminOrderController.php:243
 * @route '/admin/orders/{order}/shipping-label'
 */
shippingLabel.url = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions) => {
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

    return shippingLabel.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminOrderController::shippingLabel
 * @see app/Http/Controllers/Admin/AdminOrderController.php:243
 * @route '/admin/orders/{order}/shipping-label'
 */
shippingLabel.get = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: shippingLabel.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminOrderController::shippingLabel
 * @see app/Http/Controllers/Admin/AdminOrderController.php:243
 * @route '/admin/orders/{order}/shipping-label'
 */
shippingLabel.head = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: shippingLabel.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminOrderController::shippingLabel
 * @see app/Http/Controllers/Admin/AdminOrderController.php:243
 * @route '/admin/orders/{order}/shipping-label'
 */
    const shippingLabelForm = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: shippingLabel.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminOrderController::shippingLabel
 * @see app/Http/Controllers/Admin/AdminOrderController.php:243
 * @route '/admin/orders/{order}/shipping-label'
 */
        shippingLabelForm.get = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: shippingLabel.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminOrderController::shippingLabel
 * @see app/Http/Controllers/Admin/AdminOrderController.php:243
 * @route '/admin/orders/{order}/shipping-label'
 */
        shippingLabelForm.head = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: shippingLabel.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    shippingLabel.form = shippingLabelForm
/**
* @see \App\Http\Controllers\Admin\AdminOrderController::testimonialReminder
 * @see app/Http/Controllers/Admin/AdminOrderController.php:277
 * @route '/admin/orders/{order}/testimonial-reminder'
 */
export const testimonialReminder = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: testimonialReminder.url(args, options),
    method: 'post',
})

testimonialReminder.definition = {
    methods: ["post"],
    url: '/admin/orders/{order}/testimonial-reminder',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminOrderController::testimonialReminder
 * @see app/Http/Controllers/Admin/AdminOrderController.php:277
 * @route '/admin/orders/{order}/testimonial-reminder'
 */
testimonialReminder.url = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions) => {
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

    return testimonialReminder.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminOrderController::testimonialReminder
 * @see app/Http/Controllers/Admin/AdminOrderController.php:277
 * @route '/admin/orders/{order}/testimonial-reminder'
 */
testimonialReminder.post = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: testimonialReminder.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AdminOrderController::testimonialReminder
 * @see app/Http/Controllers/Admin/AdminOrderController.php:277
 * @route '/admin/orders/{order}/testimonial-reminder'
 */
    const testimonialReminderForm = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: testimonialReminder.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminOrderController::testimonialReminder
 * @see app/Http/Controllers/Admin/AdminOrderController.php:277
 * @route '/admin/orders/{order}/testimonial-reminder'
 */
        testimonialReminderForm.post = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: testimonialReminder.url(args, options),
            method: 'post',
        })
    
    testimonialReminder.form = testimonialReminderForm
/**
* @see \App\Http\Controllers\Admin\AdminOrderController::destroy
 * @see app/Http/Controllers/Admin/AdminOrderController.php:292
 * @route '/admin/orders/{order}'
 */
export const destroy = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/orders/{order}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\AdminOrderController::destroy
 * @see app/Http/Controllers/Admin/AdminOrderController.php:292
 * @route '/admin/orders/{order}'
 */
destroy.url = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminOrderController::destroy
 * @see app/Http/Controllers/Admin/AdminOrderController.php:292
 * @route '/admin/orders/{order}'
 */
destroy.delete = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\AdminOrderController::destroy
 * @see app/Http/Controllers/Admin/AdminOrderController.php:292
 * @route '/admin/orders/{order}'
 */
    const destroyForm = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminOrderController::destroy
 * @see app/Http/Controllers/Admin/AdminOrderController.php:292
 * @route '/admin/orders/{order}'
 */
        destroyForm.delete = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const AdminOrderController = { index, show, updateStatus, proof, approvePayment, rejectPayment, createBiteshipShipment, updateWaybill, shippingLabel, testimonialReminder, destroy }

export default AdminOrderController