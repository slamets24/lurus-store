import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminProductController::index
 * @see app/Http/Controllers/Admin/AdminProductController.php:21
 * @route '/admin/products'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/products',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminProductController::index
 * @see app/Http/Controllers/Admin/AdminProductController.php:21
 * @route '/admin/products'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminProductController::index
 * @see app/Http/Controllers/Admin/AdminProductController.php:21
 * @route '/admin/products'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminProductController::index
 * @see app/Http/Controllers/Admin/AdminProductController.php:21
 * @route '/admin/products'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminProductController::index
 * @see app/Http/Controllers/Admin/AdminProductController.php:21
 * @route '/admin/products'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminProductController::index
 * @see app/Http/Controllers/Admin/AdminProductController.php:21
 * @route '/admin/products'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminProductController::index
 * @see app/Http/Controllers/Admin/AdminProductController.php:21
 * @route '/admin/products'
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
* @see \App\Http\Controllers\Admin\AdminProductController::create
 * @see app/Http/Controllers/Admin/AdminProductController.php:85
 * @route '/admin/products/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/products/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminProductController::create
 * @see app/Http/Controllers/Admin/AdminProductController.php:85
 * @route '/admin/products/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminProductController::create
 * @see app/Http/Controllers/Admin/AdminProductController.php:85
 * @route '/admin/products/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminProductController::create
 * @see app/Http/Controllers/Admin/AdminProductController.php:85
 * @route '/admin/products/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminProductController::create
 * @see app/Http/Controllers/Admin/AdminProductController.php:85
 * @route '/admin/products/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminProductController::create
 * @see app/Http/Controllers/Admin/AdminProductController.php:85
 * @route '/admin/products/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminProductController::create
 * @see app/Http/Controllers/Admin/AdminProductController.php:85
 * @route '/admin/products/create'
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
* @see \App\Http\Controllers\Admin\AdminProductController::store
 * @see app/Http/Controllers/Admin/AdminProductController.php:97
 * @route '/admin/products'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/products',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminProductController::store
 * @see app/Http/Controllers/Admin/AdminProductController.php:97
 * @route '/admin/products'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminProductController::store
 * @see app/Http/Controllers/Admin/AdminProductController.php:97
 * @route '/admin/products'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AdminProductController::store
 * @see app/Http/Controllers/Admin/AdminProductController.php:97
 * @route '/admin/products'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminProductController::store
 * @see app/Http/Controllers/Admin/AdminProductController.php:97
 * @route '/admin/products'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\AdminProductController::edit
 * @see app/Http/Controllers/Admin/AdminProductController.php:157
 * @route '/admin/products/{product}/edit'
 */
export const edit = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/products/{product}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminProductController::edit
 * @see app/Http/Controllers/Admin/AdminProductController.php:157
 * @route '/admin/products/{product}/edit'
 */
edit.url = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { product: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { product: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    product: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        product: typeof args.product === 'object'
                ? args.product.id
                : args.product,
                }

    return edit.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminProductController::edit
 * @see app/Http/Controllers/Admin/AdminProductController.php:157
 * @route '/admin/products/{product}/edit'
 */
edit.get = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminProductController::edit
 * @see app/Http/Controllers/Admin/AdminProductController.php:157
 * @route '/admin/products/{product}/edit'
 */
edit.head = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminProductController::edit
 * @see app/Http/Controllers/Admin/AdminProductController.php:157
 * @route '/admin/products/{product}/edit'
 */
    const editForm = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminProductController::edit
 * @see app/Http/Controllers/Admin/AdminProductController.php:157
 * @route '/admin/products/{product}/edit'
 */
        editForm.get = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminProductController::edit
 * @see app/Http/Controllers/Admin/AdminProductController.php:157
 * @route '/admin/products/{product}/edit'
 */
        editForm.head = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\AdminProductController::update
 * @see app/Http/Controllers/Admin/AdminProductController.php:203
 * @route '/admin/products/{product}'
 */
export const update = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/products/{product}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\AdminProductController::update
 * @see app/Http/Controllers/Admin/AdminProductController.php:203
 * @route '/admin/products/{product}'
 */
update.url = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { product: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { product: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    product: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        product: typeof args.product === 'object'
                ? args.product.id
                : args.product,
                }

    return update.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminProductController::update
 * @see app/Http/Controllers/Admin/AdminProductController.php:203
 * @route '/admin/products/{product}'
 */
update.put = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\AdminProductController::update
 * @see app/Http/Controllers/Admin/AdminProductController.php:203
 * @route '/admin/products/{product}'
 */
    const updateForm = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminProductController::update
 * @see app/Http/Controllers/Admin/AdminProductController.php:203
 * @route '/admin/products/{product}'
 */
        updateForm.put = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\AdminProductController::destroy
 * @see app/Http/Controllers/Admin/AdminProductController.php:266
 * @route '/admin/products/{product}'
 */
export const destroy = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/products/{product}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\AdminProductController::destroy
 * @see app/Http/Controllers/Admin/AdminProductController.php:266
 * @route '/admin/products/{product}'
 */
destroy.url = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { product: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { product: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    product: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        product: typeof args.product === 'object'
                ? args.product.id
                : args.product,
                }

    return destroy.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminProductController::destroy
 * @see app/Http/Controllers/Admin/AdminProductController.php:266
 * @route '/admin/products/{product}'
 */
destroy.delete = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\AdminProductController::destroy
 * @see app/Http/Controllers/Admin/AdminProductController.php:266
 * @route '/admin/products/{product}'
 */
    const destroyForm = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminProductController::destroy
 * @see app/Http/Controllers/Admin/AdminProductController.php:266
 * @route '/admin/products/{product}'
 */
        destroyForm.delete = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\Admin\AdminProductController::deleteImage
 * @see app/Http/Controllers/Admin/AdminProductController.php:578
 * @route '/admin/products/images/{image}'
 */
export const deleteImage = (args: { image: string | number | { id: string | number } } | [image: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteImage.url(args, options),
    method: 'delete',
})

deleteImage.definition = {
    methods: ["delete"],
    url: '/admin/products/images/{image}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\AdminProductController::deleteImage
 * @see app/Http/Controllers/Admin/AdminProductController.php:578
 * @route '/admin/products/images/{image}'
 */
deleteImage.url = (args: { image: string | number | { id: string | number } } | [image: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { image: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { image: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    image: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        image: typeof args.image === 'object'
                ? args.image.id
                : args.image,
                }

    return deleteImage.definition.url
            .replace('{image}', parsedArgs.image.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminProductController::deleteImage
 * @see app/Http/Controllers/Admin/AdminProductController.php:578
 * @route '/admin/products/images/{image}'
 */
deleteImage.delete = (args: { image: string | number | { id: string | number } } | [image: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteImage.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\AdminProductController::deleteImage
 * @see app/Http/Controllers/Admin/AdminProductController.php:578
 * @route '/admin/products/images/{image}'
 */
    const deleteImageForm = (args: { image: string | number | { id: string | number } } | [image: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteImage.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminProductController::deleteImage
 * @see app/Http/Controllers/Admin/AdminProductController.php:578
 * @route '/admin/products/images/{image}'
 */
        deleteImageForm.delete = (args: { image: string | number | { id: string | number } } | [image: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteImage.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteImage.form = deleteImageForm
const AdminProductController = { index, create, store, edit, update, destroy, deleteImage }

export default AdminProductController