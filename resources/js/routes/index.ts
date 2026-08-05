import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../wayfinder'
/**
* @see \App\Http\Controllers\SitemapController::sitemap
 * @see app/Http/Controllers/SitemapController.php:11
 * @route '/sitemap.xml'
 */
export const sitemap = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sitemap.url(options),
    method: 'get',
})

sitemap.definition = {
    methods: ["get","head"],
    url: '/sitemap.xml',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SitemapController::sitemap
 * @see app/Http/Controllers/SitemapController.php:11
 * @route '/sitemap.xml'
 */
sitemap.url = (options?: RouteQueryOptions) => {
    return sitemap.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SitemapController::sitemap
 * @see app/Http/Controllers/SitemapController.php:11
 * @route '/sitemap.xml'
 */
sitemap.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sitemap.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SitemapController::sitemap
 * @see app/Http/Controllers/SitemapController.php:11
 * @route '/sitemap.xml'
 */
sitemap.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: sitemap.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SitemapController::sitemap
 * @see app/Http/Controllers/SitemapController.php:11
 * @route '/sitemap.xml'
 */
    const sitemapForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: sitemap.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SitemapController::sitemap
 * @see app/Http/Controllers/SitemapController.php:11
 * @route '/sitemap.xml'
 */
        sitemapForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: sitemap.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SitemapController::sitemap
 * @see app/Http/Controllers/SitemapController.php:11
 * @route '/sitemap.xml'
 */
        sitemapForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: sitemap.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    sitemap.form = sitemapForm
/**
* @see \App\Http\Controllers\SitemapController::robots
 * @see app/Http/Controllers/SitemapController.php:16
 * @route '/robots.txt'
 */
export const robots = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: robots.url(options),
    method: 'get',
})

robots.definition = {
    methods: ["get","head"],
    url: '/robots.txt',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SitemapController::robots
 * @see app/Http/Controllers/SitemapController.php:16
 * @route '/robots.txt'
 */
robots.url = (options?: RouteQueryOptions) => {
    return robots.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SitemapController::robots
 * @see app/Http/Controllers/SitemapController.php:16
 * @route '/robots.txt'
 */
robots.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: robots.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SitemapController::robots
 * @see app/Http/Controllers/SitemapController.php:16
 * @route '/robots.txt'
 */
robots.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: robots.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SitemapController::robots
 * @see app/Http/Controllers/SitemapController.php:16
 * @route '/robots.txt'
 */
    const robotsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: robots.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SitemapController::robots
 * @see app/Http/Controllers/SitemapController.php:16
 * @route '/robots.txt'
 */
        robotsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: robots.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SitemapController::robots
 * @see app/Http/Controllers/SitemapController.php:16
 * @route '/robots.txt'
 */
        robotsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: robots.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    robots.form = robotsForm
/**
* @see \App\Http\Controllers\SitemapController::llms
 * @see app/Http/Controllers/SitemapController.php:35
 * @route '/llms.txt'
 */
export const llms = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: llms.url(options),
    method: 'get',
})

llms.definition = {
    methods: ["get","head"],
    url: '/llms.txt',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SitemapController::llms
 * @see app/Http/Controllers/SitemapController.php:35
 * @route '/llms.txt'
 */
llms.url = (options?: RouteQueryOptions) => {
    return llms.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SitemapController::llms
 * @see app/Http/Controllers/SitemapController.php:35
 * @route '/llms.txt'
 */
llms.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: llms.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SitemapController::llms
 * @see app/Http/Controllers/SitemapController.php:35
 * @route '/llms.txt'
 */
llms.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: llms.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SitemapController::llms
 * @see app/Http/Controllers/SitemapController.php:35
 * @route '/llms.txt'
 */
    const llmsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: llms.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SitemapController::llms
 * @see app/Http/Controllers/SitemapController.php:35
 * @route '/llms.txt'
 */
        llmsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: llms.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SitemapController::llms
 * @see app/Http/Controllers/SitemapController.php:35
 * @route '/llms.txt'
 */
        llmsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: llms.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    llms.form = llmsForm
/**
* @see \App\Http\Controllers\HomeController::__invoke
 * @see app/Http/Controllers/HomeController.php:18
 * @route '/'
 */
export const home = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})

