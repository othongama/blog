import { Request, Response } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import type { ApiResponse } from '../types';

// Configuração do multer para upload
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não suportado. Use JPEG, PNG ou WebP.'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Upload e compressão de imagem
export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Nenhuma imagem foi enviada',
      } as ApiResponse);
    }

    // Criar diretório de uploads se não existir
    const uploadsDir = path.join(__dirname, '../../uploads/images');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Gerar nome único para o arquivo
    const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;
    const filepath = path.join(uploadsDir, filename);

    // Processar e comprimir imagem
    await sharp(req.file.buffer)
      .resize(1200, null, { // Largura máxima de 1200px, altura proporcional
        withoutEnlargement: true,
        fit: 'inside',
      })
      .webp({ quality: 85 }) // Converter para WebP com qualidade 85
      .toFile(filepath);

    // URL da imagem
    const imageUrl = `/uploads/images/${filename}`;

    res.json({
      success: true,
      data: { url: imageUrl },
      message: 'Imagem enviada com sucesso',
    } as ApiResponse<{ url: string }>);
  } catch (error: any) {
    console.error('Error uploading image:', error);

    if (error.message.includes('Tipo de arquivo')) {
      return res.status(400).json({
        success: false,
        error: error.message,
      } as ApiResponse);
    }

    res.status(500).json({
      success: false,
      error: 'Erro ao fazer upload da imagem',
    } as ApiResponse);
  }
};

// Deletar imagem
export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    const filepath = path.join(__dirname, '../../uploads/images', filename);

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({
        success: false,
        error: 'Imagem não encontrada',
      } as ApiResponse);
    }

    fs.unlinkSync(filepath);

    res.json({
      success: true,
      message: 'Imagem deletada com sucesso',
    } as ApiResponse);
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar imagem',
    } as ApiResponse);
  }
};
