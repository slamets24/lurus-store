import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BiteshipWebhookController::__invoke
 * @see app/Http/Controllers/BiteshipWebhookController.php:10
 * @route '/webhooks/biteship'
 */
const BiteshipWebhookController = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: BiteshipWebhookController.url(options),
    method: 'post',
})

BiteshipWebhookController.definition = {
    methods: ["post"],
    url: '/webhooks/biteship',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BiteshipWebhookController::__invoke
 * @see app/Http/Controllers/BiteshipWebhookController.php:10
 * @route '/webhooks/biteship'
 */
BiteshipWebhookController.url = (options?: RouteQueryOptions) => {
    return BiteshipWebhookController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BiteshipWebhookController::__invoke
 * @see app/Http/Controllers/BiteshipWebhookController.php:10
 * @route '/webhooks/biteship'
 */
BiteshipWebhookController.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: BiteshipWebhookController.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\BiteshipWebhookController::__invoke
 * @see app/Http/Controllers/BiteshipWebhookController.php:10
 * @route '/webhooks/biteship'
 */
    const BiteshipWebhookControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: BiteshipWebhookController.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BiteshipWebhookController::__invoke
 * @see app/Http/Controllers/BiteshipWebhookController.php:10
 * @route '/webhooks/biteship'
 */
        BiteshipWebhookControllerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: BiteshipWebhookController.url(options),
            method: 'post',
        })
    
    BiteshipWebhookController.form = BiteshipWebhookControllerForm
export default BiteshipWebhookController