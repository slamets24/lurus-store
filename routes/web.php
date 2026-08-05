<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\Admin\AdminCartController;
use App\Http\Controllers\Admin\AdminCategoryController;
use App\Http\Controllers\Admin\AdminCollectionController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminHomepageController;
use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Admin\AdminProductController;
use App\Http\Controllers\Admin\AdminPromoController;
use App\Http\Controllers\Admin\AdminRestoreController;
use App\Http\Controllers\Admin\AdminStoreSettingsController;
use App\Http\Controllers\Admin\AdminTestimonialController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Auth\EmailOtpController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\BiteshipWebhookController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\CollectionController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\TestimonialController;
use App\Http\Controllers\WishlistController;
use Illuminate\Support\Facades\Route;

Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');
Route::get('/robots.txt', [SitemapController::class, 'robots'])->name('robots');
Route::get('/llms.txt', [SitemapController::class, 'llms'])->name('llms');

Route::get('/', HomeController::class)->name('home');
Route::inertia('/about', 'About')->name('about');
Route::inertia('/faq', 'Faq')->name('faq');
Route::inertia('/new-arrivals', 'NewArrivals')->name('new-arrivals');
Route::inertia('/best-sellers', 'BestSellers')->name('best-sellers');
Route::inertia('/special-offers', 'SpecialOffers')->name('special-offers');
Route::inertia('/order-tracking', 'OrderTracking')->name('order-tracking');
Route::inertia('/size-guide', 'SizeGuide')->name('size-guide');
Route::inertia('/shipping-returns', 'ShippingReturns')->name('shipping-returns');
Route::inertia('/privacy-policy', 'PrivacyPolicy')->name('privacy-policy');
Route::inertia('/terms-of-service', 'TermsOfService')->name('terms-of-service');
Route::get('/contact', [ContactController::class, 'index'])->name('contact.index');
Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:5,1')->name('contact.store');
Route::get('/search', SearchController::class)->name('search');

Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{slug}', [ProductController::class, 'show'])->name('products.show');
Route::get('/api/products/featured', [ProductController::class, 'featured'])->name('products.featured');
Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
Route::get('/categories/{slug}', [CategoryController::class, 'show'])->name('categories.show');
Route::get('/collections', [CollectionController::class, 'index'])->name('collections.index');
Route::get('/collections/{slug}', [CollectionController::class, 'show'])->name('collections.show');

Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart', [CartController::class, 'add'])->name('cart.add');
Route::patch('/cart/{cartItem}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{cartItem}', [CartController::class, 'remove'])->name('cart.remove');
Route::delete('/cart', [CartController::class, 'clear'])->name('cart.clear');

Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
Route::get('/checkout/areas', [CheckoutController::class, 'searchAreas'])->name('checkout.areas');
Route::get('/checkout/wilayah/cities', [CheckoutController::class, 'wilayahCities'])->name('checkout.wilayah.cities');
Route::get('/checkout/wilayah/districts', [CheckoutController::class, 'wilayahDistricts'])->name('checkout.wilayah.districts');
Route::post('/checkout/shipping-rates', [CheckoutController::class, 'shippingRates'])->name('checkout.shipping-rates');
Route::post('/checkout', [CheckoutController::class, 'store'])->middleware('throttle:10,1')->name('checkout.store');

Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
Route::get('/orders/{order}/success', [OrderController::class, 'success'])->name('orders.success');
Route::post('/orders/{order}/midtrans', [PaymentController::class, 'midtrans'])->name('orders.midtrans');
Route::post('/orders/{order}/payment-proof', [PaymentController::class, 'proof'])->name('orders.payment-proof');
Route::post('/payments/midtrans/notification', [PaymentController::class, 'notification'])->name('payments.midtrans.notification');
Route::post('/webhooks/biteship', BiteshipWebhookController::class)->name('webhooks.biteship');

Route::get('/testimonials/{token}', [TestimonialController::class, 'create'])->name('testimonials.create');
Route::post('/testimonials/{token}', [TestimonialController::class, 'store'])->name('testimonials.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/account', [ProfileController::class, 'edit'])->name('account');
    Route::put('/account', [ProfileController::class, 'update'])->name('account.update');
    Route::patch('/account/password', [AccountController::class, 'updatePassword'])->name('account.password.update');
    Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.index');
    Route::post('/wishlist', [WishlistController::class, 'store'])->name('wishlist.store');
    Route::delete('/wishlist/{wishlistItem}', [WishlistController::class, 'destroy'])->name('wishlist.destroy');
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
});

Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store'])->middleware('throttle:10,1');
    Route::get('/register', [RegisterController::class, 'create'])->name('register');
    Route::post('/register', [RegisterController::class, 'store'])->middleware('throttle:5,1');
    Route::get('/forgot-password', [PasswordResetController::class, 'create'])->name('password.request');
    Route::post('/forgot-password', [PasswordResetController::class, 'store'])->middleware('throttle:5,1')->name('password.email');
    Route::get('/reset-password/{token}', [PasswordResetController::class, 'edit'])->name('password.reset');
    Route::post('/reset-password', [PasswordResetController::class, 'update'])->middleware('throttle:5,1')->name('password.update');
});

Route::middleware('auth')->group(function () {
    Route::get('/email/verify', [EmailOtpController::class, 'show'])->name('verification.notice');
    Route::post('/email/verify', [EmailOtpController::class, 'verify'])->middleware('throttle:10,1')->name('verification.verify');
    Route::post('/email/verification-notification', [EmailOtpController::class, 'resend'])->middleware('throttle:5,1')->name('verification.send');
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');
});

