import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import wilayah from './wilayah'
/**
* @see \App\Http\Controllers\CheckoutController::index
 * @see app/Http/Controllers/CheckoutController.php:20
 * @route '/checkout'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/checkout',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CheckoutController::index
 * @see app/Http/Controllers/CheckoutController.php:20
 * @route '/checkout'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CheckoutController::index
 * @see app/Http/Controllers/CheckoutController.php:20
 * @route '/checkout'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CheckoutController::index
 * @see app/Http/Controllers/CheckoutController.php:20
 * @route '/checkout'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CheckoutController::index
 * @see app/Http/Controllers/CheckoutController.php:20
 * @route '/checkout'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CheckoutController::index
 * @see app/Http/Controllers/CheckoutController.php:20
 * @route '/checkout'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CheckoutController::index
 * @see app/Http/Controllers/CheckoutController.php:20
 * @route '/checkout'
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
* @see \App\Http\Controllers\CheckoutController::areas
 * @see app/Http/Controllers/CheckoutController.php:81
 * @route '/checkout/areas'
 */
export const areas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: areas.url(options),
    method: 'get',
})

areas.definition = {
    methods: ["get","head"],
    url: '/checkout/areas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CheckoutController::areas
 * @see app/Http/Controllers/CheckoutController.php:81
 * @route '/checkout/areas'
 */
areas.url = (options?: RouteQueryOptions) => {
    return areas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CheckoutController::areas
 * @see app/Http/Controllers/CheckoutController.php:81
 * @route '/checkout/areas'
 */
areas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: areas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CheckoutController::areas
 * @see app/Http/Controllers/CheckoutController.php:81
 * @route '/checkout/areas'
 */
areas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: areas.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CheckoutController::areas
 * @see app/Http/Controllers/CheckoutController.php:81
 * @route '/checkout/areas'
 */
    const areasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: areas.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CheckoutController::areas
 * @see app/Http/Controllers/CheckoutController.php:81
 * @route '/checkout/areas'
 */
        areasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: areas.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CheckoutController::areas
 * @see app/Http/Controllers/CheckoutController.php:81
 * @route '/checkout/areas'
 */
        areasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: areas.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    areas.form = areasForm
/**
* @see \App\Http\Controllers\CheckoutController::shippingRates
 * @see app/Http/Controllers/CheckoutController.php:59
 * @route '/checkout/shipping-rates'
 */
export const shippingRates = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: shippingRates.url(options),
    method: 'post',
})

shippingRates.definition = {
    methods: ["post"],
    url: '/checkout/shipping-rates',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CheckoutController::shippingRates
 * @see app/Http/Controllers/CheckoutController.php:59
 * @route '/checkout/shipping-rates'
 */
shippingRates.url = (options?: RouteQueryOptions) => {
    return shippingRates.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CheckoutController::shippingRates
 * @see app/Http/Controllers/CheckoutController.php:59
 * @route '/checkout/shipping-rates'
 */
shippingRates.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: shippingRates.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CheckoutController::shippingRates
 * @see app/Http/Controllers/CheckoutController.php:59
 * @route '/checkout/shipping-rates'
 */
    const shippingRatesForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: shippingRates.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CheckoutController::shippingRates
 * @see app/Http/Controllers/CheckoutController.php:59
 * @route '/checkout/shipping-rates'
 */
        shippingRatesForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: shippingRates.url(options),
            method: 'post',
        })
    
    shippingRates.form = shippingRatesForm
/**
* @see \App\Http\Controllers\CheckoutController::store
 * @see app/Http/Controllers/CheckoutController.php:114
 * @route '/checkout'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CheckoutController::store
 * @see app/Http/Controllers/CheckoutController.php:114
 * @route '/checkout'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CheckoutController::store
 * @see app/Http/Controllers/CheckoutController.php:114
 * @route '/checkout'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CheckoutController::store
 * @see app/Http/Controllers/CheckoutController.php:114
 * @route '/checkout'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CheckoutController::store
 * @see app/Http/Controllers/CheckoutController.php:114
 * @route '/checkout'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const checkout = {
    index: Object.assign(index, index),
areas: Object.assign(areas, areas),
wilayah: Object.assign(wilayah, wilayah),
shippingRates: Object.assign(shippingRates, shippingRates),
store: Object.assign(store, store),
}

export default checkout