require('dotenv').config();

const fs = require('fs');
const express = require('express');
const app = express();
const cors = require('cors');
const { Configuration, OpenAIApi } = require("openai");
const multer = require('multer');
const path = require('path');

const upload = multer({ dest: 'uploads/' });
const apiKey = process.env.OPEN_AI_API_KEY;


const configuration = new Configuration({
    apiKey: apiKey,
});

app.use(cors());
app.use(express.json());

const openai = new OpenAIApi(configuration);

app.post('/createTranscript',upload.single('file'), async(req,res)=>
{
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }

        
      let filePath = saveFile(req.file);

     let speech = await createSpeech(filePath);

    return res.status(200).json(speech);

    }
    catch (error) {
        console.log('error while submit ', error);
    }
});

app.post('/submit', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }

        saveFile(req.file);

        // console.log(req.file);
        res.send(req.data);
    }
    catch (error) {
        console.log('error while submit ', error);
    }

});

const saveFile = (fileToSave) =>
{
        // Get the original file extension
        const originalFileName = fileToSave.originalname;
        // const fileExtension = path.extname(originalFileName);

        // Generate a new filename using a timestamp
        const timestamp = Date.now();
        const newFileName = `${timestamp}_${originalFileName}`;

        // Set the new destination and filename
        const newDestination = path.join( __dirname,'/uploads/');
        // console.log(newDestination,newFileName);
        const newFilePath = path.join(newDestination, newFileName);

        // Move the uploaded file to the new location with the new filename
        fs.renameSync(fileToSave.path, newFilePath);

    return newFilePath;
}

const createSpeech = async (filePath) => {
    let resp;
    try {
        resp = await openai.createTranscription(
            fs.createReadStream(filePath),
            "whisper-1"
        );

        CreateTextFile(resp.data.text);

        return resp.data.text;

    } catch (error) 
    {
        console.log('Error While Transcript ::', error)
    }
}


const CreateTextFile = (text) => {
    try {
        if (fs.existsSync('./transScript.text')) {
            text = '\n\n' + text;
            fs.appendFileSync('./transScript.text', text);
            console.log('Append success');
        } else {
            fs.writeFileSync('./transScript.text', text);
        }


    } catch (error) {
        console.log('Error While Creating File', error);
    }
}

app.listen(5500, () => {
    console.log('Server Is Up And Running At 5500');
});