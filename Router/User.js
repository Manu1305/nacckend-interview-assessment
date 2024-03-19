const express = require('express')
const router = express.Router()
const User = require('../Database/Model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
require('dotenv').config()
router.post("/signup", async (req, res) => {
    console.log(req.body, 'body')
    try {
        const reccievedemail = req.body.email
        console.log('====================================');
        console.log(reccievedemail);
        console.log('====================================');
        const Data = await User.findOne({ email: req.body.email })
        const checkPhone = await User.findOne({ phone: req.body.phone })
        const password = req.body.password
        const salt = bcrypt.genSaltSync(10)
        const hash = await bcrypt.hash(password, salt)


        console.log(Data, 'email')
        console.log(checkPhone, 'phone')
        console.log(typeof checkPhone)
        const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (Data) {
            console.log('email exist ')
            return res.status(409).json({ error: 'email-already-exist' })

        }
        else if (checkPhone) {
            console.log("phone already exist")
            return res.status(409).json({ error: "phone number already exist" })

        }
        else {
            const data = await User.create({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: hash,
                Type: req.body.Type
            })
            await data.save();
            console.log(data, 'its saved data')
            return res.status(200).json({ message: 'success' })

        }

    } catch (error) {
        console.log(error)
    }

})

router.post('/login', async (req, res) => {
    const email = req.body.email

    const password = req.body.password
    try {
        const Data = await User.findOne({ email: email })
        if (!Data) {
            console.log('no email exist')
            return res.status(409).json({ err: 'usernotexists' })
        }

        const checkpassword = await bcrypt.compare(password, Data.password)
        if (checkpassword) {
         
            const token = createToken(Data._id);
            return res.status(200).json({ message: 'success', token })

        }
        else {
            console.log('wrong password')
            return res.status(409).json({ err: 'wrong-password' })

        }
    } catch (error) {
        console.log(error)
    }
})

const createToken = (userId) => {

    const payload = {
        userId: userId,
    };

    const token = jwt.sign(payload, process.env.TOKEN, { expiresIn: "1h" });

    return token;
};



router.get('/allUsers', async (req, res) => {

    try {
        const allUsers = await User.find()
        console.log(allUsers, 'allusers')
        res.status(200).json(allUsers);
    } catch (error) {
        console.log('====================================');
        console.log(error, 'allerroruser');
        console.log('====================================');
    }

})
router.put('/add-absents', async (req, res) => {
    const userId = req.body.userId;
    const date = req.body.date;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.absent.push(req.body.date);
        await user.save();
        console.log('successfully stendacne addede')
        return res.status(200).json({ message: 'Attendance added successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/add-absent/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.absent.push(req.body.absent);
        await user.save();
        return res.status(200).json({ message: 'Absent added successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router