import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import homepage from './homepage'
import settings from './settings'
import products from './products'
import categories from './categories'
import promos from './promos'
import orders from './orders'
import testimonials from './testimonials'
import carts from './carts'
import collections from './collections'
import users from './users'
import restore from './restore'
/**
* @see \App\Http\Controllers\Admin\AdminDashboardController::dashboard
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:22
 * @route '/admin'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/admin',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminDashboardController::dashboard
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:22
 * @route '/admin'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminDashboardController::dashboard
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:22
 * @route '/admin'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminDashboardController::dashboard
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:22
 * @route '/admin'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminDashboardController::dashboard
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:22
 * @route '/admin'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminDashboardController::dashboard
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:22
 * @route '/admin'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminDashboardController::dashboard
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:22
 * @route '/admin'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
const admin = {
    dashboard: Object.assign(dashboard, dashboard),
homepage: Object.assign(homepage, homepage),
settings: Object.assign(settings, settings),
products: Object.assign(products, products),
categories: Object.assign(categories, categories),
promos: Object.assign(promos, promos),
orders: Object.assign(orders, orders),
testimonials: Object.assign(testimonials, testimonials),
carts: Object.assign(carts, carts),
collections: Object.assign(collections, collections),
users: Object.assign(users, users),
restore: Object.assign(restore, restore),
}

export default admin