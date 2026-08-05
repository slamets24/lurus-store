import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminProductController::destroy
 * @see app/Http/Controllers/Admin/AdminProductController.php:578
 * @route '/admin/products/images/{image}'
 */
export const destroy = (args: { image: string | number | { id: string | number } } | [image: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/products/images/{image}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\AdminProductController::destroy
 * @see app/Http/Controllers/Admin/AdminProductController.php:578
 * @route '/admin/products/images/{image}'
 */
destroy.url = (args: { image: string | number | { id: string | number } } | [image: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{image}', parsedArgs.image.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminProductController::destroy
 * @see app/Http/Controllers/Admin/AdminProductController.php:578
 * @route '/admin/products/images/{image}'
 */
destroy.delete = (args: { image: string | number | { id: string | number } } | [image: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\AdminProductController::destroy
 * @see app/Http/Controllers/Admin/AdminProductController.php:578
 * @route '/admin/products/images/{image}'
 */
    const destroyForm = (args: { image: string | number | { id: string | number } } | [image: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/Admin/AdminProductController.php:578
 * @route '/admin/products/images/{image}'
 */
        destroyForm.delete = (args: { image: string | number | { id: string | number } } | [image: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const images = {
    destroy: Object.assign(destroy, destroy),
}

export default images