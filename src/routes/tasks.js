const express = require('express');
const router = new express.Router();
const Task = require('../models/task');
const auth = require('../middleware/auth');
const validateTask = require('../middleware/validateTask');
const roleAuth = require('../middleware/roleAuth');
const PDFDocument = require('pdfkit');
const fs = require('fs');



router.post('/tasks', auth, validateTask, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send();
    }
});


router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.search) {
        match.$or = [
            { title: { $regex: req.query.search, $options: 'i' } },
            { description: { $regex: req.query.search, $options: 'i' } }
        ]
    }

    if (req.query.sortBy === 'deadline') {
        sort.deadline = 1  
    }

    try {
        const tasks = await Task.find({ owner: req.user._id, ...match }).sort(sort)
        res.send(tasks)
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })

        if(!task) {
            return res.status(404).send()
        }
        res.send(task)

    } catch(error) {
        res.status(500).send()
    }
});

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed', 'deadline'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send('error: invalid update');
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

        if (!task) {
            return res.status(404).send();
        }

        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();
        res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        let task;

        if (req.user.role === 'admin') {
            task = await Task.findOneAndDelete({ _id: req.params.id });
        } 
        else {
            task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        }

        if (!task) {
            return res.status(404).send();
        }

        res.send(task);
    } catch (error) {
        next(error);
    }
});
router.get('/tasks/report/pdf', auth, async (req, res) => {
    const tasks = await Task.find({ owner: req.user._id });

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream('tasks_report.pdf'));
    doc.fontSize(20).text('Task Report', { align: 'center' });

    tasks.forEach((task, index) => {
        doc.fontSize(14).text(`${index + 1}. ${task.title} - ${task.status}`, { continued: true });
        doc.text(` (Deadline: ${task.deadline})`);
    });

    doc.end();
    res.sendFile(`${__dirname}/tasks_report.pdf`);
});


module.exports = router;