home.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HomeController::__invoke
 * @see app/Http/Controllers/HomeController.php:18
 * @route '/'
 */
home.url = (options?: RouteQueryOptions) => {
    return home.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HomeController::__invoke
 * @see app/Http/Controllers/HomeController.php:18
 * @route '/'
 */
home.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\HomeController::__invoke
 * @see app/Http/Controllers/HomeController.php:18
 * @route '/'
 */
home.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: home.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\HomeController::__invoke
 * @see app/Http/Controllers/HomeController.php:18
 * @route '/'
 */
    const homeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: home.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\HomeController::__invoke
 * @see app/Http/Controllers/HomeController.php:18
 * @route '/'
 */
        homeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: home.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\HomeController::__invoke
 * @see app/Http/Controllers/HomeController.php:18
 * @route '/'
 */
        homeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: home.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    home.form = homeForm
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/about'
 */
export const about = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: about.url(options),
    method: 'get',
})

about.definition = {
    methods: ["get","head"],
    url: '/about',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/about'
 */
about.url = (options?: RouteQueryOptions) => {
    return about.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/about'
 */
about.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: about.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/about'
 */
about.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: about.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/about'
 */
    const aboutForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: about.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/about'
 */
        aboutForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: about.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/about'
 */
        aboutForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: about.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    about.form = aboutForm
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/faq'
 */
export const faq = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: faq.url(options),
    method: 'get',
})

faq.definition = {
    methods: ["get","head"],
    url: '/faq',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/faq'
 */
faq.url = (options?: RouteQueryOptions) => {
    return faq.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/faq'
 */
faq.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: faq.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/faq'
 */
faq.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: faq.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/faq'
 */
    const faqForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: faq.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/faq'
 */
        faqForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: faq.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/faq'
 */
        faqForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: faq.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    faq.form = faqForm
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/new-arrivals'
 */
export const newArrivals = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: newArrivals.url(options),
    method: 'get',
})

newArrivals.definition = {
    methods: ["get","head"],
    url: '/new-arrivals',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/new-arrivals'
 */
newArrivals.url = (options?: RouteQueryOptions) => {
    return newArrivals.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/new-arrivals'
 */
newArrivals.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: newArrivals.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/new-arrivals'
 */
newArrivals.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: newArrivals.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/new-arrivals'
 */
    const newArrivalsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: newArrivals.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/new-arrivals'
 */
        newArrivalsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: newArrivals.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/new-arrivals'
 */
        newArrivalsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: newArrivals.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    newArrivals.form = newArrivalsForm
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/best-sellers'
 */
export const bestSellers = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bestSellers.url(options),
    method: 'get',
})

bestSellers.definition = {
    methods: ["get","head"],
    url: '/best-sellers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/best-sellers'
 */
bestSellers.url = (options?: RouteQueryOptions) => {
    return bestSellers.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/best-sellers'
 */
bestSellers.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bestSellers.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/best-sellers'
 */
bestSellers.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: bestSellers.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/best-sellers'
 */
    const bestSellersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: bestSellers.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/best-sellers'
 */
        bestSellersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: bestSellers.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/best-sellers'
 */
        bestSellersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: bestSellers.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    bestSellers.form = bestSellersForm
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/special-offers'
 */
export const specialOffers = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: specialOffers.url(options),
    method: 'get',
})

specialOffers.definition = {
    methods: ["get","head"],
    url: '/special-offers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/special-offers'
 */
specialOffers.url = (options?: RouteQueryOptions) => {
    return specialOffers.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/special-offers'
 */
specialOffers.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: specialOffers.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/special-offers'
 */
specialOffers.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: specialOffers.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/special-offers'
 */
    const specialOffersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: specialOffers.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/special-offers'
 */
        specialOffersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: specialOffers.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/special-offers'
 */
        specialOffersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: specialOffers.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    specialOffers.form = specialOffersForm
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/order-tracking'
 */
export const orderTracking = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: orderTracking.url(options),
    method: 'get',
})

