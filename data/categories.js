const mongoCollections = require("../config/mongoCollections");
const categories = mongoCollections.categories;
const uuid = require("uuid/v4");

const exportedMethod = {
    async getCategoryById(id){
        if(!id) throw "No category ID provided!";
        const categoryCollection = await categories();
        const getInfo = await categoryCollection.find({_id : id}).toArray();
        if(getInfo === 0) throw "No such category in Database";
        return getInfo;
    },
    async getCategoryByName(name){
        if(!name) throw "No category Name provided!";
        const categoryCollection = await categories();
        const getInfo = await categoryCollection.find({name : name}).toArray();
        if(getInfo === 0) throw "No such category in Database";
        return getInfo;
    },
    async initCategories(category){
        const categoryCollection = await categories();
        const insertInfo = await categoryCollection.insertOne(category);
        if (insertInfo === 0) throw "Can not insert a new category!";
        const inserted_one = await this.getCategoryByName(insertInfo.insertedId);
        return inserted_one;
    },
    async updateCategory(id, category){
        const categoryCollection = await categories();
        const updateInfo = await categoryCollection.updateOne({_id : id}, {$set : category});
        if(updateInfo === null) throw "Can not update this recipe!";
        return await this.getCategoryByName(id);
    },
    async createCategory(category){
        const newCategory = {
            _id : uuid(),
            name : category.name,
            recipes : []
        };
        const categoryCollection = await categories();
        const insertInfo = await categoryCollection.insertOne(newCategory);
        if (insertInfo === 0) throw "Can not insert a new category!";
        const inserted_one = await this.getCategoryByName(insertInfo.insertedId);
        return inserted_one;
    }

};

module.exports = exportedMethod;