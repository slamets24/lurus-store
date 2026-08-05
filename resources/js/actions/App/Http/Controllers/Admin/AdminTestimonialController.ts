import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminTestimonialController::approve
 * @see app/Http/Controllers/Admin/AdminTestimonialController.php:11
 * @route '/admin/testimonials/{testimonial}/approve'
 */
export const approve = (args: { testimonial: string | number | { id: string | number } } | [testimonial: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: approve.url(args, options),
    method: 'patch',
})

approve.definition = {
    methods: ["patch"],
    url: '/admin/testimonials/{testimonial}/approve',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\AdminTestimonialController::approve
 * @see app/Http/Controllers/Admin/AdminTestimonialController.php:11
 * @route '/admin/testimonials/{testimonial}/approve'
 */
approve.url = (args: { testimonial: string | number | { id: string | number } } | [testimonial: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { testimonial: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { testimonial: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    testimonial: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        testimonial: typeof args.testimonial === 'object'
                ? args.testimonial.id
                : args.testimonial,
                }

    return approve.definition.url
            .replace('{testimonial}', parsedArgs.testimonial.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminTestimonialController::approve
 * @see app/Http/Controllers/Admin/AdminTestimonialController.php:11
 * @route '/admin/testimonials/{testimonial}/approve'
 */
approve.patch = (args: { testimonial: string | number | { id: string | number } } | [testimonial: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: approve.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\AdminTestimonialController::approve
 * @see app/Http/Controllers/Admin/AdminTestimonialController.php:11
 * @route '/admin/testimonials/{testimonial}/approve'
 */
    const approveForm = (args: { testimonial: string | number | { id: string | number } } | [testimonial: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approve.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminTestimonialController::approve
 * @see app/Http/Controllers/Admin/AdminTestimonialController.php:11
 * @route '/admin/testimonials/{testimonial}/approve'
 */
        approveForm.patch = (args: { testimonial: string | number | { id: string | number } } | [testimonial: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approve.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    approve.form = approveForm
/**
* @see \App\Http\Controllers\Admin\AdminTestimonialController::reject
 * @see app/Http/Controllers/Admin/AdminTestimonialController.php:18
 * @route '/admin/testimonials/{testimonial}'
 */
export const reject = (args: { testimonial: string | number | { id: string | number } } | [testimonial: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: reject.url(args, options),
    method: 'delete',
})

reject.definition = {
    methods: ["delete"],
    url: '/admin/testimonials/{testimonial}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\AdminTestimonialController::reject
 * @see app/Http/Controllers/Admin/AdminTestimonialController.php:18
 * @route '/admin/testimonials/{testimonial}'
 */
reject.url = (args: { testimonial: string | number | { id: string | number } } | [testimonial: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { testimonial: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { testimonial: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    testimonial: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        testimonial: typeof args.testimonial === 'object'
                ? args.testimonial.id
                : args.testimonial,
                }

    return reject.definition.url
            .replace('{testimonial}', parsedArgs.testimonial.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminTestimonialController::reject
 * @see app/Http/Controllers/Admin/AdminTestimonialController.php:18
 * @route '/admin/testimonials/{testimonial}'
 */
reject.delete = (args: { testimonial: string | number | { id: string | number } } | [testimonial: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: reject.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\AdminTestimonialController::reject
 * @see app/Http/Controllers/Admin/AdminTestimonialController.php:18
 * @route '/admin/testimonials/{testimonial}'
 */
    const rejectForm = (args: { testimonial: string | number | { id: string | number } } | [testimonial: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reject.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminTestimonialController::reject
 * @see app/Http/Controllers/Admin/AdminTestimonialController.php:18
 * @route '/admin/testimonials/{testimonial}'
 */
        rejectForm.delete = (args: { testimonial: string | number | { id: string | number } } | [testimonial: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reject.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    reject.form = rejectForm
const AdminTestimonialController = { approve, reject }

export default AdminTestimonialController