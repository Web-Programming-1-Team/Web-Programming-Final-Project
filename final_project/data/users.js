const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const uuid = require("uuid/v4");

const exportedMethods = {
    async getAllUsers() {
        const usersCollection = await users();
        return await usersCollection.find({}).toArray();
    },
    async getUserByName(username){
        const usersCollection = await users();
        const getInfo = await usersCollection.find({username:username}).toArray();
        if(getInfo === 0) throw "No such User in Database!";
        return getInfo;
    },

    async getUserById(id) {
        if (!id) throw "No User ID provided!";
        const usersCollection = await users();
        const getInfo = await usersCollection.find({_id:id}).toArray();
        if(getInfo === 0) throw "No such User in Database!";
        return getInfo;
    },

    async createUser(userinfo){
        const id = uuid();
        const newuser = {
            _id : id,
            username: userinfo.username,
            password: userinfo.password,
            admin: userinfo.admin,
            profile : {
                _id: id,
                nickname: userinfo.nickname,
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
        const updateInfo = await userCollection.updateOne({_id : id},{$set : updateData});
        if(updateInfo === null) throw "Can not update this user!";

        return await this.getUserById(id);
    },

    async removeUser(id){
        if(!id) throw "No User ID provided!";
        const userCollection = await users();
        const deleteInfo = await userCollection.removeOne({_id : id});
        if(deleteInfo === 0) throw "Can not delete user by given id!";
    }
};

module.exports = exportedMethods;