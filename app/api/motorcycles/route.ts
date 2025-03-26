import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Helper to get user from token
function getUserFromRequest(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;

  const token = authHeader.split(' ')[1]; // "Bearer <token>"
  try {
    const decoded = jwt.verify(token, SECRET) as { id: string };
    return decoded;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name } = await req.json();
  if (!name) {
    return NextResponse.json({ error: 'Motorcycle name required' }, { status: 400 });
  }

  const motorcycle = await prisma.motorcycle.create({
    data: {
      name,
      userId: user.id,
    },
  });

  return NextResponse.json(motorcycle, { status: 201 });
}

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const motorcycles = await prisma.motorcycle.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(motorcycles);
}

export async function DELETE(req: NextRequest) {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Motorcycle ID is required' }, { status: 400 });
    }
  
    const motorcycle = await prisma.motorcycle.findUnique({
      where: { id },
    });
  
    if (!motorcycle || motorcycle.userId !== user.id) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
    }
  
    await prisma.motorcycle.delete({
      where: { id },
    });
  
    return NextResponse.json({ message: 'Deleted' });
  }