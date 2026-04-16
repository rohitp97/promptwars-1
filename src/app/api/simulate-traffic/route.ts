import { NextResponse, NextRequest } from 'next/server';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

/**
 * Simulates traffic updates for Firebase.
 * Secured via basic Authorization header to prevent abuse.
 */
export async function POST(request: NextRequest) {
  try {
    // Security check
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`) {
      // Using public api key as a mock secret for hackathon simplicity, 
      // ideally this would be a CRON_SECRET or similar server-side only variable.
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
    console.error('Simulation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
