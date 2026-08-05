import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/about'
 */
const Controller535fd093ca1d5254af5dc12ac208e8d5 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller535fd093ca1d5254af5dc12ac208e8d5.url(options),
    method: 'get',
})

Controller535fd093ca1d5254af5dc12ac208e8d5.definition = {
    methods: ["get","head"],
    url: '/about',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/about'
 */
Controller535fd093ca1d5254af5dc12ac208e8d5.url = (options?: RouteQueryOptions) => {
    return Controller535fd093ca1d5254af5dc12ac208e8d5.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/about'
 */
Controller535fd093ca1d5254af5dc12ac208e8d5.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller535fd093ca1d5254af5dc12ac208e8d5.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/about'
 */
Controller535fd093ca1d5254af5dc12ac208e8d5.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller535fd093ca1d5254af5dc12ac208e8d5.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/about'
 */
    const Controller535fd093ca1d5254af5dc12ac208e8d5Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controller535fd093ca1d5254af5dc12ac208e8d5.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/about'
 */
        Controller535fd093ca1d5254af5dc12ac208e8d5Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller535fd093ca1d5254af5dc12ac208e8d5.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/about'
 */
        Controller535fd093ca1d5254af5dc12ac208e8d5Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller535fd093ca1d5254af5dc12ac208e8d5.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controller535fd093ca1d5254af5dc12ac208e8d5.form = Controller535fd093ca1d5254af5dc12ac208e8d5Form
    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/faq'
 */
const Controller92f1f176050b935721bc0098427f55ed = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller92f1f176050b935721bc0098427f55ed.url(options),
    method: 'get',
})

Controller92f1f176050b935721bc0098427f55ed.definition = {
    methods: ["get","head"],
    url: '/faq',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/faq'
 */
Controller92f1f176050b935721bc0098427f55ed.url = (options?: RouteQueryOptions) => {
    return Controller92f1f176050b935721bc0098427f55ed.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/faq'
 */
Controller92f1f176050b935721bc0098427f55ed.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller92f1f176050b935721bc0098427f55ed.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/faq'
 */
Controller92f1f176050b935721bc0098427f55ed.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller92f1f176050b935721bc0098427f55ed.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/faq'
 */
    const Controller92f1f176050b935721bc0098427f55edForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controller92f1f176050b935721bc0098427f55ed.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/faq'
 */
        Controller92f1f176050b935721bc0098427f55edForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller92f1f176050b935721bc0098427f55ed.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/faq'
 */
        Controller92f1f176050b935721bc0098427f55edForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller92f1f176050b935721bc0098427f55ed.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controller92f1f176050b935721bc0098427f55ed.form = Controller92f1f176050b935721bc0098427f55edForm
    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/new-arrivals'
 */
const Controller7b87bb3b701121dd2b59b9ac8ff204a9 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller7b87bb3b701121dd2b59b9ac8ff204a9.url(options),
    method: 'get',
})

Controller7b87bb3b701121dd2b59b9ac8ff204a9.definition = {
    methods: ["get","head"],
    url: '/new-arrivals',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/new-arrivals'
 */
Controller7b87bb3b701121dd2b59b9ac8ff204a9.url = (options?: RouteQueryOptions) => {
    return Controller7b87bb3b701121dd2b59b9ac8ff204a9.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/new-arrivals'
 */
Controller7b87bb3b701121dd2b59b9ac8ff204a9.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller7b87bb3b701121dd2b59b9ac8ff204a9.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/new-arrivals'
 */
Controller7b87bb3b701121dd2b59b9ac8ff204a9.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller7b87bb3b701121dd2b59b9ac8ff204a9.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/new-arrivals'
 */
    const Controller7b87bb3b701121dd2b59b9ac8ff204a9Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controller7b87bb3b701121dd2b59b9ac8ff204a9.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/new-arrivals'
 */
        Controller7b87bb3b701121dd2b59b9ac8ff204a9Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller7b87bb3b701121dd2b59b9ac8ff204a9.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/new-arrivals'
 */
        Controller7b87bb3b701121dd2b59b9ac8ff204a9Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller7b87bb3b701121dd2b59b9ac8ff204a9.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controller7b87bb3b701121dd2b59b9ac8ff204a9.form = Controller7b87bb3b701121dd2b59b9ac8ff204a9Form
    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/best-sellers'
 */
const Controller2c00fde1dda1c47b3af588548332b4d8 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller2c00fde1dda1c47b3af588548332b4d8.url(options),
    method: 'get',
})

