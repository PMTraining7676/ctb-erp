# CTB ERP

Business app for Corporate Training Bangkok: bookings, training projects, invoices, receipts, reservation letters, certificates and payments.

**Open the app:** https://pmtraining7676.github.io/ctb-erp/

- Works in any modern browser, and can be installed on a phone or computer (Install / Add to Home Screen).
- Your data is saved in the browser on each device — it is not stored on GitHub. Use **Backup** to save a copy, and **Restore from Backup** to move it to another device.
- **Online team and Admin Panel:** team leads get their own login (email and password, made by the admin). On their phone they see only the projects shared with them; every step marked done, problem, expense and remark reaches the admin instantly — with a sound, a popup, the bell, and a phone notification. The **Admin Panel** shows all activity live, who is online, and lets the admin add people, make new passwords, share projects, and remove access at once. An admin who forgets their password uses **Forgot your password?** on the sign-in: Supabase emails a link, and the app opens a page to choose a new one. It runs on the company's own free Supabase project; the database rules (row level security) decide what each person can see.
- **Team updates without a login:** in a training project, **Team → 📲 Invite** still sends a team member the run sheet on WhatsApp, and **📤 Send update** brings their changes back on WhatsApp.
- **Conference & meeting packages:** ready meeting packages (full day, half day, with dinner, residential) and every service charged the way venues charge it — per person per day, per person for the whole programme, per day, as a lump sum, or per trip / unit. Enter the programme dates (first and last day) and the number of days follows. Quotations, pro forma and tax invoices print on the CTB letterhead, with the venue order and a WhatsApp summary from the same booking.
- **Letters from your records:** invitation and confirmation letters fill in the participants, designations, passports, programme, dates and fees from the training.
- **Merchandise per training:** each training project has a **Merchandise** tab — the kit per participant, what was handed out, what is short, supplier orders and a packing list. The Merchandise / Stock page shows every training's needs.
- Turn on **Settings → Passcode lock** on each device: the data there is then encrypted (AES-256) and the app asks for the passcode when it opens.
- To update the app, upload the new `index.html` here; it goes live within a few minutes.

> This repository is public. Never upload backups, client lists or participant files here.
