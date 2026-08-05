import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\CollectionApiController::index
 * @see app/Http/Controllers/Api/CollectionApiController.php:10
 * @route '/api/collections'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/collections',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\CollectionApiController::index
 * @see app/Http/Controllers/Api/CollectionApiController.php:10
 * @route '/api/collections'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\CollectionApiController::index
 * @see app/Http/Controllers/Api/CollectionApiController.php:10
 * @route '/api/collections'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\CollectionApiController::index
 * @see app/Http/Controllers/Api/CollectionApiController.php:10
 * @route '/api/collections'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\CollectionApiController::index
 * @see app/Http/Controllers/Api/CollectionApiController.php:10
 * @route '/api/collections'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\CollectionApiController::index
 * @see app/Http/Controllers/Api/CollectionApiController.php:10
 * @route '/api/collections'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\CollectionApiController::index
 * @see app/Http/Controllers/Api/CollectionApiController.php:10
 * @route '/api/collections'
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
const CollectionApiController = { index }

export default CollectionApiController