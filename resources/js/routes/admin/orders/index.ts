import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import payment from './payment'
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
* @see \App\Http\Controllers\Admin\AdminOrderController::status
 * @see app/Http/Controllers/Admin/AdminOrderController.php:115
 * @route '/admin/orders/{order}/status'
 */
export const status = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: status.url(args, options),
    method: 'patch',
})

status.definition = {
    methods: ["patch"],
    url: '/admin/orders/{order}/status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\AdminOrderController::status
 * @see app/Http/Controllers/Admin/AdminOrderController.php:115
 * @route '/admin/orders/{order}/status'
 */
status.url = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions) => {
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

    return status.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminOrderController::status
 * @see app/Http/Controllers/Admin/AdminOrderController.php:115
 * @route '/admin/orders/{order}/status'
 */
status.patch = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: status.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\AdminOrderController::status
 * @see app/Http/Controllers/Admin/AdminOrderController.php:115
 * @route '/admin/orders/{order}/status'
 */
    const statusForm = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: status.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminOrderController::status
 * @see app/Http/Controllers/Admin/AdminOrderController.php:115
 * @route '/admin/orders/{order}/status'
 */
        statusForm.patch = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: status.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    status.form = statusForm
/**
* @see \App\Http\Controllers\Admin\AdminOrderController::paymentProof
 * @see app/Http/Controllers/Admin/AdminOrderController.php:172
 * @route '/admin/orders/{order}/payment-proof'
 */
export const paymentProof = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: paymentProof.url(args, options),
    method: 'get',
})

paymentProof.definition = {
    methods: ["get","head"],
    url: '/admin/orders/{order}/payment-proof',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminOrderController::paymentProof
 * @see app/Http/Controllers/Admin/AdminOrderController.php:172
 * @route '/admin/orders/{order}/payment-proof'
 */
paymentProof.url = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions) => {
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

    return paymentProof.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminOrderController::paymentProof
 * @see app/Http/Controllers/Admin/AdminOrderController.php:172
 * @route '/admin/orders/{order}/payment-proof'
 */
paymentProof.get = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: paymentProof.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminOrderController::paymentProof
 * @see app/Http/Controllers/Admin/AdminOrderController.php:172
 * @route '/admin/orders/{order}/payment-proof'
 */
paymentProof.head = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: paymentProof.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminOrderController::paymentProof
 * @see app/Http/Controllers/Admin/AdminOrderController.php:172
 * @route '/admin/orders/{order}/payment-proof'
 */
    const paymentProofForm = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: paymentProof.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminOrderController::paymentProof
 * @see app/Http/Controllers/Admin/AdminOrderController.php:172
 * @route '/admin/orders/{order}/payment-proof'
 */
        paymentProofForm.get = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: paymentProof.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminOrderController::paymentProof
 * @see app/Http/Controllers/Admin/AdminOrderController.php:172
 * @route '/admin/orders/{order}/payment-proof'
 */
        paymentProofForm.head = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: paymentProof.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    paymentProof.form = paymentProofForm
/**
* @see \App\Http\Controllers\Admin\AdminOrderController::biteshipShipment
 * @see app/Http/Controllers/Admin/AdminOrderController.php:219
 * @route '/admin/orders/{order}/biteship-shipment'
 */
export const biteshipShipment = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: biteshipShipment.url(args, options),
    method: 'post',
})

biteshipShipment.definition = {
    methods: ["post"],
    url: '/admin/orders/{order}/biteship-shipment',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminOrderController::biteshipShipment
 * @see app/Http/Controllers/Admin/AdminOrderController.php:219
 * @route '/admin/orders/{order}/biteship-shipment'
 */
biteshipShipment.url = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions) => {
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

    return biteshipShipment.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminOrderController::biteshipShipment
 * @see app/Http/Controllers/Admin/AdminOrderController.php:219
 * @route '/admin/orders/{order}/biteship-shipment'
 */
biteshipShipment.post = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: biteshipShipment.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AdminOrderController::biteshipShipment
 * @see app/Http/Controllers/Admin/AdminOrderController.php:219
 * @route '/admin/orders/{order}/biteship-shipment'
 */
    const biteshipShipmentForm = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: biteshipShipment.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminOrderController::biteshipShipment
 * @see app/Http/Controllers/Admin/AdminOrderController.php:219
 * @route '/admin/orders/{order}/biteship-shipment'
 */
        biteshipShipmentForm.post = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: biteshipShipment.url(args, options),
            method: 'post',
        })
    
    biteshipShipment.form = biteshipShipmentForm
/**
* @see \App\Http\Controllers\Admin\AdminOrderController::waybill
 * @see app/Http/Controllers/Admin/AdminOrderController.php:232
 * @route '/admin/orders/{order}/waybill'
 */
export const waybill = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: waybill.url(args, options),
    method: 'patch',
})

waybill.definition = {
    methods: ["patch"],
    url: '/admin/orders/{order}/waybill',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\AdminOrderController::waybill
 * @see app/Http/Controllers/Admin/AdminOrderController.php:232
 * @route '/admin/orders/{order}/waybill'
 */
waybill.url = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions) => {
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

    return waybill.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminOrderController::waybill
 * @see app/Http/Controllers/Admin/AdminOrderController.php:232
 * @route '/admin/orders/{order}/waybill'
 */
waybill.patch = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: waybill.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\AdminOrderController::waybill
 * @see app/Http/Controllers/Admin/AdminOrderController.php:232
 * @route '/admin/orders/{order}/waybill'
 */
    const waybillForm = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: waybill.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminOrderController::waybill
 * @see app/Http/Controllers/Admin/AdminOrderController.php:232
 * @route '/admin/orders/{order}/waybill'
 */
        waybillForm.patch = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: waybill.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    waybill.form = waybillForm
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
const orders = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
status: Object.assign(status, status),
paymentProof: Object.assign(paymentProof, paymentProof),
payment: Object.assign(payment, payment),
biteshipShipment: Object.assign(biteshipShipment, biteshipShipment),
waybill: Object.assign(waybill, waybill),
shippingLabel: Object.assign(shippingLabel, shippingLabel),
testimonialReminder: Object.assign(testimonialReminder, testimonialReminder),
destroy: Object.assign(destroy, destroy),
}

export default orders