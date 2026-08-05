import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Auth\EmailOtpController::notice
 * @see app/Http/Controllers/Auth/EmailOtpController.php:15
 * @route '/email/verify'
 */
export const notice = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: notice.url(options),
    method: 'get',
})

notice.definition = {
    methods: ["get","head"],
    url: '/email/verify',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\EmailOtpController::notice
 * @see app/Http/Controllers/Auth/EmailOtpController.php:15
 * @route '/email/verify'
 */
notice.url = (options?: RouteQueryOptions) => {
    return notice.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\EmailOtpController::notice
 * @see app/Http/Controllers/Auth/EmailOtpController.php:15
 * @route '/email/verify'
 */
notice.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: notice.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\EmailOtpController::notice
 * @see app/Http/Controllers/Auth/EmailOtpController.php:15
 * @route '/email/verify'
 */
notice.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: notice.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Auth\EmailOtpController::notice
 * @see app/Http/Controllers/Auth/EmailOtpController.php:15
 * @route '/email/verify'
 */
    const noticeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: notice.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Auth\EmailOtpController::notice
 * @see app/Http/Controllers/Auth/EmailOtpController.php:15
 * @route '/email/verify'
 */
        noticeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: notice.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Auth\EmailOtpController::notice
 * @see app/Http/Controllers/Auth/EmailOtpController.php:15
 * @route '/email/verify'
 */
        noticeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: notice.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    notice.form = noticeForm
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
* @see \App\Http\Controllers\Auth\EmailOtpController::send
 * @see app/Http/Controllers/Auth/EmailOtpController.php:49
 * @route '/email/verification-notification'
 */
export const send = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(options),
    method: 'post',
})

send.definition = {
    methods: ["post"],
    url: '/email/verification-notification',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\EmailOtpController::send
 * @see app/Http/Controllers/Auth/EmailOtpController.php:49
 * @route '/email/verification-notification'
 */
send.url = (options?: RouteQueryOptions) => {
    return send.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\EmailOtpController::send
 * @see app/Http/Controllers/Auth/EmailOtpController.php:49
 * @route '/email/verification-notification'
 */
send.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Auth\EmailOtpController::send
 * @see app/Http/Controllers/Auth/EmailOtpController.php:49
 * @route '/email/verification-notification'
 */
    const sendForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: send.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Auth\EmailOtpController::send
 * @see app/Http/Controllers/Auth/EmailOtpController.php:49
 * @route '/email/verification-notification'
 */
        sendForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: send.url(options),
            method: 'post',
        })
    
    send.form = sendForm
const verification = {
    notice: Object.assign(notice, notice),
verify: Object.assign(verify, verify),
send: Object.assign(send, send),
}

export default verification