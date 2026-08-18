<?php

namespace Tests\Feature;

use App\Models\NewsletterSubscriber;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NewsletterSubscribeTest extends TestCase
{
    use RefreshDatabase;

    public function test_subscribe_is_idempotent(): void
    {
        $this->post('/newsletter', ['email' => 'Ada@Example.com'])
            ->assertRedirect()
            ->assertSessionHas('success');

        $this->post('/newsletter', ['email' => 'ada@example.com'])
            ->assertRedirect()
            ->assertSessionHas('success');

        $this->assertSame(1, NewsletterSubscriber::query()->count());
        $this->assertSame('ada@example.com', NewsletterSubscriber::query()->value('email'));
    }
}
