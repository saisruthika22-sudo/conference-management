# Render.com Deployment Guide

This document provides instructions for deploying the Conference Management application on Render.com (replacement for Vercel).

## Prerequisites

- GitHub account with repository access
- Render.com account (https://render.com)
- Google Generative AI API key from https://makersuite.google.com/app/apikey

## Deployment Steps

### 1. Connect Repository to Render

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Select the `conference-management` repository

### 2. Configure Build Settings

Render will auto-detect the configuration from `render.yaml`. The configuration includes:

- **Runtime**: Node.js 20
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run preview`
- **Build Directory**: `dist`

### 3. Set Environment Variables

In the Render dashboard for your service:

1. Go to "Environment" section
2. Add the following environment variable:
   - **Key**: `VITE_GEMINI_API_KEY`
   - **Value**: Your Google Generative AI API key

**IMPORTANT**: Do NOT commit your API key to the repository. It should only be set in the Render dashboard.

### 4. Deploy

1. Click "Create Web Service"
2. Render will automatically deploy when you push to the main branch
3. Monitor the build logs for any errors

## Configuration Files

- **render.yaml**: Main deployment configuration
- **.env.example**: Template for local development
- **.env.production**: Reference for production environment variables

## Build Process

The application uses Vite for building:

```bash
npm install           # Install dependencies
npm run build        # Build for production (creates dist/)
npm run preview      # Start preview server
```

## Environment Variables

### Build-time Variables (VITE_*)

These are available during the Vite build process:

- `VITE_GEMINI_API_KEY`: Google Generative AI API key

### How Build-time Variables Work

Vite processes these variables at build time. They are baked into the JavaScript bundle as strings. This is safe because:

1. The API key is not exposed in HTML/CSS
2. It's only used in the built JavaScript
3. The key is necessary for client-side AI operations

**Security Note**: For production use, consider implementing a backend API proxy for sensitive operations.

## Troubleshooting

### Build Fails with "API Key not found"

- Check that `VITE_GEMINI_API_KEY` is set in Render dashboard
- Ensure the variable name is exactly `VITE_GEMINI_API_KEY`
- Trigger a new deployment after adding/changing the variable

### Site Shows Blank Page

- Check browser console for errors
- Verify the API key is valid and has proper permissions
- Check Render logs for build errors

### Deploy from Local Machine

If you need to trigger a deployment without pushing:

1. Go to the Render dashboard
2. Click your service
3. Click "Manual Deploy" button

## Differences from Vercel

| Feature | Vercel | Render |
|---------|--------|--------|
| Config File | vercel.json | render.yaml |
| Free Tier | Yes (with limits) | Yes (with limits) |
| Build Cache | Automatic | Automatic |
| Environment Vars | Via UI | Via UI |
| Database Support | Add-ons | Paid plans |

## Resources

- [Render Documentation](https://render.com/docs)
- [Vite Documentation](https://vitejs.dev)
- [Google Generative AI](https://ai.google.dev)

## Support

For deployment issues, check:

1. Render Logs in dashboard
2. Repository `render.yaml` configuration
3. Environment variables in Render dashboard
4. GitHub Actions (if configured)
