import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminHomepageController::index
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:24
 * @route '/admin/homepage'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/homepage',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminHomepageController::index
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:24
 * @route '/admin/homepage'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminHomepageController::index
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:24
 * @route '/admin/homepage'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminHomepageController::index
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:24
 * @route '/admin/homepage'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminHomepageController::index
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:24
 * @route '/admin/homepage'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminHomepageController::index
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:24
 * @route '/admin/homepage'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminHomepageController::index
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:24
 * @route '/admin/homepage'
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
* @see \App\Http\Controllers\Admin\AdminHomepageController::update
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:75
 * @route '/admin/homepage'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/admin/homepage',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminHomepageController::update
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:75
 * @route '/admin/homepage'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminHomepageController::update
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:75
 * @route '/admin/homepage'
 */
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AdminHomepageController::update
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:75
 * @route '/admin/homepage'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminHomepageController::update
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:75
 * @route '/admin/homepage'
 */
        updateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(options),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Admin\AdminHomepageController::updateSeo
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:100
 * @route '/admin/homepage/seo'
 */
export const updateSeo = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateSeo.url(options),
    method: 'put',
})

updateSeo.definition = {
    methods: ["put"],
    url: '/admin/homepage/seo',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\AdminHomepageController::updateSeo
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:100
 * @route '/admin/homepage/seo'
 */
updateSeo.url = (options?: RouteQueryOptions) => {
    return updateSeo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminHomepageController::updateSeo
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:100
 * @route '/admin/homepage/seo'
 */
updateSeo.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateSeo.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\AdminHomepageController::updateSeo
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:100
 * @route '/admin/homepage/seo'
 */
    const updateSeoForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateSeo.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminHomepageController::updateSeo
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:100
 * @route '/admin/homepage/seo'
 */
        updateSeoForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateSeo.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateSeo.form = updateSeoForm
/**
* @see \App\Http\Controllers\Admin\AdminHomepageController::storeSection
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:117
 * @route '/admin/homepage/sections'
 */
export const storeSection = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeSection.url(options),
    method: 'post',
})

storeSection.definition = {
    methods: ["post"],
    url: '/admin/homepage/sections',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminHomepageController::storeSection
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:117
 * @route '/admin/homepage/sections'
 */
storeSection.url = (options?: RouteQueryOptions) => {
    return storeSection.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminHomepageController::storeSection
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:117
 * @route '/admin/homepage/sections'
 */
storeSection.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeSection.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AdminHomepageController::storeSection
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:117
 * @route '/admin/homepage/sections'
 */
    const storeSectionForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeSection.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminHomepageController::storeSection
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:117
 * @route '/admin/homepage/sections'
 */
        storeSectionForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeSection.url(options),
            method: 'post',
        })
    
    storeSection.form = storeSectionForm
/**
* @see \App\Http\Controllers\Admin\AdminHomepageController::updateSection
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:129
 * @route '/admin/homepage/sections/{homeSection}'
 */
export const updateSection = (args: { homeSection: number | { id: number } } | [homeSection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateSection.url(args, options),
    method: 'put',
})

