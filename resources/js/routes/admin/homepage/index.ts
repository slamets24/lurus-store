import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminHomepageController::index
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:16
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
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:16
 * @route '/admin/homepage'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminHomepageController::index
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:16
 * @route '/admin/homepage'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminHomepageController::index
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:16
 * @route '/admin/homepage'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminHomepageController::index
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:16
 * @route '/admin/homepage'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminHomepageController::index
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:16
 * @route '/admin/homepage'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminHomepageController::index
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:16
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
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:40
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
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:40
 * @route '/admin/homepage'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminHomepageController::update
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:40
 * @route '/admin/homepage'
 */
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AdminHomepageController::update
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:40
 * @route '/admin/homepage'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminHomepageController::update
 * @see app/Http/Controllers/Admin/AdminHomepageController.php:40
 * @route '/admin/homepage'
 */
        updateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(options),
            method: 'post',
        })
    
    update.form = updateForm
const homepage = {
    index: Object.assign(index, index),
update: Object.assign(update, update),
}

export default homepage