orderTracking.definition = {
    methods: ["get","head"],
    url: '/order-tracking',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/order-tracking'
 */
orderTracking.url = (options?: RouteQueryOptions) => {
    return orderTracking.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/order-tracking'
 */
orderTracking.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: orderTracking.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/order-tracking'
 */
orderTracking.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: orderTracking.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/order-tracking'
 */
    const orderTrackingForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: orderTracking.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/order-tracking'
 */
        orderTrackingForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: orderTracking.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/order-tracking'
 */
        orderTrackingForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: orderTracking.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    orderTracking.form = orderTrackingForm
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/size-guide'
 */
export const sizeGuide = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sizeGuide.url(options),
    method: 'get',
})

sizeGuide.definition = {
    methods: ["get","head"],
    url: '/size-guide',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/size-guide'
 */
sizeGuide.url = (options?: RouteQueryOptions) => {
    return sizeGuide.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/size-guide'
 */
sizeGuide.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sizeGuide.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/size-guide'
 */
sizeGuide.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: sizeGuide.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/size-guide'
 */
    const sizeGuideForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: sizeGuide.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/size-guide'
 */
        sizeGuideForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: sizeGuide.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/size-guide'
 */
        sizeGuideForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: sizeGuide.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    sizeGuide.form = sizeGuideForm
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/shipping-returns'
 */
export const shippingReturns = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: shippingReturns.url(options),
    method: 'get',
})

shippingReturns.definition = {
    methods: ["get","head"],
    url: '/shipping-returns',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/shipping-returns'
 */
shippingReturns.url = (options?: RouteQueryOptions) => {
    return shippingReturns.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/shipping-returns'
 */
shippingReturns.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: shippingReturns.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/shipping-returns'
 */
shippingReturns.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: shippingReturns.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/shipping-returns'
 */
    const shippingReturnsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: shippingReturns.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/shipping-returns'
 */
        shippingReturnsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: shippingReturns.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/shipping-returns'
 */
        shippingReturnsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: shippingReturns.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    shippingReturns.form = shippingReturnsForm
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/privacy-policy'
 */
export const privacyPolicy = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: privacyPolicy.url(options),
    method: 'get',
})

privacyPolicy.definition = {
    methods: ["get","head"],
    url: '/privacy-policy',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/privacy-policy'
 */
privacyPolicy.url = (options?: RouteQueryOptions) => {
    return privacyPolicy.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/privacy-policy'
 */
privacyPolicy.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: privacyPolicy.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/privacy-policy'
 */
privacyPolicy.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: privacyPolicy.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/privacy-policy'
 */
    const privacyPolicyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: privacyPolicy.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/privacy-policy'
 */
        privacyPolicyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: privacyPolicy.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/privacy-policy'
 */
        privacyPolicyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: privacyPolicy.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    privacyPolicy.form = privacyPolicyForm
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/terms-of-service'
 */
export const termsOfService = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: termsOfService.url(options),
    method: 'get',
})

termsOfService.definition = {
    methods: ["get","head"],
    url: '/terms-of-service',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/terms-of-service'
 */
termsOfService.url = (options?: RouteQueryOptions) => {
    return termsOfService.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/terms-of-service'
 */
termsOfService.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: termsOfService.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/terms-of-service'
 */
termsOfService.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: termsOfService.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/terms-of-service'
 */
    const termsOfServiceForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: termsOfService.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/terms-of-service'
 */
        termsOfServiceForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: termsOfService.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/terms-of-service'
 */
        termsOfServiceForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: termsOfService.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    termsOfService.form = termsOfServiceForm
/**
* @see \App\Http\Controllers\SearchController::__invoke
 * @see app/Http/Controllers/SearchController.php:11
 * @route '/search'
 */
export const search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SearchController::__invoke
 * @see app/Http/Controllers/SearchController.php:11
 * @route '/search'
 */
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SearchController::__invoke
 * @see app/Http/Controllers/SearchController.php:11
 * @route '/search'
 */
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SearchController::__invoke
 * @see app/Http/Controllers/SearchController.php:11
 * @route '/search'
 */
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SearchController::__invoke
 * @see app/Http/Controllers/SearchController.php:11
 * @route '/search'
 */
    const searchForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: search.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SearchController::__invoke
 * @see app/Http/Controllers/SearchController.php:11
 * @route '/search'
 */
        searchForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: search.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SearchController::__invoke
 * @see app/Http/Controllers/SearchController.php:11
 * @route '/search'
 */
        searchForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: search.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    search.form = searchForm
/**
* @see \App\Http\Controllers\ProfileController::account
 * @see app/Http/Controllers/ProfileController.php:14
 * @route '/account'
 */
export const account = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: account.url(options),
    method: 'get',
})

