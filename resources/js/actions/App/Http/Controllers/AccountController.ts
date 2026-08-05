import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AccountController::updatePassword
 * @see app/Http/Controllers/AccountController.php:11
 * @route '/account/password'
 */
export const updatePassword = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updatePassword.url(options),
    method: 'patch',
})

updatePassword.definition = {
    methods: ["patch"],
    url: '/account/password',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\AccountController::updatePassword
 * @see app/Http/Controllers/AccountController.php:11
 * @route '/account/password'
 */
updatePassword.url = (options?: RouteQueryOptions) => {
    return updatePassword.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AccountController::updatePassword
 * @see app/Http/Controllers/AccountController.php:11
 * @route '/account/password'
 */
updatePassword.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updatePassword.url(options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\AccountController::updatePassword
 * @see app/Http/Controllers/AccountController.php:11
 * @route '/account/password'
 */
    const updatePasswordForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updatePassword.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AccountController::updatePassword
 * @see app/Http/Controllers/AccountController.php:11
 * @route '/account/password'
 */
        updatePasswordForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updatePassword.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updatePassword.form = updatePasswordForm
const AccountController = { updatePassword }

export default AccountController