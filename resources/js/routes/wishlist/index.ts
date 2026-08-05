import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\WishlistController::index
 * @see app/Http/Controllers/WishlistController.php:11
 * @route '/wishlist'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/wishlist',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WishlistController::index
 * @see app/Http/Controllers/WishlistController.php:11
 * @route '/wishlist'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WishlistController::index
 * @see app/Http/Controllers/WishlistController.php:11
 * @route '/wishlist'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WishlistController::index
 * @see app/Http/Controllers/WishlistController.php:11
 * @route '/wishlist'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WishlistController::index
 * @see app/Http/Controllers/WishlistController.php:11
 * @route '/wishlist'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WishlistController::index
 * @see app/Http/Controllers/WishlistController.php:11
 * @route '/wishlist'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WishlistController::index
 * @see app/Http/Controllers/WishlistController.php:11
 * @route '/wishlist'
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
* @see \App\Http\Controllers\WishlistController::store
 * @see app/Http/Controllers/WishlistController.php:24
 * @route '/wishlist'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/wishlist',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WishlistController::store
 * @see app/Http/Controllers/WishlistController.php:24
 * @route '/wishlist'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WishlistController::store
 * @see app/Http/Controllers/WishlistController.php:24
 * @route '/wishlist'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\WishlistController::store
 * @see app/Http/Controllers/WishlistController.php:24
 * @route '/wishlist'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WishlistController::store
 * @see app/Http/Controllers/WishlistController.php:24
 * @route '/wishlist'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\WishlistController::destroy
 * @see app/Http/Controllers/WishlistController.php:38
 * @route '/wishlist/{wishlistItem}'
 */
export const destroy = (args: { wishlistItem: string | number | { id: string | number } } | [wishlistItem: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/wishlist/{wishlistItem}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\WishlistController::destroy
 * @see app/Http/Controllers/WishlistController.php:38
 * @route '/wishlist/{wishlistItem}'
 */
destroy.url = (args: { wishlistItem: string | number | { id: string | number } } | [wishlistItem: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { wishlistItem: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { wishlistItem: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    wishlistItem: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        wishlistItem: typeof args.wishlistItem === 'object'
                ? args.wishlistItem.id
                : args.wishlistItem,
                }

    return destroy.definition.url
            .replace('{wishlistItem}', parsedArgs.wishlistItem.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WishlistController::destroy
 * @see app/Http/Controllers/WishlistController.php:38
 * @route '/wishlist/{wishlistItem}'
 */
destroy.delete = (args: { wishlistItem: string | number | { id: string | number } } | [wishlistItem: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\WishlistController::destroy
 * @see app/Http/Controllers/WishlistController.php:38
 * @route '/wishlist/{wishlistItem}'
 */
    const destroyForm = (args: { wishlistItem: string | number | { id: string | number } } | [wishlistItem: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WishlistController::destroy
 * @see app/Http/Controllers/WishlistController.php:38
 * @route '/wishlist/{wishlistItem}'
 */
        destroyForm.delete = (args: { wishlistItem: string | number | { id: string | number } } | [wishlistItem: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const wishlist = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
destroy: Object.assign(destroy, destroy),
}

export default wishlist