Route::prefix('admin')->name('admin.')->middleware(['auth', 'admin'])->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('/homepage', [AdminHomepageController::class, 'index'])->name('homepage.index');
    Route::post('/homepage', [AdminHomepageController::class, 'update'])->name('homepage.update');
    Route::get('/settings', [AdminStoreSettingsController::class, 'index'])->name('settings.index');
    Route::post('/settings', [AdminStoreSettingsController::class, 'update'])->name('settings.update');

    Route::get('/products', [AdminProductController::class, 'index'])->name('products.index');
    Route::get('/products/create', [AdminProductController::class, 'create'])->name('products.create');
    Route::post('/products', [AdminProductController::class, 'store'])->name('products.store');
    Route::get('/products/{product}/edit', [AdminProductController::class, 'edit'])->name('products.edit');
    Route::put('/products/{product}', [AdminProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{product}', [AdminProductController::class, 'destroy'])->middleware('super-admin')->name('products.destroy');
    Route::delete('/products/images/{image}', [AdminProductController::class, 'deleteImage'])->middleware('super-admin')->name('products.images.destroy');

    Route::get('/categories', [AdminCategoryController::class, 'index'])->name('categories.index');
    Route::get('/categories/create', [AdminCategoryController::class, 'create'])->name('categories.create');
    Route::post('/categories', [AdminCategoryController::class, 'store'])->name('categories.store');
    Route::get('/categories/{category}/edit', [AdminCategoryController::class, 'edit'])->name('categories.edit');
    Route::put('/categories/{category}', [AdminCategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [AdminCategoryController::class, 'destroy'])->middleware('super-admin')->name('categories.destroy');

    Route::get('/promos', [AdminPromoController::class, 'index'])->name('promos.index');
    Route::get('/promos/create', [AdminPromoController::class, 'create'])->name('promos.create');
    Route::post('/promos', [AdminPromoController::class, 'store'])->name('promos.store');
    Route::get('/promos/{promo}/edit', [AdminPromoController::class, 'edit'])->name('promos.edit');
    Route::put('/promos/{promo}', [AdminPromoController::class, 'update'])->name('promos.update');
    Route::delete('/promos/{promo}', [AdminPromoController::class, 'destroy'])->middleware('super-admin')->name('promos.destroy');

    Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [AdminOrderController::class, 'show'])->name('orders.show');
    Route::patch('/orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.status');
    Route::get('/orders/{order}/payment-proof', [AdminOrderController::class, 'proof'])->name('orders.payment-proof');
    Route::patch('/orders/{order}/payment/approve', [AdminOrderController::class, 'approvePayment'])->name('orders.payment.approve');
    Route::patch('/orders/{order}/payment/reject', [AdminOrderController::class, 'rejectPayment'])->name('orders.payment.reject');
    Route::post('/orders/{order}/biteship-shipment', [AdminOrderController::class, 'createBiteshipShipment'])->name('orders.biteship-shipment');
    Route::patch('/orders/{order}/waybill', [AdminOrderController::class, 'updateWaybill'])->name('orders.waybill');
    Route::get('/orders/{order}/shipping-label', [AdminOrderController::class, 'shippingLabel'])->name('orders.shipping-label');
    Route::post('/orders/{order}/testimonial-reminder', [AdminOrderController::class, 'testimonialReminder'])->name('orders.testimonial-reminder');
    Route::delete('/orders/{order}', [AdminOrderController::class, 'destroy'])->middleware('super-admin')->name('orders.destroy');

    Route::patch('/testimonials/{testimonial}/approve', [AdminTestimonialController::class, 'approve'])->name('testimonials.approve');
    Route::delete('/testimonials/{testimonial}', [AdminTestimonialController::class, 'reject'])->middleware('super-admin')->name('testimonials.reject');

    Route::get('/carts', [AdminCartController::class, 'index'])->name('carts.index');
    Route::delete('/carts/{cartItem}', [AdminCartController::class, 'destroy'])->middleware('super-admin')->name('carts.destroy');

    Route::get('/collections', [AdminCollectionController::class, 'index'])->name('collections.index');
    Route::get('/collections/create', [AdminCollectionController::class, 'create'])->name('collections.create');
    Route::post('/collections', [AdminCollectionController::class, 'store'])->name('collections.store');
    Route::get('/collections/{collection}/edit', [AdminCollectionController::class, 'edit'])->name('collections.edit');
    Route::put('/collections/{collection}', [AdminCollectionController::class, 'update'])->name('collections.update');
    Route::delete('/collections/{collection}', [AdminCollectionController::class, 'destroy'])->middleware('super-admin')->name('collections.destroy');

    Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [AdminUserController::class, 'create'])->name('users.create');
    Route::post('/users', [AdminUserController::class, 'store'])->name('users.store');
    Route::patch('/users/{user}/password', [AdminUserController::class, 'updatePassword'])->name('users.password.update');

    Route::middleware('super-admin')->group(function () {
        Route::get('/restore', [AdminRestoreController::class, 'index'])->name('restore.index');
        Route::post('/restore/{type}/{id}', [AdminRestoreController::class, 'restore'])->name('restore.store');
        Route::delete('/restore/{type}/{id}', [AdminRestoreController::class, 'destroy'])->name('restore.destroy');
    });
});
