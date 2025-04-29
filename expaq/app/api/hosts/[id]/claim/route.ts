import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

async function saveFile(file: File, folder: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Create a unique filename
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
  const filename = `${uniqueSuffix}-${file.name}`;
  const filepath = join(process.cwd(), 'public', folder, filename);
  
  await writeFile(filepath, buffer);
  return `/uploads/${folder}/${filename}`;
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const validationErrors: string[] = [];

    // Validate personal information
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const description = formData.get('description') as string;

    if (!firstName || !lastName || !email || !phone || !description) {
      validationErrors.push('All personal information fields are required');
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      validationErrors.push('Invalid email format');
    }

    if (phone && !/^\+?[\d\s-]{10,}$/.test(phone)) {
      validationErrors.push('Invalid phone number format');
    }

    // Validate and process ID document
    const idDocument = formData.get('idDocument') as File;
    if (!idDocument) {
      validationErrors.push('ID document is required');
    } else if (!ALLOWED_FILE_TYPES.includes(idDocument.type)) {
      validationErrors.push('ID document must be a JPG, PNG, or WebP image');
    } else if (idDocument.size > MAX_FILE_SIZE) {
      validationErrors.push('ID document must be less than 5MB');
    }

    // Validate and process proof photos
    const proofPhotos = formData.getAll('proofPhotos') as File[];
    if (proofPhotos.length === 0) {
      validationErrors.push('At least one proof photo is required');
    } else {
      for (const photo of proofPhotos) {
        if (!ALLOWED_FILE_TYPES.includes(photo.type)) {
          validationErrors.push('All proof photos must be JPG, PNG, or WebP images');
          break;
        }
        if (photo.size > MAX_FILE_SIZE) {
          validationErrors.push('All proof photos must be less than 5MB');
          break;
        }
      }
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { errors: validationErrors },
        { status: 400 }
      );
    }

    // Save files
    const idDocumentPath = await saveFile(idDocument, 'id-documents');
    const proofPhotoPaths = await Promise.all(
      proofPhotos.map(photo => saveFile(photo, 'proof-photos'))
    );

    // Send claim request to backend API
    const response = await fetch(`${process.env.API_URL}/hosts/${params.id}/claim`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phone,
        description,
        idDocumentPath,
        proofPhotoPaths
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit claim');
    }

    const data = await response.json();
    return NextResponse.json({
      message: 'Claim submitted successfully',
      data
    });
  } catch (error: any) {
    console.error('Error submitting claim:', error);
    return NextResponse.json(
      { 
        error: 'Failed to submit claim',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}