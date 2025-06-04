import express from 'express';
import multer from 'multer';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

// Configurar CORS para permitir requisições do frontend
app.use(cors({
  origin: 'http://localhost:5173', // URL do frontend Vite
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Configurar o diretório de uploads temporários
const uploadDir = path.join(__dirname, '../../public/temp_saipos_import');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurar o multer para gerenciar uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'uploaded_' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Rota para processar o upload e executar o script Python
app.post('/api/import-saipos', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Nenhum arquivo enviado' });
  }

  const inputFilePath = req.file.path;
  const outputFilePath = path.join(uploadDir, 'processed_' + Date.now() + '.json');
  
  // Caminho absoluto correto para o script Python
  const scriptPath = 'C:\\Users\\Caio Schubert\\Desktop\\Foodash novo\\saipos_import_analysis\\parse_saipos_sales.py';
  
  // Verificar se o arquivo existe antes de executar
  if (!fs.existsSync(scriptPath)) {
    console.error(`Erro: O arquivo do script não existe em: ${scriptPath}`);
    return res.status(500).json({ 
      success: false, 
      message: 'Erro: O arquivo do script Python não foi encontrado', 
      scriptPath: scriptPath
    });
  }
  
  // Detectar sistema operacional para usar o comando Python correto
  const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';
  
  // Executar o script Python
  const command = `${pythonCommand} "${scriptPath}" "${inputFilePath}" "${outputFilePath}"`;
  
  console.log('Executando comando:', command);
  console.log('Caminho do script:', scriptPath);
  console.log('Arquivo existe:', fs.existsSync(scriptPath) ? 'Sim' : 'Não');
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao executar o script: ${error.message}`);
      return res.status(500).json({ 
        success: false, 
        message: 'Erro ao processar o arquivo', 
        error: error.message,
        stderr: stderr,
        command: command,
        scriptPath: scriptPath
      });
    }
    
    if (stderr) {
      console.error(`Erro no script: ${stderr}`);
      return res.status(500).json({ 
        success: false, 
        message: 'Erro no processamento do script Python', 
        error: stderr 
      });
    }
    
    console.log('Saída do script Python:', stdout);
    
    // Ler o arquivo JSON gerado
    fs.readFile(outputFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error(`Erro ao ler o arquivo JSON: ${err.message}`);
        return res.status(500).json({ 
          success: false, 
          message: 'Erro ao ler o arquivo JSON processado', 
          error: err.message 
        });
      }
      
      try {
        const salesData = JSON.parse(data);
        
        // Limpar arquivos temporários após processamento bem-sucedido
        // Comentado para facilitar debug, descomente em produção
        /*
        fs.unlink(inputFilePath, (err) => {
          if (err) console.error(`Erro ao remover arquivo de entrada: ${err.message}`);
        });
        fs.unlink(outputFilePath, (err) => {
          if (err) console.error(`Erro ao remover arquivo de saída: ${err.message}`);
        });
        */
        
        return res.status(200).json({ 
          success: true, 
          message: 'Arquivo processado com sucesso', 
          data: salesData,
          totalRecords: salesData.length
        });
      } catch (parseError) {
        console.error(`Erro ao analisar o JSON: ${parseError.message}`);
        return res.status(500).json({ 
          success: false, 
          message: 'Erro ao analisar o JSON gerado', 
          error: parseError.message 
        });
      }
    });
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor de importação Saipos rodando em http://localhost:${port}`);
});
