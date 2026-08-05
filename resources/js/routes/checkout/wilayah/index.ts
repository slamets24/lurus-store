import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\CheckoutController::cities
 * @see app/Http/Controllers/CheckoutController.php:92
 * @route '/checkout/wilayah/cities'
 */
export const cities = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cities.url(options),
    method: 'get',
})

cities.definition = {
    methods: ["get","head"],
    url: '/checkout/wilayah/cities',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CheckoutController::cities
 * @see app/Http/Controllers/CheckoutController.php:92
 * @route '/checkout/wilayah/cities'
 */
cities.url = (options?: RouteQueryOptions) => {
    return cities.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CheckoutController::cities
 * @see app/Http/Controllers/CheckoutController.php:92
 * @route '/checkout/wilayah/cities'
 */
cities.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cities.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CheckoutController::cities
 * @see app/Http/Controllers/CheckoutController.php:92
 * @route '/checkout/wilayah/cities'
 */
cities.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cities.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CheckoutController::cities
 * @see app/Http/Controllers/CheckoutController.php:92
 * @route '/checkout/wilayah/cities'
 */
    const citiesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: cities.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CheckoutController::cities
 * @see app/Http/Controllers/CheckoutController.php:92
 * @route '/checkout/wilayah/cities'
 */
        citiesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cities.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CheckoutController::cities
 * @see app/Http/Controllers/CheckoutController.php:92
 * @route '/checkout/wilayah/cities'
 */
        citiesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cities.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    cities.form = citiesForm
/**
* @see \App\Http\Controllers\CheckoutController::districts
 * @see app/Http/Controllers/CheckoutController.php:103
 * @route '/checkout/wilayah/districts'
 */
export const districts = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: districts.url(options),
    method: 'get',
})

districts.definition = {
    methods: ["get","head"],
    url: '/checkout/wilayah/districts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CheckoutController::districts
 * @see app/Http/Controllers/CheckoutController.php:103
 * @route '/checkout/wilayah/districts'
 */
districts.url = (options?: RouteQueryOptions) => {
    return districts.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CheckoutController::districts
 * @see app/Http/Controllers/CheckoutController.php:103
 * @route '/checkout/wilayah/districts'
 */
districts.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: districts.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CheckoutController::districts
 * @see app/Http/Controllers/CheckoutController.php:103
 * @route '/checkout/wilayah/districts'
 */
districts.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: districts.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CheckoutController::districts
 * @see app/Http/Controllers/CheckoutController.php:103
 * @route '/checkout/wilayah/districts'
 */
    const districtsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: districts.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CheckoutController::districts
 * @see app/Http/Controllers/CheckoutController.php:103
 * @route '/checkout/wilayah/districts'
 */
        districtsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: districts.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CheckoutController::districts
 * @see app/Http/Controllers/CheckoutController.php:103
 * @route '/checkout/wilayah/districts'
 */
        districtsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: districts.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    districts.form = districtsForm
const wilayah = {
    cities: Object.assign(cities, cities),
districts: Object.assign(districts, districts),
}

export default wilayah