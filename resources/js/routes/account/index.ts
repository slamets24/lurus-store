import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import password from './password'
/**
* @see \App\Http\Controllers\ProfileController::update
 * @see app/Http/Controllers/ProfileController.php:19
 * @route '/account'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/account',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\ProfileController::update
 * @see app/Http/Controllers/ProfileController.php:19
 * @route '/account'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProfileController::update
 * @see app/Http/Controllers/ProfileController.php:19
 * @route '/account'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\ProfileController::update
 * @see app/Http/Controllers/ProfileController.php:19
 * @route '/account'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProfileController::update
 * @see app/Http/Controllers/ProfileController.php:19
 * @route '/account'
 */
        updateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const account = {
    update: Object.assign(update, update),
password: Object.assign(password, password),
}

export default account