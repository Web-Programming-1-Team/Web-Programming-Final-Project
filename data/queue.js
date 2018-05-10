const mongoCollections = require("../config/mongoCollections");
const queue = mongoCollections.queue;
const uuid = require("uuid/v4");

const exportedMethod = {
    async getQueueById(id){
        if(!id) throw "No queue ID provided!";
        const queueCollection = await queue();
        const getInfo = await queueCollection.find({_id : id}).toArray();
        if(getInfo === 0) throw "No such queue in Database";
        return getInfo;
    },
    async createQueue(queue) {
        const newQueue = {
            _id : uuid(),
            recipe : queue.recipe
        };
        const queueCollection = await queue();
        const insertInfo = await queueCollection.insertOne(newQueue);
        if (insertInfo === 0) throw "Can not insert a new category!";
        const inserted_one = await this.getQueueById(insertInfo.insertedId);
        return inserted_one;
    },
    async deleteQueue(queue) {
        const queueCollection = await queue();
        const deleteInfo = await queueCollection.removeOne({_id : id});
        if(deleteInfo === 0) throw "Can not delete queue by given id!";
    }
};

module.exports = exportedMethod;