Controller2c00fde1dda1c47b3af588548332b4d8.definition = {
    methods: ["get","head"],
    url: '/best-sellers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/best-sellers'
 */
Controller2c00fde1dda1c47b3af588548332b4d8.url = (options?: RouteQueryOptions) => {
    return Controller2c00fde1dda1c47b3af588548332b4d8.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/best-sellers'
 */
Controller2c00fde1dda1c47b3af588548332b4d8.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller2c00fde1dda1c47b3af588548332b4d8.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/best-sellers'
 */
Controller2c00fde1dda1c47b3af588548332b4d8.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller2c00fde1dda1c47b3af588548332b4d8.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/best-sellers'
 */
    const Controller2c00fde1dda1c47b3af588548332b4d8Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controller2c00fde1dda1c47b3af588548332b4d8.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/best-sellers'
 */
        Controller2c00fde1dda1c47b3af588548332b4d8Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller2c00fde1dda1c47b3af588548332b4d8.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/best-sellers'
 */
        Controller2c00fde1dda1c47b3af588548332b4d8Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller2c00fde1dda1c47b3af588548332b4d8.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controller2c00fde1dda1c47b3af588548332b4d8.form = Controller2c00fde1dda1c47b3af588548332b4d8Form
    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/special-offers'
 */
const Controller2996947fc9942312d71c20fe8f004675 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller2996947fc9942312d71c20fe8f004675.url(options),
    method: 'get',
})

Controller2996947fc9942312d71c20fe8f004675.definition = {
    methods: ["get","head"],
    url: '/special-offers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/special-offers'
 */
Controller2996947fc9942312d71c20fe8f004675.url = (options?: RouteQueryOptions) => {
    return Controller2996947fc9942312d71c20fe8f004675.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/special-offers'
 */
Controller2996947fc9942312d71c20fe8f004675.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller2996947fc9942312d71c20fe8f004675.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/special-offers'
 */
Controller2996947fc9942312d71c20fe8f004675.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller2996947fc9942312d71c20fe8f004675.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/special-offers'
 */
    const Controller2996947fc9942312d71c20fe8f004675Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controller2996947fc9942312d71c20fe8f004675.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/special-offers'
 */
        Controller2996947fc9942312d71c20fe8f004675Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller2996947fc9942312d71c20fe8f004675.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/special-offers'
 */
        Controller2996947fc9942312d71c20fe8f004675Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller2996947fc9942312d71c20fe8f004675.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controller2996947fc9942312d71c20fe8f004675.form = Controller2996947fc9942312d71c20fe8f004675Form
    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/order-tracking'
 */
const Controller4ba24de143cf88075316cc33ce21dd6a = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller4ba24de143cf88075316cc33ce21dd6a.url(options),
    method: 'get',
})

