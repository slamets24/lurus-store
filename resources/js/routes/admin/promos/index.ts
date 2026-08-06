import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminPromoController::index
 * @see app/Http/Controllers/Admin/AdminPromoController.php:18
 * @route '/admin/promos'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/promos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminPromoController::index
 * @see app/Http/Controllers/Admin/AdminPromoController.php:18
 * @route '/admin/promos'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminPromoController::index
 * @see app/Http/Controllers/Admin/AdminPromoController.php:18
 * @route '/admin/promos'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminPromoController::index
 * @see app/Http/Controllers/Admin/AdminPromoController.php:18
 * @route '/admin/promos'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminPromoController::index
 * @see app/Http/Controllers/Admin/AdminPromoController.php:18
 * @route '/admin/promos'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminPromoController::index
 * @see app/Http/Controllers/Admin/AdminPromoController.php:18
 * @route '/admin/promos'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminPromoController::index
 * @see app/Http/Controllers/Admin/AdminPromoController.php:18
 * @route '/admin/promos'
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
* @see \App\Http\Controllers\Admin\AdminPromoController::create
 * @see app/Http/Controllers/Admin/AdminPromoController.php:43
 * @route '/admin/promos/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/promos/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminPromoController::create
 * @see app/Http/Controllers/Admin/AdminPromoController.php:43
 * @route '/admin/promos/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminPromoController::create
 * @see app/Http/Controllers/Admin/AdminPromoController.php:43
 * @route '/admin/promos/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminPromoController::create
 * @see app/Http/Controllers/Admin/AdminPromoController.php:43
 * @route '/admin/promos/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminPromoController::create
 * @see app/Http/Controllers/Admin/AdminPromoController.php:43
 * @route '/admin/promos/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminPromoController::create
 * @see app/Http/Controllers/Admin/AdminPromoController.php:43
 * @route '/admin/promos/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminPromoController::create
 * @see app/Http/Controllers/Admin/AdminPromoController.php:43
 * @route '/admin/promos/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\Admin\AdminPromoController::store
 * @see app/Http/Controllers/Admin/AdminPromoController.php:51
 * @route '/admin/promos'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/promos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminPromoController::store
 * @see app/Http/Controllers/Admin/AdminPromoController.php:51
 * @route '/admin/promos'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminPromoController::store
 * @see app/Http/Controllers/Admin/AdminPromoController.php:51
 * @route '/admin/promos'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AdminPromoController::store
 * @see app/Http/Controllers/Admin/AdminPromoController.php:51
 * @route '/admin/promos'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminPromoController::store
 * @see app/Http/Controllers/Admin/AdminPromoController.php:51
 * @route '/admin/promos'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\AdminPromoController::edit
 * @see app/Http/Controllers/Admin/AdminPromoController.php:63
 * @route '/admin/promos/{promo}/edit'
 */
export const edit = (args: { promo: number | { id: number } } | [promo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/promos/{promo}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminPromoController::edit
 * @see app/Http/Controllers/Admin/AdminPromoController.php:63
 * @route '/admin/promos/{promo}/edit'
 */
edit.url = (args: { promo: number | { id: number } } | [promo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { promo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { promo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    promo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        promo: typeof args.promo === 'object'
                ? args.promo.id
                : args.promo,
                }

    return edit.definition.url
            .replace('{promo}', parsedArgs.promo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminPromoController::edit
 * @see app/Http/Controllers/Admin/AdminPromoController.php:63
 * @route '/admin/promos/{promo}/edit'
 */
edit.get = (args: { promo: number | { id: number } } | [promo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminPromoController::edit
 * @see app/Http/Controllers/Admin/AdminPromoController.php:63
 * @route '/admin/promos/{promo}/edit'
 */
edit.head = (args: { promo: number | { id: number } } | [promo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminPromoController::edit
 * @see app/Http/Controllers/Admin/AdminPromoController.php:63
 * @route '/admin/promos/{promo}/edit'
 */
    const editForm = (args: { promo: number | { id: number } } | [promo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminPromoController::edit
 * @see app/Http/Controllers/Admin/AdminPromoController.php:63
 * @route '/admin/promos/{promo}/edit'
 */
        editForm.get = (args: { promo: number | { id: number } } | [promo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminPromoController::edit
 * @see app/Http/Controllers/Admin/AdminPromoController.php:63
 * @route '/admin/promos/{promo}/edit'
 */
        editForm.head = (args: { promo: number | { id: number } } | [promo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\Admin\AdminPromoController::update
 * @see app/Http/Controllers/Admin/AdminPromoController.php:89
 * @route '/admin/promos/{promo}'
 */
export const update = (args: { promo: number | { id: number } } | [promo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/promos/{promo}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\AdminPromoController::update
 * @see app/Http/Controllers/Admin/AdminPromoController.php:89
 * @route '/admin/promos/{promo}'
 */
update.url = (args: { promo: number | { id: number } } | [promo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { promo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { promo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    promo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        promo: typeof args.promo === 'object'
                ? args.promo.id
                : args.promo,
                }

    return update.definition.url
            .replace('{promo}', parsedArgs.promo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminPromoController::update
 * @see app/Http/Controllers/Admin/AdminPromoController.php:89
 * @route '/admin/promos/{promo}'
 */
update.put = (args: { promo: number | { id: number } } | [promo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\AdminPromoController::update
 * @see app/Http/Controllers/Admin/AdminPromoController.php:89
 * @route '/admin/promos/{promo}'
 */
    const updateForm = (args: { promo: number | { id: number } } | [promo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminPromoController::update
 * @see app/Http/Controllers/Admin/AdminPromoController.php:89
 * @route '/admin/promos/{promo}'
 */
        updateForm.put = (args: { promo: number | { id: number } } | [promo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Admin\AdminPromoController::destroy
 * @see app/Http/Controllers/Admin/AdminPromoController.php:101
 * @route '/admin/promos/{promo}'
 */
export const destroy = (args: { promo: number | { id: number } } | [promo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/promos/{promo}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\AdminPromoController::destroy
 * @see app/Http/Controllers/Admin/AdminPromoController.php:101
 * @route '/admin/promos/{promo}'
 */
destroy.url = (args: { promo: number | { id: number } } | [promo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { promo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { promo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    promo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        promo: typeof args.promo === 'object'
                ? args.promo.id
                : args.promo,
                }

    return destroy.definition.url
            .replace('{promo}', parsedArgs.promo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminPromoController::destroy
 * @see app/Http/Controllers/Admin/AdminPromoController.php:101
 * @route '/admin/promos/{promo}'
 */
destroy.delete = (args: { promo: number | { id: number } } | [promo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\AdminPromoController::destroy
 * @see app/Http/Controllers/Admin/AdminPromoController.php:101
 * @route '/admin/promos/{promo}'
 */
    const destroyForm = (args: { promo: number | { id: number } } | [promo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminPromoController::destroy
 * @see app/Http/Controllers/Admin/AdminPromoController.php:101
 * @route '/admin/promos/{promo}'
 */
        destroyForm.delete = (args: { promo: number | { id: number } } | [promo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const promos = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default promos