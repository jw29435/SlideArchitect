# GitHub Pages Deployment Guide

## Automatic Deployment

The SlideArchitect add-in is automatically deployed to GitHub Pages via GitHub Actions.

### Deployment Trigger

The deployment workflow runs:
- **Automatically**: On every push to the `main` branch
- **Manually**: Via the Actions tab > "Deploy to GitHub Pages" > "Run workflow"

### Deployment Process

1. **Checkout**: Pulls the latest code from the repository
2. **Setup Node.js**: Installs Node.js 18
3. **Install Dependencies**: Runs `npm ci` to install packages
4. **Build**: Runs `npm run build` to generate production files
5. **Prepare**: Creates `.nojekyll` file and copies production manifest
6. **Upload**: Uploads the `dist/` folder as a GitHub Pages artifact
7. **Deploy**: Deploys the artifact to GitHub Pages

### Deployment URLs

- **Main Site**: https://jw29435.github.io/SlideArchitect/
- **Taskpane**: https://jw29435.github.io/SlideArchitect/taskpane.html
- **Production Manifest**: https://jw29435.github.io/SlideArchitect/manifest.xml

## Using the Deployed Add-in

### For End Users

1. Download the production manifest:
   ```
   https://jw29435.github.io/SlideArchitect/manifest.xml
   ```

2. Open PowerPoint (Desktop or Online)

3. Go to Insert > Add-ins > Upload My Add-in

4. Upload the downloaded `manifest.xml` file

5. The SlideArchitect add-in will load from GitHub Pages

### Advantages of Hosted Version

- ✅ No local development environment needed
- ✅ Always up-to-date with latest main branch
- ✅ Can be shared with anyone via manifest URL
- ✅ Works from any device with PowerPoint
- ✅ HTTPS enabled (required by Office)

## Local vs Production

### Local Development (manifest.xml)
```xml
<SourceLocation DefaultValue="https://localhost:3000/taskpane.html"/>
```
- For development and testing
- Requires `npm run dev` to be running
- SSL certificate needed for localhost

### Production (manifest-production.xml)
```xml
<SourceLocation DefaultValue="https://jw29435.github.io/SlideArchitect/taskpane.html"/>
```
- Deployed to GitHub Pages
- No local server needed
- Accessible from anywhere

## Monitoring Deployments

### Check Deployment Status

1. Go to the repository on GitHub
2. Click on "Actions" tab
3. View workflow runs and their status
4. Click on a run to see detailed logs

### Troubleshooting Failed Deployments

If a deployment fails:

1. **Check Build Logs**: Review the workflow run logs in Actions tab
2. **Verify Build Locally**: Run `npm run build` locally to test
3. **Check Dependencies**: Ensure package.json has all required dependencies
4. **Review Changes**: Look at recent commits that might have caused issues

### Common Issues

**Build Fails**:
- Syntax errors in JavaScript/CSS
- Missing dependencies
- Webpack configuration errors

**Deployment Fails**:
- GitHub Pages not enabled in repository settings
- Permissions issues with GITHUB_TOKEN
- Branch protection rules

**Add-in Doesn't Load**:
- Manifest URLs incorrect
- CORS issues (check browser console)
- Office.js version incompatibility

## Repository Settings

### GitHub Pages Configuration

Ensure GitHub Pages is configured:

1. Go to repository Settings
2. Navigate to Pages section
3. Source should be set to "GitHub Actions"
4. No custom domain needed (uses github.io)

### Required Permissions

The workflow needs these permissions (already configured):
- `contents: read` - To read repository code
- `pages: write` - To deploy to GitHub Pages
- `id-token: write` - For GitHub Pages authentication

## Updating the Deployment

### Making Changes

1. Make changes to source code
2. Test locally with `npm run dev`
3. Commit and push to your branch
4. Create a pull request to `main`
5. Once merged, deployment happens automatically

### Rolling Back

If a deployment breaks the add-in:

1. Go to Actions > Deployments
2. Find the last working deployment
3. Use Git to revert to that commit:
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

## Performance Considerations

- **First Load**: May take 1-2 seconds to load from GitHub Pages
- **Caching**: Browser caches static assets (JS, CSS, images)
- **CDN**: GitHub Pages uses a CDN for fast global access
- **Size**: Current build is ~20KB (minified JS + assets)

## Security

- All traffic is over HTTPS
- No server-side processing (client-side only)
- API keys never stored on GitHub Pages
- Office.js enforces same-origin policy

## Future Enhancements

Potential improvements to deployment:

- [ ] Add staging environment (deploy from develop branch)
- [ ] Implement versioning in manifest (v1.0.0, v1.1.0)
- [ ] Add deployment notifications (Slack, email)
- [ ] Implement A/B testing with multiple deployments
- [ ] Add automated testing before deployment
- [ ] Cache optimization with service workers

## Support

For deployment issues:
- Check GitHub Actions logs first
- Review this guide for common solutions
- File an issue on GitHub if problem persists
- Include workflow run URL in issue description
