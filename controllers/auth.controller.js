const { ObjectId } = require('mongodb');
const { generateJWT } = require('../helpers/jwt');
const bcrypt = require('bcryptjs');
const { getDB } = require('../db/dbConnection');

const collectionName = 'users';

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = getDB().collection(collectionName);

    const userDB = await user.findOne({ email });

    if (!userDB) {
      return res.status(404).json({
        ok: false,
        message: `The user with email ${email} was not found.`,
      });
    }

    const validPassword = bcrypt.compareSync(password, userDB.password);

    if (!validPassword) {
      return res.status(404).json({
        ok: false,
        message: 'The user or password is incorrect.',
      });
    }

    const token = await generateJWT(userDB);

    res.json({
      ok: true,
      user: {
        id: userDB._id,
        name: userDB.name,
        lastName: userDB.lastName,
        email: userDB.email,
        role: userDB.role,        
      },
      token
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      ok: false,
      message: 'There was an unexpected error.',
    });
  }
};

const renewToken = async (req, res) => {
    try{
        const id = req.token._id;
        const user = getDB().collection(collectionName);

        const userDB = await user.findOne({
            _id: ObjectId(id)
        });

        if(!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'User invalid'
            });
        }

        const token = await generateJWT(userDB);

        res.json({
            ok: true,
            token
        });
    }catch(err){
        console.error(err);

        res.status(500).json({
            ok: false,
            msg: 'There was an error'
        });
    }
}

module.exports = {
    login,
    renewToken
}