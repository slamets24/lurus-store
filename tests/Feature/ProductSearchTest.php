<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Services\EmbeddingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProductSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_hybrid_search_ranks_keyword_and_synonym_matches_first(): void
    {
        Http::fake([
            'https://api-inference.huggingface.co/*' => Http::response('upstream down', 503),
        ]);

        $category = Category::factory()->create(['name' => 'Tops']);

        $blackKnit = $this->product($category, 'STRIERA KNIT GREY BLACK', ['Black'], 'Kaos knit hitam abu untuk daily wear.');
        $blackChino = $this->product($category, 'CHINO PANT BLACK', ['Black'], 'Celana chino hitam.');
        $sandShirt = $this->product($category, 'LINEN CASUAL SHIRT SAND', ['Sand'], 'Kemeja linen warna sand.');

        $keywordIds = Product::keywordSearchIds('kaos hitam');

        $this->assertSame([$blackKnit->id, $blackChino->id], $keywordIds);

        $this->get('/search?q='.urlencode('kaos hitam'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Search')
                ->where('query', 'kaos hitam')
                ->has('products.data', 3)
                ->where('products.data.0.id', $blackKnit->id)
                ->where('products.data.1.id', $blackChino->id)
                ->where('products.data.2.id', $sandShirt->id));
    }

    public function test_search_terms_expand_indonesian_synonyms(): void
    {
        $terms = Product::searchTerms('kaos hitam');

        $this->assertContains('kaos', $terms);
        $this->assertContains('hitam', $terms);
        $this->assertContains('black', $terms);
        $this->assertContains('knit', $terms);
    }

    private function product(Category $category, string $name, array $colors, string $description): Product
    {
        $embeddings = app(EmbeddingService::class);

        return Product::create([
            'category_id' => $category->id,
            'name' => $name,
            'slug' => Str::slug($name).'-'.Str::lower(Str::random(4)),
            'description' => $description,
            'price' => 199000,
            'stock' => 5,
            'sku' => 'SKU-'.Str::upper(Str::random(6)),
            'colors' => $colors,
            'material' => 'Cotton',
            'is_active' => true,
            'embedding' => $embeddings->fallbackEmbedding($name.' '.$description),
        ]);
    }
}
