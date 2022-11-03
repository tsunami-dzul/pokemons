const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');
const { getDB } = require('../db/dbConnection');

const collectionName = 'users';

const list = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const user = getDB().collection(collectionName);

        const users = await user.find({},
            { 
                projection: {
                    password: 0
                }
            })
            .limit(limit)
            .skip((page - 1) * limit)
            .toArray();

        const totalDocs = await user.countDocuments();

        res.json({
            ok: true,
            users,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalDocs / limit)
        });
    } catch(err) {
        console.log(err);

        res.status(500).json({
            ok: false,
            message: 'There was an unexpected error'
        });      
    }
}

const getByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const user = getDB().collection(collectionName);

        const userDB = await user.findOne({
            email
        }, {
            projection: {password: 0}
        });

        if(!userDB) {
            return res.status(404).json({
                ok: false,
                message: 'User not found'
            });
        }

        res.json({
            ok: true,
            user: userDB
        });

    } catch(err) {
        console.log(err);

        res.status(500).json({
            ok: false,
            message: 'There was an unexpected error'
        });
    }
}

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = getDB().collection(collectionName);

        const userDB = await user.findOne({
            _id: ObjectId(id)
        },{
            projection: {password: 0}
        });

        if(!userDB) {
            return res.status(404).json({
                ok: false,
                message: 'User not found'
            });
        }

        res.json({
            ok: true,
            user: userDB
        });
    } catch(err) {
        console.log(err);

        res.status(500).json({
            ok: false,
            message: 'There was an unexpected error'
        });
    }
}

const create = async (req, res) => {
    try {
        const { email, name, lastName, role, password } = req.body;
        const user = getDB().collection(collectionName);

        const userDB = await user.findOne({
            email
        });

        if(userDB) {
            return res.status(403).json({
                ok: false,
                message: 'The user already exist'
            });
        }

        let newUser = {
            email,
            name,
            lastName,
            password,
            role
        }

        const salt = bcrypt.genSaltSync();
        newUser.password = bcrypt.hashSync(password, salt);

        await user.insertOne(newUser);

        const userToken = {
            id: user.id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        };
        const token = await generateJWT(userToken);

        res.json({
            ok: true,
            message: 'User was created successfully',
            token
        });
    } catch(err) {
        console.log(err);

        res.status(500).json({
            ok: false,
            message: 'There was an unexpected error'
        });
    }
}

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { ...props } = req.body;
        const user = getDB().collection(collectionName);

        if('password' in props) {
            const salt = bcrypt.genSaltSync();

            props.password = bcrypt.hashSync(props.password, salt);
        }
                
        if(Object.keys(props).length > 0) {
            const userDB = await user.updateOne({
                _id: ObjectId(id)
            },{
                $set: {
                    ...props
                }
            });
    
            if(userDB.matchedCount <= 0) {
                return res.status(404).json({
                    ok: false,
                    message: 'User was not found'
                });
            }
    
            return res.json({
                ok: true,
                message: 'User was updated successfully'
            });
        }

        res.json({
            ok: false,
            message: 'No paramaters were provided'
        });
    } catch(err) {
        console.log(err);

        res.status(500).json({
            ok: false,
            message: 'There was an unexpected error'
        });
    }
}

const remove = async (req, res) => {
    try {
        const { id } = req. params;
        const user = getDB().collection(collectionName);

        const userDB = await user.deleteOne({
            _id: ObjectId(id)
        });

        if(userDB.deletedCount <= 0) {
            return res.status(404).json({
                ok: false,
                message: 'User was not found'
            });
        }

        res.json({
            ok: true,
            message: 'User was deleted successfully'
        });
    } catch(err) {
        console.log(err);

        res.status(500).json({
            ok: false,
            message: 'There was an unexpected error'
        });
    }
}

module.exports = {
    list,
    getByEmail,
    getById,
    create,
    update,
    remove
}