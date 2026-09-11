import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\N8nProductController::getReadyToPost
 * @see app/Http/Controllers/Api/N8nProductController.php:15
 * @route '/api/n8n/products/ready-to-post'
 */
export const getReadyToPost = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getReadyToPost.url(options),
    method: 'get',
})

getReadyToPost.definition = {
    methods: ["get","head"],
    url: '/api/n8n/products/ready-to-post',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\N8nProductController::getReadyToPost
 * @see app/Http/Controllers/Api/N8nProductController.php:15
 * @route '/api/n8n/products/ready-to-post'
 */
getReadyToPost.url = (options?: RouteQueryOptions) => {
    return getReadyToPost.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\N8nProductController::getReadyToPost
 * @see app/Http/Controllers/Api/N8nProductController.php:15
 * @route '/api/n8n/products/ready-to-post'
 */
getReadyToPost.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getReadyToPost.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\N8nProductController::getReadyToPost
 * @see app/Http/Controllers/Api/N8nProductController.php:15
 * @route '/api/n8n/products/ready-to-post'
 */
getReadyToPost.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getReadyToPost.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\N8nProductController::getReadyToPost
 * @see app/Http/Controllers/Api/N8nProductController.php:15
 * @route '/api/n8n/products/ready-to-post'
 */
    const getReadyToPostForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getReadyToPost.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\N8nProductController::getReadyToPost
 * @see app/Http/Controllers/Api/N8nProductController.php:15
 * @route '/api/n8n/products/ready-to-post'
 */
        getReadyToPostForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getReadyToPost.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\N8nProductController::getReadyToPost
 * @see app/Http/Controllers/Api/N8nProductController.php:15
 * @route '/api/n8n/products/ready-to-post'
 */
        getReadyToPostForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getReadyToPost.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getReadyToPost.form = getReadyToPostForm
/**
* @see \App\Http\Controllers\Api\N8nProductController::markPosted
 * @see app/Http/Controllers/Api/N8nProductController.php:73
 * @route '/api/n8n/products/{id}/mark-posted'
 */
export const markPosted = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markPosted.url(args, options),
    method: 'post',
})

markPosted.definition = {
    methods: ["post"],
    url: '/api/n8n/products/{id}/mark-posted',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\N8nProductController::markPosted
 * @see app/Http/Controllers/Api/N8nProductController.php:73
 * @route '/api/n8n/products/{id}/mark-posted'
 */
markPosted.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return markPosted.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\N8nProductController::markPosted
 * @see app/Http/Controllers/Api/N8nProductController.php:73
 * @route '/api/n8n/products/{id}/mark-posted'
 */
markPosted.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markPosted.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\N8nProductController::markPosted
 * @see app/Http/Controllers/Api/N8nProductController.php:73
 * @route '/api/n8n/products/{id}/mark-posted'
 */
    const markPostedForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: markPosted.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\N8nProductController::markPosted
 * @see app/Http/Controllers/Api/N8nProductController.php:73
 * @route '/api/n8n/products/{id}/mark-posted'
 */
        markPostedForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: markPosted.url(args, options),
            method: 'post',
        })
    
    markPosted.form = markPostedForm
const N8nProductController = { getReadyToPost, markPosted }

export default N8nProductController