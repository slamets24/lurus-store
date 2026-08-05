import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\CheckoutController::searchAreas
 * @see app/Http/Controllers/CheckoutController.php:81
 * @route '/checkout/areas'
 */
export const searchAreas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: searchAreas.url(options),
    method: 'get',
})

searchAreas.definition = {
    methods: ["get","head"],
    url: '/checkout/areas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CheckoutController::searchAreas
 * @see app/Http/Controllers/CheckoutController.php:81
 * @route '/checkout/areas'
 */
searchAreas.url = (options?: RouteQueryOptions) => {
    return searchAreas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CheckoutController::searchAreas
 * @see app/Http/Controllers/CheckoutController.php:81
 * @route '/checkout/areas'
 */
searchAreas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: searchAreas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CheckoutController::searchAreas
 * @see app/Http/Controllers/CheckoutController.php:81
 * @route '/checkout/areas'
 */
searchAreas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: searchAreas.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CheckoutController::searchAreas
 * @see app/Http/Controllers/CheckoutController.php:81
 * @route '/checkout/areas'
 */
    const searchAreasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: searchAreas.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CheckoutController::searchAreas
 * @see app/Http/Controllers/CheckoutController.php:81
 * @route '/checkout/areas'
 */
        searchAreasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: searchAreas.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CheckoutController::searchAreas
 * @see app/Http/Controllers/CheckoutController.php:81
 * @route '/checkout/areas'
 */
        searchAreasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: searchAreas.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    searchAreas.form = searchAreasForm
/**
* @see \App\Http\Controllers\CheckoutController::wilayahCities
 * @see app/Http/Controllers/CheckoutController.php:92
 * @route '/checkout/wilayah/cities'
 */
export const wilayahCities = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: wilayahCities.url(options),
    method: 'get',
})

wilayahCities.definition = {
    methods: ["get","head"],
    url: '/checkout/wilayah/cities',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CheckoutController::wilayahCities
 * @see app/Http/Controllers/CheckoutController.php:92
 * @route '/checkout/wilayah/cities'
 */
wilayahCities.url = (options?: RouteQueryOptions) => {
    return wilayahCities.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CheckoutController::wilayahCities
 * @see app/Http/Controllers/CheckoutController.php:92
 * @route '/checkout/wilayah/cities'
 */
wilayahCities.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: wilayahCities.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CheckoutController::wilayahCities
 * @see app/Http/Controllers/CheckoutController.php:92
 * @route '/checkout/wilayah/cities'
 */
wilayahCities.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: wilayahCities.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CheckoutController::wilayahCities
 * @see app/Http/Controllers/CheckoutController.php:92
 * @route '/checkout/wilayah/cities'
 */
    const wilayahCitiesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: wilayahCities.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CheckoutController::wilayahCities
 * @see app/Http/Controllers/CheckoutController.php:92
 * @route '/checkout/wilayah/cities'
 */
        wilayahCitiesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: wilayahCities.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CheckoutController::wilayahCities
 * @see app/Http/Controllers/CheckoutController.php:92
 * @route '/checkout/wilayah/cities'
 */
        wilayahCitiesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: wilayahCities.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    wilayahCities.form = wilayahCitiesForm
/**
* @see \App\Http\Controllers\CheckoutController::wilayahDistricts
 * @see app/Http/Controllers/CheckoutController.php:103
 * @route '/checkout/wilayah/districts'
 */
export const wilayahDistricts = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: wilayahDistricts.url(options),
    method: 'get',
})

wilayahDistricts.definition = {
    methods: ["get","head"],
    url: '/checkout/wilayah/districts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CheckoutController::wilayahDistricts
 * @see app/Http/Controllers/CheckoutController.php:103
 * @route '/checkout/wilayah/districts'
 */
wilayahDistricts.url = (options?: RouteQueryOptions) => {
    return wilayahDistricts.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CheckoutController::wilayahDistricts
 * @see app/Http/Controllers/CheckoutController.php:103
 * @route '/checkout/wilayah/districts'
 */
wilayahDistricts.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: wilayahDistricts.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CheckoutController::wilayahDistricts
 * @see app/Http/Controllers/CheckoutController.php:103
 * @route '/checkout/wilayah/districts'
 */
wilayahDistricts.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: wilayahDistricts.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CheckoutController::wilayahDistricts
 * @see app/Http/Controllers/CheckoutController.php:103
 * @route '/checkout/wilayah/districts'
 */
    const wilayahDistrictsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: wilayahDistricts.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CheckoutController::wilayahDistricts
 * @see app/Http/Controllers/CheckoutController.php:103
 * @route '/checkout/wilayah/districts'
 */
        wilayahDistrictsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: wilayahDistricts.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CheckoutController::wilayahDistricts
 * @see app/Http/Controllers/CheckoutController.php:103
 * @route '/checkout/wilayah/districts'
 */
        wilayahDistrictsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: wilayahDistricts.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    wilayahDistricts.form = wilayahDistrictsForm
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
const CheckoutController = { index, searchAreas, wilayahCities, wilayahDistricts, shippingRates, store }

export default CheckoutController