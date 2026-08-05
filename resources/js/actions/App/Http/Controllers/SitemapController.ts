import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SitemapController::index
 * @see app/Http/Controllers/SitemapController.php:11
 * @route '/sitemap.xml'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/sitemap.xml',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SitemapController::index
 * @see app/Http/Controllers/SitemapController.php:11
 * @route '/sitemap.xml'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SitemapController::index
 * @see app/Http/Controllers/SitemapController.php:11
 * @route '/sitemap.xml'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SitemapController::index
 * @see app/Http/Controllers/SitemapController.php:11
 * @route '/sitemap.xml'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SitemapController::index
 * @see app/Http/Controllers/SitemapController.php:11
 * @route '/sitemap.xml'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SitemapController::index
 * @see app/Http/Controllers/SitemapController.php:11
 * @route '/sitemap.xml'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SitemapController::index
 * @see app/Http/Controllers/SitemapController.php:11
 * @route '/sitemap.xml'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
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
const SitemapController = { index, robots, llms }

export default SitemapController