account.definition = {
    methods: ["get","head"],
    url: '/account',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProfileController::account
 * @see app/Http/Controllers/ProfileController.php:14
 * @route '/account'
 */
account.url = (options?: RouteQueryOptions) => {
    return account.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProfileController::account
 * @see app/Http/Controllers/ProfileController.php:14
 * @route '/account'
 */
account.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: account.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProfileController::account
 * @see app/Http/Controllers/ProfileController.php:14
 * @route '/account'
 */
account.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: account.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProfileController::account
 * @see app/Http/Controllers/ProfileController.php:14
 * @route '/account'
 */
    const accountForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: account.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProfileController::account
 * @see app/Http/Controllers/ProfileController.php:14
 * @route '/account'
 */
        accountForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: account.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProfileController::account
 * @see app/Http/Controllers/ProfileController.php:14
 * @route '/account'
 */
        accountForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: account.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    account.form = accountForm
/**
* @see \App\Http\Controllers\Auth\LoginController::login
 * @see app/Http/Controllers/Auth/LoginController.php:17
 * @route '/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head"],
    url: '/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\LoginController::login
 * @see app/Http/Controllers/Auth/LoginController.php:17
 * @route '/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\LoginController::login
 * @see app/Http/Controllers/Auth/LoginController.php:17
 * @route '/login'
 */
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\LoginController::login
 * @see app/Http/Controllers/Auth/LoginController.php:17
 * @route '/login'
 */
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Auth\LoginController::login
 * @see app/Http/Controllers/Auth/LoginController.php:17
 * @route '/login'
 */
    const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: login.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Auth\LoginController::login
 * @see app/Http/Controllers/Auth/LoginController.php:17
 * @route '/login'
 */
        loginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Auth\LoginController::login
 * @see app/Http/Controllers/Auth/LoginController.php:17
 * @route '/login'
 */
        loginForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    login.form = loginForm
/**
* @see \App\Http\Controllers\Auth\RegisterController::register
 * @see app/Http/Controllers/Auth/RegisterController.php:20
 * @route '/register'
 */
export const register = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

register.definition = {
    methods: ["get","head"],
    url: '/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\RegisterController::register
 * @see app/Http/Controllers/Auth/RegisterController.php:20
 * @route '/register'
 */
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\RegisterController::register
 * @see app/Http/Controllers/Auth/RegisterController.php:20
 * @route '/register'
 */
register.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\RegisterController::register
 * @see app/Http/Controllers/Auth/RegisterController.php:20
 * @route '/register'
 */
register.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: register.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Auth\RegisterController::register
 * @see app/Http/Controllers/Auth/RegisterController.php:20
 * @route '/register'
 */
    const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: register.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Auth\RegisterController::register
 * @see app/Http/Controllers/Auth/RegisterController.php:20
 * @route '/register'
 */
        registerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Auth\RegisterController::register
 * @see app/Http/Controllers/Auth/RegisterController.php:20
 * @route '/register'
 */
        registerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    register.form = registerForm
/**
* @see \App\Http\Controllers\Auth\LoginController::logout
 * @see app/Http/Controllers/Auth/LoginController.php:74
 * @route '/logout'
 */
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\LoginController::logout
 * @see app/Http/Controllers/Auth/LoginController.php:74
 * @route '/logout'
 */
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\LoginController::logout
 * @see app/Http/Controllers/Auth/LoginController.php:74
 * @route '/logout'
 */
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Auth\LoginController::logout
 * @see app/Http/Controllers/Auth/LoginController.php:74
 * @route '/logout'
 */
    const logoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: logout.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Auth\LoginController::logout
 * @see app/Http/Controllers/Auth/LoginController.php:74
 * @route '/logout'
 */
        logoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: logout.url(options),
            method: 'post',
        })
    
    logout.form = logoutForm