import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\BiteshipWebhookController::__invoke
 * @see app/Http/Controllers/BiteshipWebhookController.php:10
 * @route '/webhooks/biteship'
 */
export const biteship = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: biteship.url(options),
    method: 'post',
})

biteship.definition = {
    methods: ["post"],
    url: '/webhooks/biteship',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BiteshipWebhookController::__invoke
 * @see app/Http/Controllers/BiteshipWebhookController.php:10
 * @route '/webhooks/biteship'
 */
biteship.url = (options?: RouteQueryOptions) => {
    return biteship.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BiteshipWebhookController::__invoke
 * @see app/Http/Controllers/BiteshipWebhookController.php:10
 * @route '/webhooks/biteship'
 */
biteship.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: biteship.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\BiteshipWebhookController::__invoke
 * @see app/Http/Controllers/BiteshipWebhookController.php:10
 * @route '/webhooks/biteship'
 */
    const biteshipForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: biteship.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BiteshipWebhookController::__invoke
 * @see app/Http/Controllers/BiteshipWebhookController.php:10
 * @route '/webhooks/biteship'
 */
        biteshipForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: biteship.url(options),
            method: 'post',
        })
    
    biteship.form = biteshipForm
const webhooks = {
    biteship: Object.assign(biteship, biteship),
}

export default webhooks