import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

export const mirrorDeviceLog = functions.firestore
  .document('device/{deviceId}/device_log/{logId}')
  .onWrite(async (change, context) => {
    const { deviceId, logId } = context.params;

    // Check if document exists after the change (create or update)
    const newLog = change.after.exists ? change.after.data() : null;

    if (!newLog) {
      console.log(`Log ${logId} was deleted — skipping mirror.`);
      return null;  // document was deleted, do nothing
    }

    console.log(`Mirroring log ${logId} for device ${deviceId}`);

    await db.collection('mirrored_logs').doc(deviceId).set({
      ...newLog,
      log_id: logId,
      device_id: deviceId,
      mirrored_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    return null;
  });