Controller4ba24de143cf88075316cc33ce21dd6a.definition = {
    methods: ["get","head"],
    url: '/order-tracking',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/order-tracking'
 */
Controller4ba24de143cf88075316cc33ce21dd6a.url = (options?: RouteQueryOptions) => {
    return Controller4ba24de143cf88075316cc33ce21dd6a.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/order-tracking'
 */
Controller4ba24de143cf88075316cc33ce21dd6a.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller4ba24de143cf88075316cc33ce21dd6a.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/order-tracking'
 */
Controller4ba24de143cf88075316cc33ce21dd6a.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller4ba24de143cf88075316cc33ce21dd6a.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/order-tracking'
 */
    const Controller4ba24de143cf88075316cc33ce21dd6aForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controller4ba24de143cf88075316cc33ce21dd6a.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/order-tracking'
 */
        Controller4ba24de143cf88075316cc33ce21dd6aForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller4ba24de143cf88075316cc33ce21dd6a.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/order-tracking'
 */
        Controller4ba24de143cf88075316cc33ce21dd6aForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller4ba24de143cf88075316cc33ce21dd6a.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controller4ba24de143cf88075316cc33ce21dd6a.form = Controller4ba24de143cf88075316cc33ce21dd6aForm
    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/size-guide'
 */
const Controllerde9b04be48bfa2845d30c25784f0eea7 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllerde9b04be48bfa2845d30c25784f0eea7.url(options),
    method: 'get',
})

Controllerde9b04be48bfa2845d30c25784f0eea7.definition = {
    methods: ["get","head"],
    url: '/size-guide',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/size-guide'
 */
Controllerde9b04be48bfa2845d30c25784f0eea7.url = (options?: RouteQueryOptions) => {
    return Controllerde9b04be48bfa2845d30c25784f0eea7.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/size-guide'
 */
Controllerde9b04be48bfa2845d30c25784f0eea7.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllerde9b04be48bfa2845d30c25784f0eea7.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/size-guide'
 */
Controllerde9b04be48bfa2845d30c25784f0eea7.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controllerde9b04be48bfa2845d30c25784f0eea7.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/size-guide'
 */
    const Controllerde9b04be48bfa2845d30c25784f0eea7Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controllerde9b04be48bfa2845d30c25784f0eea7.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/size-guide'
 */
        Controllerde9b04be48bfa2845d30c25784f0eea7Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controllerde9b04be48bfa2845d30c25784f0eea7.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/size-guide'
 */
        Controllerde9b04be48bfa2845d30c25784f0eea7Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controllerde9b04be48bfa2845d30c25784f0eea7.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controllerde9b04be48bfa2845d30c25784f0eea7.form = Controllerde9b04be48bfa2845d30c25784f0eea7Form
    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/shipping-returns'
 */
const Controllerb6d3b768e613fb622a28ae3e1897f5d4 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllerb6d3b768e613fb622a28ae3e1897f5d4.url(options),
    method: 'get',
})

Controllerb6d3b768e613fb622a28ae3e1897f5d4.definition = {
    methods: ["get","head"],
    url: '/shipping-returns',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/shipping-returns'
 */
Controllerb6d3b768e613fb622a28ae3e1897f5d4.url = (options?: RouteQueryOptions) => {
    return Controllerb6d3b768e613fb622a28ae3e1897f5d4.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/shipping-returns'
 */
Controllerb6d3b768e613fb622a28ae3e1897f5d4.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllerb6d3b768e613fb622a28ae3e1897f5d4.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/shipping-returns'
 */
Controllerb6d3b768e613fb622a28ae3e1897f5d4.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controllerb6d3b768e613fb622a28ae3e1897f5d4.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/shipping-returns'
 */
    const Controllerb6d3b768e613fb622a28ae3e1897f5d4Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controllerb6d3b768e613fb622a28ae3e1897f5d4.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/shipping-returns'
 */
        Controllerb6d3b768e613fb622a28ae3e1897f5d4Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controllerb6d3b768e613fb622a28ae3e1897f5d4.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/shipping-returns'
 */
        Controllerb6d3b768e613fb622a28ae3e1897f5d4Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controllerb6d3b768e613fb622a28ae3e1897f5d4.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controllerb6d3b768e613fb622a28ae3e1897f5d4.form = Controllerb6d3b768e613fb622a28ae3e1897f5d4Form
    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/privacy-policy'
 */
const Controller546d1d979582dcab4cda77f98be026ca = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller546d1d979582dcab4cda77f98be026ca.url(options),
    method: 'get',
})

