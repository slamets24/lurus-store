<?php

namespace App\Support;

use App\Models\Category;
use App\Models\Collection;
use App\Models\Product;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

final class StorefrontSitemap
{
    public static function make(): Sitemap
    {
        return Sitemap::create()
            ->add(Url::create(url('/')))
            ->add(Url::create(route('products.index')))
            ->add(Url::create(route('categories.index')))
            ->add(Url::create(route('collections.index')))
            ->add(Url::create(route('about')))
            ->add(Url::create(route('faq')))
            ->add(Url::create(route('contact.index')))
            ->add(Product::query()->where('is_active', true)->get())
            ->add(Category::query()->where('is_active', true)->get())
            ->add(Collection::query()->where('is_active', true)->get());
    }

    public static function path(): string
    {
        return public_path('sitemap.xml');
    }

    public static function write(): void
    {
        self::make()->writeToFile(self::path());
    }
}
