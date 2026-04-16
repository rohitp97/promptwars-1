import { NextResponse, NextRequest } from 'next/server';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const AuthSchema = z.object({
  authorization: z.string().startsWith('Bearer ')
});

/**
 * Simulates traffic updates for Firebase.
 * Secured via basic Authorization header with rigorous Zod validation.
 */
export async function POST(request: NextRequest) {
  try {
    // Security check via Zod parsing
    const headers = { authorization: request.headers.get('authorization') };
    const parsedAuth = AuthSchema.safeParse(headers);
    
    if (!parsedAuth.success || parsedAuth.data.authorization !== `Bearer ${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`) {
      // Using public api key as a mock secret for hackathon simplicity
      return NextResponse.json({ success: false, error: 'Unauthorized route access' }, { status: 401 });
    }

    const amenitiesCol = collection(db, 'amenities');
    const snapshot = await getDocs(amenitiesCol);
    
    const updatePromises = snapshot.docs.map(async (document) => {
      const waitTime = Math.floor(Math.random() * 30) + 1;
      let statusColor = 'green';
      if (waitTime >= 6 && waitTime <= 15) {
        statusColor = 'yellow';
      } else if (waitTime > 15) {
        statusColor = 'red';
      }

      const docRef = doc(db, 'amenities', document.id);
      return updateDoc(docRef, {
        waitTime,
        statusColor
      });
    });

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true, message: 'Traffic simulated' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
