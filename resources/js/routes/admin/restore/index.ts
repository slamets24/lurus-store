import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminRestoreController::index
 * @see app/Http/Controllers/Admin/AdminRestoreController.php:31
 * @route '/admin/restore'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/restore',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminRestoreController::index
 * @see app/Http/Controllers/Admin/AdminRestoreController.php:31
 * @route '/admin/restore'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminRestoreController::index
 * @see app/Http/Controllers/Admin/AdminRestoreController.php:31
 * @route '/admin/restore'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminRestoreController::index
 * @see app/Http/Controllers/Admin/AdminRestoreController.php:31
 * @route '/admin/restore'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminRestoreController::index
 * @see app/Http/Controllers/Admin/AdminRestoreController.php:31
 * @route '/admin/restore'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminRestoreController::index
 * @see app/Http/Controllers/Admin/AdminRestoreController.php:31
 * @route '/admin/restore'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminRestoreController::index
 * @see app/Http/Controllers/Admin/AdminRestoreController.php:31
 * @route '/admin/restore'
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
* @see \App\Http\Controllers\Admin\AdminRestoreController::store
 * @see app/Http/Controllers/Admin/AdminRestoreController.php:56
 * @route '/admin/restore/{type}/{id}'
 */
export const store = (args: { type: string | number, id: string | number } | [type: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/restore/{type}/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminRestoreController::store
 * @see app/Http/Controllers/Admin/AdminRestoreController.php:56
 * @route '/admin/restore/{type}/{id}'
 */
store.url = (args: { type: string | number, id: string | number } | [type: string | number, id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    type: args[0],
                    id: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        type: args.type,
                                id: args.id,
                }

    return store.definition.url
            .replace('{type}', parsedArgs.type.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminRestoreController::store
 * @see app/Http/Controllers/Admin/AdminRestoreController.php:56
 * @route '/admin/restore/{type}/{id}'
 */
store.post = (args: { type: string | number, id: string | number } | [type: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AdminRestoreController::store
 * @see app/Http/Controllers/Admin/AdminRestoreController.php:56
 * @route '/admin/restore/{type}/{id}'
 */
    const storeForm = (args: { type: string | number, id: string | number } | [type: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminRestoreController::store
 * @see app/Http/Controllers/Admin/AdminRestoreController.php:56
 * @route '/admin/restore/{type}/{id}'
 */
        storeForm.post = (args: { type: string | number, id: string | number } | [type: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\AdminRestoreController::destroy
 * @see app/Http/Controllers/Admin/AdminRestoreController.php:66
 * @route '/admin/restore/{type}/{id}'
 */
export const destroy = (args: { type: string | number, id: string | number } | [type: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/restore/{type}/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\AdminRestoreController::destroy
 * @see app/Http/Controllers/Admin/AdminRestoreController.php:66
 * @route '/admin/restore/{type}/{id}'
 */
destroy.url = (args: { type: string | number, id: string | number } | [type: string | number, id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    type: args[0],
                    id: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        type: args.type,
                                id: args.id,
                }

    return destroy.definition.url
            .replace('{type}', parsedArgs.type.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminRestoreController::destroy
 * @see app/Http/Controllers/Admin/AdminRestoreController.php:66
 * @route '/admin/restore/{type}/{id}'
 */
destroy.delete = (args: { type: string | number, id: string | number } | [type: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\AdminRestoreController::destroy
 * @see app/Http/Controllers/Admin/AdminRestoreController.php:66
 * @route '/admin/restore/{type}/{id}'
 */
    const destroyForm = (args: { type: string | number, id: string | number } | [type: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminRestoreController::destroy
 * @see app/Http/Controllers/Admin/AdminRestoreController.php:66
 * @route '/admin/restore/{type}/{id}'
 */
        destroyForm.delete = (args: { type: string | number, id: string | number } | [type: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const restore = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
destroy: Object.assign(destroy, destroy),
}

export default restore