updateSection.definition = {
    methods: ["put"],
    url: '/admin/homepage/sections/{homeSection}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\AdminHomepageController::updateSection
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:129
 * @route '/admin/homepage/sections/{homeSection}'
 */
updateSection.url = (args: { homeSection: number | { id: number } } | [homeSection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { homeSection: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { homeSection: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    homeSection: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        homeSection: typeof args.homeSection === 'object'
                ? args.homeSection.id
                : args.homeSection,
                }

    return updateSection.definition.url
            .replace('{homeSection}', parsedArgs.homeSection.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminHomepageController::updateSection
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:129
 * @route '/admin/homepage/sections/{homeSection}'
 */
updateSection.put = (args: { homeSection: number | { id: number } } | [homeSection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateSection.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\AdminHomepageController::updateSection
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:129
 * @route '/admin/homepage/sections/{homeSection}'
 */
    const updateSectionForm = (args: { homeSection: number | { id: number } } | [homeSection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateSection.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminHomepageController::updateSection
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:129
 * @route '/admin/homepage/sections/{homeSection}'
 */
        updateSectionForm.put = (args: { homeSection: number | { id: number } } | [homeSection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateSection.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateSection.form = updateSectionForm
/**
* @see \App\Http\Controllers\Admin\AdminHomepageController::destroySection
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:141
 * @route '/admin/homepage/sections/{homeSection}'
 */
export const destroySection = (args: { homeSection: number | { id: number } } | [homeSection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroySection.url(args, options),
    method: 'delete',
})

destroySection.definition = {
    methods: ["delete"],
    url: '/admin/homepage/sections/{homeSection}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\AdminHomepageController::destroySection
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:141
 * @route '/admin/homepage/sections/{homeSection}'
 */
destroySection.url = (args: { homeSection: number | { id: number } } | [homeSection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { homeSection: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { homeSection: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    homeSection: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        homeSection: typeof args.homeSection === 'object'
                ? args.homeSection.id
                : args.homeSection,
                }

    return destroySection.definition.url
            .replace('{homeSection}', parsedArgs.homeSection.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminHomepageController::destroySection
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:141
 * @route '/admin/homepage/sections/{homeSection}'
 */
destroySection.delete = (args: { homeSection: number | { id: number } } | [homeSection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroySection.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\AdminHomepageController::destroySection
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:141
 * @route '/admin/homepage/sections/{homeSection}'
 */
    const destroySectionForm = (args: { homeSection: number | { id: number } } | [homeSection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroySection.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminHomepageController::destroySection
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:141
 * @route '/admin/homepage/sections/{homeSection}'
 */
        destroySectionForm.delete = (args: { homeSection: number | { id: number } } | [homeSection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroySection.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroySection.form = destroySectionForm
/**
* @see \App\Http\Controllers\Admin\AdminHomepageController::storeItem
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:148
 * @route '/admin/homepage/sections/{homeSection}/items'
 */
export const storeItem = (args: { homeSection: number | { id: number } } | [homeSection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeItem.url(args, options),
    method: 'post',
})

storeItem.definition = {
    methods: ["post"],
    url: '/admin/homepage/sections/{homeSection}/items',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminHomepageController::storeItem
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:148
 * @route '/admin/homepage/sections/{homeSection}/items'
 */
storeItem.url = (args: { homeSection: number | { id: number } } | [homeSection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { homeSection: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { homeSection: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    homeSection: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        homeSection: typeof args.homeSection === 'object'
                ? args.homeSection.id
                : args.homeSection,
                }

    return storeItem.definition.url
            .replace('{homeSection}', parsedArgs.homeSection.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminHomepageController::storeItem
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:148
 * @route '/admin/homepage/sections/{homeSection}/items'
 */
storeItem.post = (args: { homeSection: number | { id: number } } | [homeSection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeItem.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AdminHomepageController::storeItem
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:148
 * @route '/admin/homepage/sections/{homeSection}/items'
 */
    const storeItemForm = (args: { homeSection: number | { id: number } } | [homeSection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeItem.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminHomepageController::storeItem
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:148
 * @route '/admin/homepage/sections/{homeSection}/items'
 */
        storeItemForm.post = (args: { homeSection: number | { id: number } } | [homeSection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeItem.url(args, options),
            method: 'post',
        })
    
    storeItem.form = storeItemForm
/**
* @see \App\Http\Controllers\Admin\AdminHomepageController::updateItem
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:160
 * @route '/admin/homepage/items/{item}'
 */
export const updateItem = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateItem.url(args, options),
    method: 'put',
})

updateItem.definition = {
    methods: ["put"],
    url: '/admin/homepage/items/{item}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\AdminHomepageController::updateItem
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:160
 * @route '/admin/homepage/items/{item}'
 */
updateItem.url = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { item: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { item: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    item: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        item: typeof args.item === 'object'
                ? args.item.id
                : args.item,
                }

    return updateItem.definition.url
            .replace('{item}', parsedArgs.item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminHomepageController::updateItem
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:160
 * @route '/admin/homepage/items/{item}'
 */
updateItem.put = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateItem.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\AdminHomepageController::updateItem
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:160
 * @route '/admin/homepage/items/{item}'
 */
    const updateItemForm = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateItem.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminHomepageController::updateItem
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:160
 * @route '/admin/homepage/items/{item}'
 */
        updateItemForm.put = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateItem.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateItem.form = updateItemForm
/**
* @see \App\Http\Controllers\Admin\AdminHomepageController::destroyItem
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:172
 * @route '/admin/homepage/items/{item}'
 */
export const destroyItem = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyItem.url(args, options),
    method: 'delete',
})

destroyItem.definition = {
    methods: ["delete"],
    url: '/admin/homepage/items/{item}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\AdminHomepageController::destroyItem
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:172
 * @route '/admin/homepage/items/{item}'
 */
destroyItem.url = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { item: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { item: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    item: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        item: typeof args.item === 'object'
                ? args.item.id
                : args.item,
                }

    return destroyItem.definition.url
            .replace('{item}', parsedArgs.item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminHomepageController::destroyItem
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:172
 * @route '/admin/homepage/items/{item}'
 */
destroyItem.delete = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyItem.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\AdminHomepageController::destroyItem
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:172
 * @route '/admin/homepage/items/{item}'
 */
    const destroyItemForm = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyItem.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminHomepageController::destroyItem
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:172
 * @route '/admin/homepage/items/{item}'
 */
        destroyItemForm.delete = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyItem.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyItem.form = destroyItemForm
const AdminHomepageController = { index, update, updateSeo, storeSection, updateSection, destroySection, storeItem, updateItem, destroyItem }

export default AdminHomepageController