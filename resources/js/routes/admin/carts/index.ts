import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminCartController::index
 * @see app/Http/Controllers/Admin/AdminCartController.php:11
 * @route '/admin/carts'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/carts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminCartController::index
 * @see app/Http/Controllers/Admin/AdminCartController.php:11
 * @route '/admin/carts'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminCartController::index
 * @see app/Http/Controllers/Admin/AdminCartController.php:11
 * @route '/admin/carts'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminCartController::index
 * @see app/Http/Controllers/Admin/AdminCartController.php:11
 * @route '/admin/carts'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminCartController::index
 * @see app/Http/Controllers/Admin/AdminCartController.php:11
 * @route '/admin/carts'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminCartController::index
 * @see app/Http/Controllers/Admin/AdminCartController.php:11
 * @route '/admin/carts'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminCartController::index
 * @see app/Http/Controllers/Admin/AdminCartController.php:11
 * @route '/admin/carts'
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
* @see \App\Http\Controllers\Admin\AdminCartController::destroy
 * @see app/Http/Controllers/Admin/AdminCartController.php:48
 * @route '/admin/carts/{cartItem}'
 */
export const destroy = (args: { cartItem: string | number | { id: string | number } } | [cartItem: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/carts/{cartItem}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\AdminCartController::destroy
 * @see app/Http/Controllers/Admin/AdminCartController.php:48
 * @route '/admin/carts/{cartItem}'
 */
destroy.url = (args: { cartItem: string | number | { id: string | number } } | [cartItem: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cartItem: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cartItem: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cartItem: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cartItem: typeof args.cartItem === 'object'
                ? args.cartItem.id
                : args.cartItem,
                }

    return destroy.definition.url
            .replace('{cartItem}', parsedArgs.cartItem.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminCartController::destroy
 * @see app/Http/Controllers/Admin/AdminCartController.php:48
 * @route '/admin/carts/{cartItem}'
 */
destroy.delete = (args: { cartItem: string | number | { id: string | number } } | [cartItem: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\AdminCartController::destroy
 * @see app/Http/Controllers/Admin/AdminCartController.php:48
 * @route '/admin/carts/{cartItem}'
 */
    const destroyForm = (args: { cartItem: string | number | { id: string | number } } | [cartItem: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminCartController::destroy
 * @see app/Http/Controllers/Admin/AdminCartController.php:48
 * @route '/admin/carts/{cartItem}'
 */
        destroyForm.delete = (args: { cartItem: string | number | { id: string | number } } | [cartItem: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const carts = {
    index: Object.assign(index, index),
destroy: Object.assign(destroy, destroy),
}

export default carts