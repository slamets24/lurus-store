import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Auth\EmailOtpController::show
 * @see app/Http/Controllers/Auth/EmailOtpController.php:15
 * @route '/email/verify'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/email/verify',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\EmailOtpController::show
 * @see app/Http/Controllers/Auth/EmailOtpController.php:15
 * @route '/email/verify'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\EmailOtpController::show
 * @see app/Http/Controllers/Auth/EmailOtpController.php:15
 * @route '/email/verify'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\EmailOtpController::show
 * @see app/Http/Controllers/Auth/EmailOtpController.php:15
 * @route '/email/verify'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Auth\EmailOtpController::show
 * @see app/Http/Controllers/Auth/EmailOtpController.php:15
 * @route '/email/verify'
 */
    const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Auth\EmailOtpController::show
 * @see app/Http/Controllers/Auth/EmailOtpController.php:15
 * @route '/email/verify'
 */
        showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Auth\EmailOtpController::show
 * @see app/Http/Controllers/Auth/EmailOtpController.php:15
 * @route '/email/verify'
 */
        showForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Auth\EmailOtpController::verify
 * @see app/Http/Controllers/Auth/EmailOtpController.php:31
 * @route '/email/verify'
 */
export const verify = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(options),
    method: 'post',
})

verify.definition = {
    methods: ["post"],
    url: '/email/verify',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\EmailOtpController::verify
 * @see app/Http/Controllers/Auth/EmailOtpController.php:31
 * @route '/email/verify'
 */
verify.url = (options?: RouteQueryOptions) => {
    return verify.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\EmailOtpController::verify
 * @see app/Http/Controllers/Auth/EmailOtpController.php:31
 * @route '/email/verify'
 */
verify.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Auth\EmailOtpController::verify
 * @see app/Http/Controllers/Auth/EmailOtpController.php:31
 * @route '/email/verify'
 */
    const verifyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: verify.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Auth\EmailOtpController::verify
 * @see app/Http/Controllers/Auth/EmailOtpController.php:31
 * @route '/email/verify'
 */
        verifyForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: verify.url(options),
            method: 'post',
        })
    
    verify.form = verifyForm
/**
* @see \App\Http\Controllers\Auth\EmailOtpController::resend
 * @see app/Http/Controllers/Auth/EmailOtpController.php:49
 * @route '/email/verification-notification'
 */
export const resend = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resend.url(options),
    method: 'post',
})

resend.definition = {
    methods: ["post"],
    url: '/email/verification-notification',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\EmailOtpController::resend
 * @see app/Http/Controllers/Auth/EmailOtpController.php:49
 * @route '/email/verification-notification'
 */
resend.url = (options?: RouteQueryOptions) => {
    return resend.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\EmailOtpController::resend
 * @see app/Http/Controllers/Auth/EmailOtpController.php:49
 * @route '/email/verification-notification'
 */
resend.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resend.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Auth\EmailOtpController::resend
 * @see app/Http/Controllers/Auth/EmailOtpController.php:49
 * @route '/email/verification-notification'
 */
    const resendForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: resend.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Auth\EmailOtpController::resend
 * @see app/Http/Controllers/Auth/EmailOtpController.php:49
 * @route '/email/verification-notification'
 */
        resendForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: resend.url(options),
            method: 'post',
        })
    
    resend.form = resendForm
const EmailOtpController = { show, verify, resend }

export default EmailOtpController