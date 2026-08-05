import CategoryApiController from './CategoryApiController'
import CollectionApiController from './CollectionApiController'
const Api = {
    CategoryApiController: Object.assign(CategoryApiController, CategoryApiController),
CollectionApiController: Object.assign(CollectionApiController, CollectionApiController),
}

export default Api