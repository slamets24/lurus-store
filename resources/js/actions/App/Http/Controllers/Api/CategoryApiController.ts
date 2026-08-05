import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\CategoryApiController::recent
 * @see app/Http/Controllers/Api/CategoryApiController.php:10
 * @route '/api/categories/recent'
 */
export const recent = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: recent.url(options),
    method: 'get',
})

recent.definition = {
    methods: ["get","head"],
    url: '/api/categories/recent',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\CategoryApiController::recent
 * @see app/Http/Controllers/Api/CategoryApiController.php:10
 * @route '/api/categories/recent'
 */
recent.url = (options?: RouteQueryOptions) => {
    return recent.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\CategoryApiController::recent
 * @see app/Http/Controllers/Api/CategoryApiController.php:10
 * @route '/api/categories/recent'
 */
recent.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: recent.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\CategoryApiController::recent
 * @see app/Http/Controllers/Api/CategoryApiController.php:10
 * @route '/api/categories/recent'
 */
recent.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: recent.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\CategoryApiController::recent
 * @see app/Http/Controllers/Api/CategoryApiController.php:10
 * @route '/api/categories/recent'
 */
    const recentForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: recent.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\CategoryApiController::recent
 * @see app/Http/Controllers/Api/CategoryApiController.php:10
 * @route '/api/categories/recent'
 */
        recentForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: recent.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\CategoryApiController::recent
 * @see app/Http/Controllers/Api/CategoryApiController.php:10
 * @route '/api/categories/recent'
 */
        recentForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: recent.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    recent.form = recentForm
const CategoryApiController = { recent }

export default CategoryApiController