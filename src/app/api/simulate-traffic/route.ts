import { NextResponse } from 'next/server';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const amenitiesCol = collection(db, 'amenities');
    const snapshot = await getDocs(amenitiesCol);
    
    // Process each document
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
  } catch (error: any) {
    console.error('Simulation error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