Controller546d1d979582dcab4cda77f98be026ca.definition = {
    methods: ["get","head"],
    url: '/privacy-policy',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/privacy-policy'
 */
Controller546d1d979582dcab4cda77f98be026ca.url = (options?: RouteQueryOptions) => {
    return Controller546d1d979582dcab4cda77f98be026ca.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/privacy-policy'
 */
Controller546d1d979582dcab4cda77f98be026ca.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller546d1d979582dcab4cda77f98be026ca.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/privacy-policy'
 */
Controller546d1d979582dcab4cda77f98be026ca.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller546d1d979582dcab4cda77f98be026ca.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/privacy-policy'
 */
    const Controller546d1d979582dcab4cda77f98be026caForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controller546d1d979582dcab4cda77f98be026ca.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/privacy-policy'
 */
        Controller546d1d979582dcab4cda77f98be026caForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller546d1d979582dcab4cda77f98be026ca.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/privacy-policy'
 */
        Controller546d1d979582dcab4cda77f98be026caForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller546d1d979582dcab4cda77f98be026ca.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controller546d1d979582dcab4cda77f98be026ca.form = Controller546d1d979582dcab4cda77f98be026caForm
    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/terms-of-service'
 */
const Controllerafc93a7f43b9c83b4fdbb5592321e7c9 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllerafc93a7f43b9c83b4fdbb5592321e7c9.url(options),
    method: 'get',
})

Controllerafc93a7f43b9c83b4fdbb5592321e7c9.definition = {
    methods: ["get","head"],
    url: '/terms-of-service',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/terms-of-service'
 */
Controllerafc93a7f43b9c83b4fdbb5592321e7c9.url = (options?: RouteQueryOptions) => {
    return Controllerafc93a7f43b9c83b4fdbb5592321e7c9.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/terms-of-service'
 */
Controllerafc93a7f43b9c83b4fdbb5592321e7c9.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllerafc93a7f43b9c83b4fdbb5592321e7c9.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/terms-of-service'
 */
Controllerafc93a7f43b9c83b4fdbb5592321e7c9.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controllerafc93a7f43b9c83b4fdbb5592321e7c9.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/terms-of-service'
 */
    const Controllerafc93a7f43b9c83b4fdbb5592321e7c9Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controllerafc93a7f43b9c83b4fdbb5592321e7c9.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/terms-of-service'
 */
        Controllerafc93a7f43b9c83b4fdbb5592321e7c9Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controllerafc93a7f43b9c83b4fdbb5592321e7c9.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/terms-of-service'
 */
        Controllerafc93a7f43b9c83b4fdbb5592321e7c9Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controllerafc93a7f43b9c83b4fdbb5592321e7c9.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controllerafc93a7f43b9c83b4fdbb5592321e7c9.form = Controllerafc93a7f43b9c83b4fdbb5592321e7c9Form

const Controller = {
    '/about': Controller535fd093ca1d5254af5dc12ac208e8d5,
    '/faq': Controller92f1f176050b935721bc0098427f55ed,
    '/new-arrivals': Controller7b87bb3b701121dd2b59b9ac8ff204a9,
    '/best-sellers': Controller2c00fde1dda1c47b3af588548332b4d8,
    '/special-offers': Controller2996947fc9942312d71c20fe8f004675,
    '/order-tracking': Controller4ba24de143cf88075316cc33ce21dd6a,
    '/size-guide': Controllerde9b04be48bfa2845d30c25784f0eea7,
    '/shipping-returns': Controllerb6d3b768e613fb622a28ae3e1897f5d4,
    '/privacy-policy': Controller546d1d979582dcab4cda77f98be026ca,
    '/terms-of-service': Controllerafc93a7f43b9c83b4fdbb5592321e7c9,
}

export default Controller