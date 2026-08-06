import { Pagination } from '@/components/Pagination';
import { ProductCard } from '@/components/ProductCard';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import { storageUrl } from '@/lib/utils';
import type { Category, Paginated, ProductCard as ProductCardType } from '@/types';

interface CategoryDetailProps {
    category: Category;
    products: Paginated<ProductCardType & { images?: Array<{ image_path: string }> }>;
}

function toCard(product: CategoryDetailProps['products']['data'][0]): ProductCardType {
    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        discount_percent: product.discount_percent,
        effective_price: product.effective_price,
        image: product.image ?? product.images?.[0]?.image_path,
        hover_image: product.hover_image ?? product.images?.[1]?.image_path,
        is_new: product.is_new,
        stock: product.stock,
    };
}

export default function CategoryDetail({ category, products }: CategoryDetailProps) {
    return (
        <StorefrontLayout>
            <div className="mx-auto max-w-[var(--container-max)] px-4 py-10 md:px-[var(--spacing-margin-desktop)] md:py-16">
                {category.image && (
                    <div className="mb-10 aspect-[21/9] overflow-hidden bg-surface-container">
                        <img src={storageUrl(category.image)} alt={category.name} className="h-full w-full object-cover" />
                    </div>
                )}
                <h1 className="mb-2 font-serif text-4xl tracking-tight">{category.name}</h1>
                {category.description && (
                    <p className="mb-10 max-w-2xl text-sm leading-relaxed text-secondary">{category.description}</p>
                )}

                {products.data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
                            {products.data.map((product) => (
                                <ProductCard key={product.id} product={toCard(product)} />
                            ))}
                        </div>
                        <Pagination pagination={products} className="mt-12" />
                    </>
                ) : (
                    <p className="py-20 text-center text-secondary">No products in this category yet.</p>
                )}
            </div>
        </StorefrontLayout>
    );
}
