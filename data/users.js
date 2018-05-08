const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const uuid = require("uuid/v4");

const exportedMethods = {
    async getAllUsers() {
        const usersCollection = await users();
        return await usersCollection.find({}).toArray();
    },

    async getUserById(id) {
        if (!id) throw "No User ID provided!";
        const usersCollection = await users();
        const getInfo = await usersCollection.find({id:id}).toArray();
        if(getInfo === 0) throw "No such User in Database!";
        return getInfo;
    },

    async createUser(userinfo){
        const nickname = userinfo.nickname;
        const id = uuid();
        const newuser = {
            id : id,
            username: userinfo.username,
            password: userinfo.password,
            admin: userinfo.admin,
            profile : {
                id: id,
                nickname: nickname,
                favorite:[]
            },
            postlist:[]
        };
        const userCollection = await users();
        const insertInfo = await userCollection.insertOne(newuser);
        if(insertInfo === 0) throw "Can not insert a new user!";
        return this.getUserById(insertInfo.insertedId);
    },

    async updateUser(id,user){
        const userCollection = await users();
        const updateData = {};
        if(user.password){
            updateData.password = user.password;
        }
        if(user.profile.nickname){
            updateData.profile.nickname = user.profile.nickname;
        }
        if(user.profile.favorite){
            updateData.profile.favorite = user.profile.favorite;
        }
        if(user.postlist){
            updateData.postlist = user.postlist;
        }
        const updateInfo = await userCollection.updateOne({id : id},{$set : updateData});
        if(updateInfo === null) throw "Can not update this user!";

        return await this.getUserById(id);
    },

    async removeUser(id){
        if(!id) throw "No User ID provided!";
        const userCollection = await users();
        const deleteInfo = await userCollection.removeOne({id : id});
        if(deleteInfo === 0) throw "Can not delete user by given id!";
    }
};

module.exports = exportedMethods;