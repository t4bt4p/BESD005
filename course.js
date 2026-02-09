const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '1234',
    database: 'se_course_db' 
});

db.connect((err) => {
    if (err) {
        console.error('Database connection error: ' + err.stack);
        return;
    }
    console.log('Connected to database as id ' + db.threadId);
});


router.get('/list', (req, res) => {
    db.query('SELECT * FROM online_course', (error, results) => {
        if (error) return res.status(500).send(error);
        res.json(results); 
    });
});

router.get('/search/:id', (req, res) => {
    const courseId = req.params.id;
    db.query('SELECT * FROM online_course WHERE course_id = ?', [courseId], (error, results) => {
        if (error) return res.status(500).send(error);
        res.json(results);
    });
});

router.get('/promote', (req, res) => {
    db.query('SELECT * FROM online_course WHERE promote = 1', (error, results) => {
        if (error) return res.status(500).send(error);
        res.json(results);
    });
});

router.post('/create', (req, res) => {
    console.log("Body check:", req.body);

    const courseBody = req.body;

    if (!courseBody) {
        return res.status(400).json({ msg: "Request body is missing" });
    }
    const sqlText = "INSERT INTO online_course (`course_id`, `title`, `description`, `duration`, `lecturer`, `category`, `promote`, `course_image`) VALUES (?,?,?,?,?,?,?,?)";
    const params = [
        courseBody.courseId,      
        courseBody.title,
        courseBody.description,
        courseBody.duration,
        courseBody.lecturer,
        courseBody.category,
        courseBody.promote,
        courseBody.courseImage
    ];

    db.query(sqlText, params, (err, result) => {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).json({ msg: "Database error", error: err.message });
        }
        res.status(201).json({ msg: 'Insert Complete', data: result });
    });
});

router.put('/update/:id',(req,res)=>{
    const id = req.params.id
    const editBody = req.body
    const sqlText = "Update online_course SET title = ?, description = ?, duration = ?, lecturer = ?, category = ?, promote = ?, course_image = ? WHERE course_id = ?;"
    db.query(sqlText,[editBody.title,editBody.description,editBody.duration,editBody.lecturer,editBody.category,editBody.promote,editBody.courseImage,id],(err,result)=>{
        if(!err){
            if(result.changedRows > 0){
            res.status(200).json({msg:'Edit Complete'})
            }
            else{
                res.status(200).json({msg:'Notting Change'})
            }
        }
        else{
            res.status(500).json({msg:err})
        }
    })
})
router.delete('/delete/:id',(req,res)=>{
    const id = req.params.id
    const sqlText = "Delete From online_course Where course_id = ?";
    db.query(sqlText,[id],(err,result) =>{
        if(!err){
            if(result.affectedRows > 0){
                res.status(200).json({msg: 'Delete Complete'})
            }
            else{
                res.status(404).json({msg: 'Not Found'})
            }
        }
        else{
            res.status(500).json({msg:err})
        }
    })
})

module.exports = router; 