# Enrollment Test Guide

Follow these steps to test the enrollment flow:

## Step 1: Ensure Dev Server is Running
Make sure your development server is running on http://localhost:3001

## Step 2: Sync Your User Account

### Option A: Direct Sync (Recommended)
1. Visit: http://localhost:3001/sync-user
2. You should see:
   - A loading spinner saying "Syncing your account..."
   - Then a green checkmark with "User synced successfully! Redirecting..."
   - Automatic redirect to dashboard after 1.5 seconds

### Option B: Auto-Sync via Dashboard
1. Visit: http://localhost:3001/dashboard
2. If you see a popup asking to sync, click OK
3. You'll be redirected to the sync page

## Step 3: Verify User Sync
After syncing, you can verify your user exists by checking the console in the browser DevTools:
- Open DevTools (F12)
- Look for messages like "User synced successfully"

## Step 4: Test Enrollment
1. Go to: http://localhost:3001/learn
2. Find the course "Modern Web Development with Next.js"
3. Click "Enroll Now"
4. You should:
   - See no error message
   - Be redirected to the course page
   - The button should change to "Continue Learning"

## Step 5: Verify Enrollment
1. Go back to: http://localhost:3001/learn
2. Click on "My Courses" tab
3. You should see the enrolled course there

## Troubleshooting

### If sync fails:
1. Make sure you're logged in through Clerk
2. Check browser console for errors
3. Try signing out and back in

### If enrollment still fails:
1. Check browser console for specific error messages
2. The error message should now be more descriptive

### To manually check your user in database:
Run this command in terminal:
```bash
node scripts/list-users.js
```

You should see your email listed.

## Expected Flow
1. First visit → User not in database
2. Sync page → Creates user in database
3. Enrollment → Works successfully
4. Future visits → No sync needed

Happy testing! 🚀
