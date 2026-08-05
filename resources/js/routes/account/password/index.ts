import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AccountController::update
 * @see app/Http/Controllers/AccountController.php:11
 * @route '/account/password'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/account/password',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\AccountController::update
 * @see app/Http/Controllers/AccountController.php:11
 * @route '/account/password'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AccountController::update
 * @see app/Http/Controllers/AccountController.php:11
 * @route '/account/password'
 */
update.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\AccountController::update
 * @see app/Http/Controllers/AccountController.php:11
 * @route '/account/password'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AccountController::update
 * @see app/Http/Controllers/AccountController.php:11
 * @route '/account/password'
 */
        updateForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const password = {
    update: Object.assign(update, update),
}

export default password