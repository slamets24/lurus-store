import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Auth\PasswordResetController::create
 * @see app/Http/Controllers/Auth/PasswordResetController.php:19
 * @route '/forgot-password'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/forgot-password',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\PasswordResetController::create
 * @see app/Http/Controllers/Auth/PasswordResetController.php:19
 * @route '/forgot-password'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\PasswordResetController::create
 * @see app/Http/Controllers/Auth/PasswordResetController.php:19
 * @route '/forgot-password'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\PasswordResetController::create
 * @see app/Http/Controllers/Auth/PasswordResetController.php:19
 * @route '/forgot-password'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Auth\PasswordResetController::create
 * @see app/Http/Controllers/Auth/PasswordResetController.php:19
 * @route '/forgot-password'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Auth\PasswordResetController::create
 * @see app/Http/Controllers/Auth/PasswordResetController.php:19
 * @route '/forgot-password'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Auth\PasswordResetController::create
 * @see app/Http/Controllers/Auth/PasswordResetController.php:19
 * @route '/forgot-password'
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
* @see \App\Http\Controllers\Auth\PasswordResetController::store
 * @see app/Http/Controllers/Auth/PasswordResetController.php:26
 * @route '/forgot-password'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/forgot-password',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\PasswordResetController::store
 * @see app/Http/Controllers/Auth/PasswordResetController.php:26
 * @route '/forgot-password'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\PasswordResetController::store
 * @see app/Http/Controllers/Auth/PasswordResetController.php:26
 * @route '/forgot-password'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Auth\PasswordResetController::store
 * @see app/Http/Controllers/Auth/PasswordResetController.php:26
 * @route '/forgot-password'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Auth\PasswordResetController::store
 * @see app/Http/Controllers/Auth/PasswordResetController.php:26
 * @route '/forgot-password'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Auth\PasswordResetController::edit
 * @see app/Http/Controllers/Auth/PasswordResetController.php:43
 * @route '/reset-password/{token}'
 */
export const edit = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/reset-password/{token}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\PasswordResetController::edit
 * @see app/Http/Controllers/Auth/PasswordResetController.php:43
 * @route '/reset-password/{token}'
 */
edit.url = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\PasswordResetController::edit
 * @see app/Http/Controllers/Auth/PasswordResetController.php:43
 * @route '/reset-password/{token}'
 */
edit.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\PasswordResetController::edit
 * @see app/Http/Controllers/Auth/PasswordResetController.php:43
 * @route '/reset-password/{token}'
 */
edit.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Auth\PasswordResetController::edit
 * @see app/Http/Controllers/Auth/PasswordResetController.php:43
 * @route '/reset-password/{token}'
 */
    const editForm = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Auth\PasswordResetController::edit
 * @see app/Http/Controllers/Auth/PasswordResetController.php:43
 * @route '/reset-password/{token}'
 */
        editForm.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Auth\PasswordResetController::edit
 * @see app/Http/Controllers/Auth/PasswordResetController.php:43
 * @route '/reset-password/{token}'
 */
        editForm.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Auth\PasswordResetController::update
 * @see app/Http/Controllers/Auth/PasswordResetController.php:51
 * @route '/reset-password'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/reset-password',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\PasswordResetController::update
 * @see app/Http/Controllers/Auth/PasswordResetController.php:51
 * @route '/reset-password'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\PasswordResetController::update
 * @see app/Http/Controllers/Auth/PasswordResetController.php:51
 * @route '/reset-password'
 */
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Auth\PasswordResetController::update
 * @see app/Http/Controllers/Auth/PasswordResetController.php:51
 * @route '/reset-password'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Auth\PasswordResetController::update
 * @see app/Http/Controllers/Auth/PasswordResetController.php:51
 * @route '/reset-password'
 */
        updateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(options),
            method: 'post',
        })
    
    update.form = updateForm
const PasswordResetController = { create, store, edit, update }

export default PasswordResetController