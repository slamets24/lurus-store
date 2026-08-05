import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TestimonialController::create
 * @see app/Http/Controllers/TestimonialController.php:17
 * @route '/testimonials/{token}'
 */
export const create = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/testimonials/{token}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TestimonialController::create
 * @see app/Http/Controllers/TestimonialController.php:17
 * @route '/testimonials/{token}'
 */
create.url = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { token: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    token: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        token: args.token,
                }

    return create.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TestimonialController::create
 * @see app/Http/Controllers/TestimonialController.php:17
 * @route '/testimonials/{token}'
 */
create.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TestimonialController::create
 * @see app/Http/Controllers/TestimonialController.php:17
 * @route '/testimonials/{token}'
 */
create.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TestimonialController::create
 * @see app/Http/Controllers/TestimonialController.php:17
 * @route '/testimonials/{token}'
 */
    const createForm = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TestimonialController::create
 * @see app/Http/Controllers/TestimonialController.php:17
 * @route '/testimonials/{token}'
 */
        createForm.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TestimonialController::create
 * @see app/Http/Controllers/TestimonialController.php:17
 * @route '/testimonials/{token}'
 */
        createForm.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\TestimonialController::store
 * @see app/Http/Controllers/TestimonialController.php:36
 * @route '/testimonials/{token}'
 */
export const store = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/testimonials/{token}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TestimonialController::store
 * @see app/Http/Controllers/TestimonialController.php:36
 * @route '/testimonials/{token}'
 */
store.url = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { token: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    token: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        token: args.token,
                }

    return store.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TestimonialController::store
 * @see app/Http/Controllers/TestimonialController.php:36
 * @route '/testimonials/{token}'
 */
store.post = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TestimonialController::store
 * @see app/Http/Controllers/TestimonialController.php:36
 * @route '/testimonials/{token}'
 */
    const storeForm = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TestimonialController::store
 * @see app/Http/Controllers/TestimonialController.php:36
 * @route '/testimonials/{token}'
 */
        storeForm.post = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
const TestimonialController = { create, store }

export default TestimonialController