import Api from './Api'
import SitemapController from './SitemapController'
import HomeController from './HomeController'
import ContactController from './ContactController'
import SearchController from './SearchController'
import ProductController from './ProductController'
import CategoryController from './CategoryController'
import CollectionController from './CollectionController'
import CartController from './CartController'
import CheckoutController from './CheckoutController'
import OrderController from './OrderController'
import PaymentController from './PaymentController'
import BiteshipWebhookController from './BiteshipWebhookController'
import TestimonialController from './TestimonialController'
import ProfileController from './ProfileController'
import AccountController from './AccountController'
import WishlistController from './WishlistController'
import Auth from './Auth'
import Admin from './Admin'
const Controllers = {
    Api: Object.assign(Api, Api),
SitemapController: Object.assign(SitemapController, SitemapController),
HomeController: Object.assign(HomeController, HomeController),
ContactController: Object.assign(ContactController, ContactController),
SearchController: Object.assign(SearchController, SearchController),
ProductController: Object.assign(ProductController, ProductController),
CategoryController: Object.assign(CategoryController, CategoryController),
CollectionController: Object.assign(CollectionController, CollectionController),
CartController: Object.assign(CartController, CartController),
CheckoutController: Object.assign(CheckoutController, CheckoutController),
OrderController: Object.assign(OrderController, OrderController),
PaymentController: Object.assign(PaymentController, PaymentController),
BiteshipWebhookController: Object.assign(BiteshipWebhookController, BiteshipWebhookController),
TestimonialController: Object.assign(TestimonialController, TestimonialController),
ProfileController: Object.assign(ProfileController, ProfileController),
AccountController: Object.assign(AccountController, AccountController),
WishlistController: Object.assign(WishlistController, WishlistController),
Auth: Object.assign(Auth, Auth),
Admin: Object.assign(Admin, Admin),
}

export default Controllers