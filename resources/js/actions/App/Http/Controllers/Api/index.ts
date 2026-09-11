import CategoryApiController from './CategoryApiController'
import CollectionApiController from './CollectionApiController'
import N8nProductController from './N8nProductController'
const Api = {
    CategoryApiController: Object.assign(CategoryApiController, CategoryApiController),
CollectionApiController: Object.assign(CollectionApiController, CollectionApiController),
N8nProductController: Object.assign(N8nProductController, N8nProductController),
}

export default Api