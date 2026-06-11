import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;
const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY;
const CRON_SECRET = process.env.CRON_SECRET;

export default async function handler(req, res) {
  // Verify this is called by Vercel cron (or our own secure header)
  if (req.headers['authorization'] !== `Bearer ${CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const inThreeDays = new Date(today);
  inThreeDays.setDate(inThreeDays.getDate() + 3);

  // Fetch all items expiring within 3 days (including today/expired)
  const { data: items, error: itemsErr } = await supabase
    .from('fridge_items')
    .select('id, user_id, name, expiry_date')
    .lte('expiry_date', inThreeDays.toISOString().split('T')[0])
    .order('expiry_date', { ascending: true });

  if (itemsErr) return res.status(500).json({ error: itemsErr.message });
  if (!items?.length) return res.json({ sent: 0, message: 'No expiring items' });

  // Check today's alert log to avoid duplicates
  const todayStr = today.toISOString().split('T')[0];
  const { data: alreadySent } = await supabase
    .from('alert_log')
    .select('user_id')
    .gte('sent_at', todayStr);

  const alreadySentIds = new Set((alreadySent || []).map(r => r.user_id));

  // Group items by user_id, skipping users already alerted today
  const byUser = {};
  for (const item of items) {
    if (alreadySentIds.has(item.user_id)) continue;
    if (!byUser[item.user_id]) byUser[item.user_id] = [];
    byUser[item.user_id].push(item);
  }

  const userIds = Object.keys(byUser);
  if (!userIds.length) return res.json({ sent: 0, message: 'All users already alerted today' });

  // Fetch user emails + notification preferences
  const { data: prefs } = await supabase
    .from('user_preferences')
    .select('user_id, notif_on, push_token')
    .in('user_id', userIds);

  const prefMap = {};
  for (const p of prefs || []) prefMap[p.user_id] = p;

  // Fetch auth emails via admin API
  const { data: authData } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  const emailMap = {};
  for (const u of authData?.users || []) emailMap[u.id] = u.email;

  let sent = 0;
  const logEntries = [];

  for (const userId of userIds) {
    const pref = prefMap[userId];
    if (pref && pref.notif_on === false) continue; // user opted out

    const userItems = byUser[userId];
    const email = emailMap[userId];

    // Send email via Resend
    if (email && RESEND_API_KEY) {
      const itemLines = userItems
        .map(i => {
          const exp = new Date(i.expiry_date);
          const diff = Math.round((exp - today) / 86400000);
          const label = diff < 0 ? 'expired' : diff === 0 ? 'expires today' : `expires in ${diff} day${diff !== 1 ? 's' : ''}`;
          return `<li><strong>${i.name}</strong> — ${label}</li>`;
        })
        .join('\n');

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'ClearMyFridge <alerts@clearmyfridge.app>',
          to: [email],
          subject: `${userItems.length} item${userItems.length !== 1 ? 's' : ''} expiring soon in your fridge`,
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
              <h2 style="color:#1D9E75;margin:0 0 8px">Fridge check</h2>
              <p style="color:#555;margin:0 0 20px">
                ${userItems.length} item${userItems.length !== 1 ? 's' : ''} in your fridge need${userItems.length === 1 ? 's' : ''} attention:
              </p>
              <ul style="padding-left:20px;line-height:2;color:#333">${itemLines}</ul>
              <p style="margin:24px 0 0">
                <a href="https://clearmyfridge.vercel.app" style="background:#1D9E75;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600">
                  Open ClearMyFridge
                </a>
              </p>
              <p style="margin:24px 0 0;font-size:12px;color:#999">
                You're receiving this because you have expiry alerts enabled.
                Manage in <a href="https://clearmyfridge.vercel.app" style="color:#1D9E75">Settings</a>.
              </p>
            </div>
          `,
        }),
      }).catch(() => {}); // silent on email failure
    }

    // Send push via OneSignal
    if (ONESIGNAL_APP_ID && ONESIGNAL_API_KEY && pref?.push_token) {
      const names = userItems.slice(0, 3).map(i => i.name).join(', ');
      const more = userItems.length > 3 ? ` +${userItems.length - 3} more` : '';

      await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${ONESIGNAL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          app_id: ONESIGNAL_APP_ID,
          include_player_ids: [pref.push_token],
          headings: { en: 'Fridge check' },
          contents: { en: `${names}${more} expiring soon` },
          url: 'https://clearmyfridge.vercel.app',
        }),
      }).catch(() => {}); // silent on push failure
    }

    logEntries.push({ user_id: userId, items_count: userItems.length, sent_at: new Date().toISOString() });
    sent++;
  }

  // Write to alert_log
  if (logEntries.length) {
    await supabase.from('alert_log').insert(logEntries);
  }

  return res.json({ sent, total_users: userIds.length });
}
